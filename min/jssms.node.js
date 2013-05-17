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
  var $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ = this.$c$.$z$, $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$c$.$z$ = $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ = this.$d$;
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$j$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$e$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$h$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$f$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$d$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ && ($JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$.$g$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $currentAddress$$inline_204_fractional$$inline_13$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $currentAddress$$inline_204_fractional$$inline_13$$, $currentAddress$$inline_204_fractional$$inline_13$$ = $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ - ($JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ >> 16
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
  $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$ = this.$a$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$G$.$b$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ = 16384 * $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$rom$.length, $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$, $i$$inline_205$$ = 0, $addresses$$inline_206$$ = [];
  $addresses$$inline_206$$.push(0);
  $addresses$$inline_206$$.push(56);
  for($addresses$$inline_206$$.push(102);$addresses$$inline_206$$.length;) {
    if($currentAddress$$inline_204_fractional$$inline_13$$ = $addresses$$inline_206$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$currentAddress$$inline_204_fractional$$inline_13$$]) {
      if($currentAddress$$inline_204_fractional$$inline_13$$ >= $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$ || 65 <= $currentAddress$$inline_204_fractional$$inline_13$$ >> 10) {
        console.log("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$inline_204_fractional$$inline_13$$))
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$, $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $currentAddress$$inline_204_fractional$$inline_13$$;
        $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
        var $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = [$instruction$$inline_203_opcode$$inline_267_options$$inline_290$$], $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "Unknown Opcode", $currAddr$$inline_270_prop$$inline_292$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$, $address$$inline_282_target$$inline_271$$ = $JSCompiler_alias_NULL$$, $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($instruction$$inline_203_opcode$$inline_267_options$$inline_290$$) + 
        '";', $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = "", $code$$inline_281_location$$inline_274_target$$inline_287$$ = 0;
        $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
        switch($instruction$$inline_203_opcode$$inline_267_options$$inline_290$$) {
          case 0:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "NOP";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 1:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD BC," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setBC(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 2:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (BC),A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC BC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 7:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RLCA";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "EX AF AF'";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD HL,BC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,(BC)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC BC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 15:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RRCA";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 5;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 17:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD DE," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setDE(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 18:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (DE),A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC DE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 23:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RLA";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $JSCompiler_alias_NULL$$;
            break;
          case 25:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD HL,DE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,(DE)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC DE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 31:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RRA";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 5;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 33:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD HL," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 34:
            $code$$inline_281_location$$inline_274_target$$inline_287$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($code$$inline_281_location$$inline_274_target$$inline_287$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "),HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($code$$inline_281_location$$inline_274_target$$inline_287$$ + 1) + ", this.h);";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 35:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 39:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DAA";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 5;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 41:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD HL,HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD HL,(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.readMemWord(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "));";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 43:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 47:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CPL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 5;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 49:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD SP," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sp = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 50:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "),A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ", this.a);";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 51:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC SP";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC (HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC (HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL)," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 55:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SCF";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + 1);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 5;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 57:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD HL,SP";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.readMem(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 59:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC SP";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "INC A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DEC A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ";";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 63:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CCF";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 65:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD B,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 74:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD C,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 83:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD D,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 92:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD E,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 101:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD H,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 110:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD L,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "HALT";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.tstates = 0;";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ += "this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "; return;";
            break;
          case 119:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD (HL),A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 128:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$m$[0]) + "; this.a = " + $JSSMS$Utils$toHex$$(0) + ";";
            break;
          case 176:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,B";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,D";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,E";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,H";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,L";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,(HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP A,A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET NZ";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "POP BC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 195:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $JSCompiler_alias_NULL$$;
            break;
          case 196:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 197:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "PUSH BC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADD A," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.add_a(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 199:
            $address$$inline_282_target$$inline_271$$ = 0;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 200:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET Z";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $JSCompiler_alias_NULL$$;
            break;
          case 202:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 203:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$];
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$;
            $code$$inline_281_location$$inline_274_target$$inline_287$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$) {
              case 0:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC C";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.c = (this.rlc(this.c));";
                break;
              case 2:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC D";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.d = (this.rlc(this.d));";
                break;
              case 3:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC E";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.e = (this.rlc(this.e));";
                break;
              case 4:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC H";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.h = (this.rlc(this.h));";
                break;
              case 5:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC L";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.l = (this.rlc(this.l));";
                break;
              case 6:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC (HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
                break;
              case 7:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLC A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a = (this.rlc(this.a));";
                break;
              case 8:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC B";
                break;
              case 9:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC C";
                break;
              case 10:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC D";
                break;
              case 11:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC E";
                break;
              case 12:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC H";
                break;
              case 13:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC L";
                break;
              case 14:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC (HL)";
                break;
              case 15:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRC A";
                break;
              case 16:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL B";
                break;
              case 17:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL C";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.c = (this.rl(this.c));";
                break;
              case 18:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL D";
                break;
              case 19:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL E";
                break;
              case 20:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL H";
                break;
              case 21:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL L";
                break;
              case 22:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL (HL)";
                break;
              case 23:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RL A";
                break;
              case 24:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.b = (this.rr(this.b));";
                break;
              case 25:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR C";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.c = (this.rr(this.c));";
                break;
              case 26:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR D";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.d = (this.rr(this.d));";
                break;
              case 27:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR E";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.e = (this.rr(this.e));";
                break;
              case 28:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR H";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.h = (this.rr(this.h));";
                break;
              case 29:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR L";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.l = (this.rr(this.l));";
                break;
              case 30:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR (HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
                break;
              case 31:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RR A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a = (this.rr(this.a));";
                break;
              case 32:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA B";
                break;
              case 33:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA C";
                break;
              case 34:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA D";
                break;
              case 35:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA E";
                break;
              case 36:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA H";
                break;
              case 37:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA L";
                break;
              case 38:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA (HL)";
                break;
              case 39:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLA A";
                break;
              case 40:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA B";
                break;
              case 41:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA C";
                break;
              case 42:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA D";
                break;
              case 43:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA E";
                break;
              case 44:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA H";
                break;
              case 45:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA L";
                break;
              case 46:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA (HL)";
                break;
              case 47:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRA A";
                break;
              case 48:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL B";
                break;
              case 49:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL C";
                break;
              case 50:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL D";
                break;
              case 51:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL E";
                break;
              case 52:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL H";
                break;
              case 53:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL L";
                break;
              case 54:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL (HL)";
                break;
              case 55:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SLL A";
                break;
              case 56:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL B";
                break;
              case 57:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL C";
                break;
              case 58:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL D";
                break;
              case 59:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL E";
                break;
              case 60:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL H";
                break;
              case 61:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL L";
                break;
              case 62:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL (HL)";
                break;
              case 63:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SRL A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a = this.srl(this.a);";
                break;
              case 64:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,B";
                break;
              case 65:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,C";
                break;
              case 66:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,D";
                break;
              case 67:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,E";
                break;
              case 68:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,H";
                break;
              case 69:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,L";
                break;
              case 70:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
                break;
              case 71:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 0,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_0);";
                break;
              case 72:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,B";
                break;
              case 73:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,C";
                break;
              case 74:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,D";
                break;
              case 75:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,E";
                break;
              case 76:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,H";
                break;
              case 77:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,L";
                break;
              case 78:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
                break;
              case 79:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 1,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_1);";
                break;
              case 80:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.b & BIT_2);";
                break;
              case 81:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,C";
                break;
              case 82:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,D";
                break;
              case 83:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,E";
                break;
              case 84:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,H";
                break;
              case 85:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,L";
                break;
              case 86:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
                break;
              case 87:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 2,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_2);";
                break;
              case 88:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.b & BIT_3);";
                break;
              case 89:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,C";
                break;
              case 90:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,D";
                break;
              case 91:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,E";
                break;
              case 92:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,H";
                break;
              case 93:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,L";
                break;
              case 94:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
                break;
              case 95:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 3,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_3);";
                break;
              case 96:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,B";
                break;
              case 97:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,C";
                break;
              case 98:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,D";
                break;
              case 99:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,E";
                break;
              case 100:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,H";
                break;
              case 101:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,L";
                break;
              case 102:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
                break;
              case 103:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 4,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_4);";
                break;
              case 104:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.b & BIT_5);";
                break;
              case 105:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,C";
                break;
              case 106:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,D";
                break;
              case 107:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,E";
                break;
              case 108:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,H";
                break;
              case 109:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,L";
                break;
              case 110:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
                break;
              case 111:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 5,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_5);";
                break;
              case 112:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,B";
                break;
              case 113:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,C";
                break;
              case 114:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,D";
                break;
              case 115:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,E";
                break;
              case 116:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,H";
                break;
              case 117:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,L";
                break;
              case 118:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
                break;
              case 119:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 6,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_6);";
                break;
              case 120:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,B";
                break;
              case 121:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,C";
                break;
              case 122:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,D";
                break;
              case 123:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,E";
                break;
              case 124:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,H";
                break;
              case 125:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,L";
                break;
              case 126:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
                break;
              case 127:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "BIT 7,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.bit(this.a & BIT_7);";
                break;
              case 128:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,B";
                break;
              case 129:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,C";
                break;
              case 130:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,D";
                break;
              case 131:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,E";
                break;
              case 132:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,H";
                break;
              case 133:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,L";
                break;
              case 134:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
                break;
              case 135:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 0,A";
                break;
              case 136:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
                break;
              case 143:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
                break;
              case 151:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
                break;
              case 159:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 3,A";
                break;
              case 160:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
                break;
              case 167:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 4,A";
                break;
              case 168:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
                break;
              case 175:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
                break;
              case 183:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 6,A";
                break;
              case 184:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,B";
                break;
              case 185:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,C";
                break;
              case 186:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,D";
                break;
              case 187:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,E";
                break;
              case 188:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,H";
                break;
              case 189:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,L";
                break;
              case 190:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
                break;
              case 191:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RES 7,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a &= ~BIT_7;";
                break;
              case 192:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,B";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.b |= BIT_0;";
                break;
              case 193:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,C";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.c |= BIT_0;";
                break;
              case 194:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,D";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.d |= BIT_0;";
                break;
              case 195:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,E";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.e |= BIT_0;";
                break;
              case 196:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,H";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.h |= BIT_0;";
                break;
              case 197:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,L";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.l |= BIT_0;";
                break;
              case 198:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
                break;
              case 199:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 0,A";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a |= BIT_0;";
                break;
              case 200:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
                break;
              case 207:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
                break;
              case 215:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
                break;
              case 223:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
                break;
              case 231:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 4,A";
                break;
              case 232:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
                break;
              case 239:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 5,A";
                break;
              case 240:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,B";
                break;
              case 241:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,C";
                break;
              case 242:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,D";
                break;
              case 243:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,E";
                break;
              case 244:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,H";
                break;
              case 245:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,L";
                break;
              case 246:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
                break;
              case 247:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 6,A";
                break;
              case 248:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,B";
                break;
              case 249:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,C";
                break;
              case 250:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,D";
                break;
              case 251:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,E";
                break;
              case 252:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,H";
                break;
              case 253:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,L";
                break;
              case 254:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,(HL)";
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
                break;
              case 255:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SET 7,A", $code$$inline_281_location$$inline_274_target$$inline_287$$ = "this.a |= BIT_7;"
            }
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$, $opcodes$:$inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$, $inst$:$code$$inline_272_inst$$inline_279_inst$$inline_285$$, code:$code$$inline_281_location$$inline_274_target$$inline_287$$, $address$:$_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$, 
            $nextAddress$:$address$$inline_266_address$$inline_276_opcode$$inline_283$$};
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$inst$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.code;
            $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.concat($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$opcodes$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 205:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 206:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "ADC ," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.adc_a(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 207:
            $address$$inline_282_target$$inline_271$$ = 8;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 208:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET NC";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "POP DE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 211:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$) + "),A";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$, $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 212:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 213:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "PUSH DE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SUB " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "";
            break;
          case 215:
            $address$$inline_282_target$$inline_271$$ = 16;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 216:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET C";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "EXX";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 219:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$, $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 220:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 221:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$, "IX", $address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$inst$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.code;
            $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.concat($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$opcodes$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$nextAddress$;
            break;
          case 222:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "SBC A," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sbc_a(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 223:
            $address$$inline_282_target$$inline_271$$ = 24;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 224:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET PO";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "POP HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 227:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "EX (SP),HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 229:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "PUSH HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "AND (" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "] | F_HALFCARRY;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 231:
            $address$$inline_282_target$$inline_271$$ = 32;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 232:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET PE";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP (HL)";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.pc = this.getHL(); return;";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $JSCompiler_alias_NULL$$;
            break;
          case 234:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 235:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "EX DE,HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 237:
            var $address$$inline_282_target$$inline_271$$ = $address$$inline_266_address$$inline_276_opcode$$inline_283$$, $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_282_target$$inline_271$$), $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = [$address$$inline_266_address$$inline_276_opcode$$inline_283$$], $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = 
            "Unimplemented 0xED prefixed opcode", $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $address$$inline_282_target$$inline_271$$, $code$$inline_281_location$$inline_274_target$$inline_287$$ = $JSCompiler_alias_NULL$$, $code$$inline_288$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_289$$ = "";
            $address$$inline_282_target$$inline_271$$++;
            switch($address$$inline_266_address$$inline_276_opcode$$inline_283$$) {
              case 64:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN B,(C)";
                $code$$inline_288$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
                break;
              case 65:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),B";
                $code$$inline_288$$ = "this.port.out(this.c, this.b);";
                break;
              case 66:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SBC HL,BC";
                $code$$inline_288$$ = "this.sbc16(this.getBC());";
                break;
              case 67:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + "),BC";
                $code$$inline_288$$ = "var location = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + ";this.writeMem(location++, this.c);this.writeMem(location, this.b);";
                $address$$inline_282_target$$inline_271$$ += 2;
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
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "NEG";
                $code$$inline_288$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RETN / RETI";
                $code$$inline_288$$ = "this.pc = this.readMemWord(this.sp);this.sp += 2;this.iff1 = this.iff2;";
                $address$$inline_282_target$$inline_271$$ = $JSCompiler_alias_NULL$$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IM 0";
                $code$$inline_288$$ = "this.im = 0;";
                break;
              case 71:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD I,A";
                $code$$inline_288$$ = "this.i = this.a;";
                break;
              case 72:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN C,(C)";
                $code$$inline_288$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
                break;
              case 73:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),C";
                $code$$inline_288$$ = "this.port.out(this.c, this.c);";
                break;
              case 74:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "ADC HL,BC";
                $code$$inline_288$$ = "this.adc16(this.getBC());";
                break;
              case 75:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD BC,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + ")";
                $code$$inline_288$$ = "this.setBC(this.readMemWord(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + "));";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 79:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD R,A";
                $code$$inline_288$$ = "this.r = this.a;";
                break;
              case 80:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN D,(C)";
                $code$$inline_288$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
                break;
              case 81:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),D";
                $code$$inline_288$$ = "this.port.out(this.c, this.d);";
                break;
              case 82:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SBC HL,DE";
                $code$$inline_288$$ = "this.sbc16(this.getDE());";
                break;
              case 83:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + "),DE";
                $code$$inline_288$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.e);this.writeMem(location, this.d);";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IM 1";
                $code$$inline_288$$ = "this.im = 1;";
                break;
              case 87:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD A,I";
                $code$$inline_288$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 88:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN E,(C)";
                $code$$inline_288$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
                break;
              case 89:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),E";
                $code$$inline_288$$ = "this.port.out(this.c, this.e);";
                break;
              case 90:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "ADC HL,DE";
                $code$$inline_288$$ = "this.adc16(this.getDE());";
                break;
              case 91:
                $operand$$inline_289$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$));
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD DE,(" + $operand$$inline_289$$ + ")";
                $code$$inline_288$$ = "this.setDE(" + $operand$$inline_289$$ + ");";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 95:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD A,R";
                $code$$inline_288$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_288$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN H,(C)";
                $code$$inline_288$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
                break;
              case 97:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),H";
                $code$$inline_288$$ = "this.port.out(this.c, this.h);";
                break;
              case 98:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SBC HL,HL";
                $code$$inline_288$$ = "this.sbc16(this.getHL());";
                break;
              case 99:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + "),HL";
                $code$$inline_288$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.l);this.writeMem(location, this.h);";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 103:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RRD";
                $code$$inline_288$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 104:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN L,(C)";
                $code$$inline_288$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
                break;
              case 105:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),L";
                $code$$inline_288$$ = "this.port.out(this.c, this.l);";
                break;
              case 106:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "ADC HL,HL";
                $code$$inline_288$$ = "this.adc16(this.getHL());";
                break;
              case 107:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD HL,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + ")";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 111:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "RLD";
                break;
              case 113:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),0";
                break;
              case 114:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "SBC HL,SP";
                break;
              case 115:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + "),SP";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 120:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IN A,(C)";
                $code$$inline_288$$ = "this.a = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 121:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUT (C),A";
                $code$$inline_288$$ = "this.port.out(this.c, this.a);";
                break;
              case 122:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "ADC HL,SP";
                break;
              case 123:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LD SP,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_282_target$$inline_271$$)) + ")";
                $address$$inline_282_target$$inline_271$$ += 2;
                break;
              case 160:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LDI";
                $code$$inline_288$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);";
                break;
              case 161:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "CPI";
                break;
              case 162:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "INI";
                $code$$inline_288$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 163:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUTI";
                $code$$inline_288$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LDD";
                break;
              case 169:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "CPD";
                break;
              case 170:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "IND";
                $code$$inline_288$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 171:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OUTD";
                $code$$inline_288$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 176:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LDIR";
                $code$$inline_288$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();";
                $code$$inline_288$$ += "for (;this.getBC() != 0; this.f |= F_PARITY, this.tstates -= 5) {this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();}";
                $code$$inline_288$$ += "if (!(this.getBC() != 0)) this.f &= ~ F_PARITY;this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "CPIR";
                $code$$inline_288$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);";
                $code$$inline_288$$ += "for (;(temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0; this.tstates -= 5) {temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);}";
                $code$$inline_288$$ += "this.f = (this.f & 0xF8) | temp;";
                break;
              case 178:
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = $address$$inline_282_target$$inline_271$$ - 2;
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "INIR";
                $code$$inline_288$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_281_location$$inline_274_target$$inline_287$$) + ";}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 179:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OTIR";
                $code$$inline_288$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();";
                $code$$inline_288$$ += "for (;this.b != 0; this.tstates -= 5) {temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();}";
                $code$$inline_288$$ += "if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "LDDR";
                break;
              case 185:
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "CPDR";
                break;
              case 186:
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = $address$$inline_282_target$$inline_271$$ - 2;
                $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "INDR";
                $code$$inline_288$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_281_location$$inline_274_target$$inline_287$$) + ";}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 187:
                $code$$inline_281_location$$inline_274_target$$inline_287$$ = $address$$inline_282_target$$inline_271$$ - 2, $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "OTDR", $code$$inline_288$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_281_location$$inline_274_target$$inline_287$$) + ";}if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;"
            }
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = {$opcode$:$address$$inline_266_address$$inline_276_opcode$$inline_283$$, $opcodes$:$inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$, $inst$:$code$$inline_272_inst$$inline_279_inst$$inline_285$$, code:$code$$inline_288$$, $address$:$_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$, $nextAddress$:$address$$inline_282_target$$inline_271$$, target:$code$$inline_281_location$$inline_274_target$$inline_287$$};
            $address$$inline_282_target$$inline_271$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.target;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$inst$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.code;
            $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.concat($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$opcodes$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$nextAddress$;
            break;
          case 238:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "XOR A," + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "];";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 239:
            $address$$inline_282_target$$inline_271$$ = 40;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 240:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET P";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "POP AF";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 243:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "DI";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 245:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "PUSH AF";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "OR " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + "];";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 247:
            $address$$inline_282_target$$inline_271$$ = 48;
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$);
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;";
            break;
          case 248:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RET M";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "LD SP,HL";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 251:
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "EI";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_282_target$$inline_271$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$l$($address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ")";
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + ";this.tstates -= 7;return;}";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ += 2;
            break;
          case 253:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$, "IY", $address$$inline_266_address$$inline_276_opcode$$inline_283$$);
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$inst$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.code;
            $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.concat($_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$opcodes$);
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$ = $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$.$nextAddress$;
            break;
          case 254:
            $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$.$a$($address$$inline_266_address$$inline_276_opcode$$inline_283$$));
            $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "CP " + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$;
            $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.cp_a(" + $_inst$$inline_275_currAddr$$inline_280_currAddr$$inline_286_operand$$inline_273$$ + ");";
            $address$$inline_266_address$$inline_276_opcode$$inline_283$$++;
            break;
          case 255:
            $address$$inline_282_target$$inline_271$$ = 56, $inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$), $code$$inline_272_inst$$inline_279_inst$$inline_285$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_266_address$$inline_276_opcode$$inline_283$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_282_target$$inline_271$$) + "; return;"
        }
        $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$ = {$opcode$:$instruction$$inline_203_opcode$$inline_267_options$$inline_290$$, $opcodes$:$defaultInstruction$$inline_291_opcodesArray$$inline_268$$, $inst$:$inst$$inline_269_opcodesArray$$inline_278_opcodesArray$$inline_284$$, code:$code$$inline_272_inst$$inline_279_inst$$inline_285$$, $address$:$currAddr$$inline_270_prop$$inline_292$$, $nextAddress$:$address$$inline_266_address$$inline_276_opcode$$inline_283$$, target:$address$$inline_282_target$$inline_271$$};
        $defaultInstruction$$inline_291_opcodesArray$$inline_268$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:$JSCompiler_alias_NULL$$, target:$JSCompiler_alias_NULL$$, $isJumpTarget$:$JSCompiler_alias_FALSE$$, label:""};
        $currAddr$$inline_270_prop$$inline_292$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$ = "";
        for($currAddr$$inline_270_prop$$inline_292$$ in $defaultInstruction$$inline_291_opcodesArray$$inline_268$$) {
          $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$[$currAddr$$inline_270_prop$$inline_292$$] != $JSCompiler_alias_VOID$$ && ($defaultInstruction$$inline_291_opcodesArray$$inline_268$$[$currAddr$$inline_270_prop$$inline_292$$] = $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$[$currAddr$$inline_270_prop$$inline_292$$])
        }
        $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$address$);
        $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
        $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.label = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self$$inline_265_hexOpcodes$$inline_293_opcode$$inline_277$$ + $defaultInstruction$$inline_291_opcodesArray$$inline_268$$.$inst$;
        $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$ = $defaultInstruction$$inline_291_opcodesArray$$inline_268$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$currentAddress$$inline_204_fractional$$inline_13$$] = $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$;
        $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$.$nextAddress$ != $JSCompiler_alias_NULL$$ && $addresses$$inline_206$$.push($instruction$$inline_203_opcode$$inline_267_options$$inline_290$$.$nextAddress$);
        $instruction$$inline_203_opcode$$inline_267_options$$inline_290$$.target != $JSCompiler_alias_NULL$$ && $addresses$$inline_206$$.push($instruction$$inline_203_opcode$$inline_267_options$$inline_290$$.target)
      }
    }
  }
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[0].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;$i$$inline_205$$ < $JSCompiler_StaticMethods_init$self$$inline_197_mode$$inline_9_romSize$$inline_202_v$$inline_12$$;$i$$inline_205$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$i$$inline_205$$] && $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$i$$inline_205$$].target != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$i$$inline_205$$].target] ? 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$i$$inline_205$$].target].$isJumpTarget$ = $JSCompiler_alias_TRUE$$ : console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$w$[$i$$inline_205$$].target))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_15_clockSpeedHz$$inline_10_i$$inline_11_i$$inline_199$$.$G$.$b$.updateStatus("Instructions parsed");
  clearInterval(this.$g$)
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = $JSCompiler_alias_TRUE$$);
  this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen);
  this.$h$ = $JSSMS$Utils$getTimestamp$$();
  this.$fpsFrameCount$ = 0;
  this.$g$ = setInterval(function() {
    var $now$$inline_20$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$b$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_20$$ - $self$$1$$.$h$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$h$ = $now$$inline_20$$
  }, 500);
  this.$b$.updateStatus("Running")
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  clearInterval(this.$g$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if(this.$isRunning$) {
    for(var $startTime$$inline_23$$ = 0, $lineno$$inline_24$$ = 0;$lineno$$inline_24$$ < this.$no_of_scanlines$;$lineno$$inline_24$$++) {
      var $startTime$$inline_23$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_run$self$$inline_208$$ = this.$a$;
      $JSCompiler_StaticMethods_run$self$$inline_208$$.$o$ += this.$cyclesPerLine$;
      if($JSCompiler_StaticMethods_run$self$$inline_208$$.$B$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_295$$ = $JSCompiler_StaticMethods_run$self$$inline_208$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$z$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$F$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$d$++, $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$F$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$z$ = $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$A$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$B$ = $JSCompiler_alias_FALSE$$, 
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_295$$, $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$d$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$H$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$d$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$I$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$I$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$I$, $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$o$ -= 
        13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$H$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$d$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$d$ = $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$l$(($JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$L$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$I$), $JSCompiler_StaticMethods_interrupt$self$$inline_295$$.$o$ -= 
        19))
      }
      for(;0 < $JSCompiler_StaticMethods_run$self$$inline_208$$.$o$;) {
        var $JSCompiler_StaticMethods_interpret$self$$inline_297$$ = $JSCompiler_StaticMethods_run$self$$inline_208$$, $location$$inline_298$$ = 0, $temp$$inline_299$$ = 0, $opcode$$inline_300$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
        $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= $OP_STATES$$[$opcode$$inline_300$$];
        switch($opcode$$inline_300$$) {
          case 1:
            var $value$$inline_301$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $value$$inline_301$$ >> 8;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $value$$inline_301$$ & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
            break;
          case 2:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 3:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ && ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ + 1 & 255);
            break;
          case 4:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 5:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 6:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 7:
            var $carry$$inline_302$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ >> 7;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ << 1 & 255 | $carry$$inline_302$$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 236 | $carry$$inline_302$$;
            break;
          case 8:
            var $temp$$inline_303$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$N$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$N$ = $temp$$inline_303$$;
            $temp$$inline_303$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$S$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$S$ = $temp$$inline_303$$;
            break;
          case 9:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 10:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 11:
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 12:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 13:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 14:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 15:
            var $carry$$inline_304$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 1;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ >> 1 | $carry$$inline_304$$ << 7;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 236 | $carry$$inline_304$$;
            break;
          case 16:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ - 1 & 255;
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 17:
            var $value$$inline_305$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $value$$inline_305$$ >> 8;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $value$$inline_305$$ & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
            break;
          case 18:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 19:
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 20:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 21:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 22:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 23:
            var $carry$$inline_306$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ >> 7;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ << 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1) & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 236 | $carry$$inline_306$$;
            break;
          case 24:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + 1);
            break;
          case 25:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 26:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 27:
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 28:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 29:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 30:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 31:
            var $carry$$inline_307$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 1;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ >> 1 | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1) << 7) & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 236 | $carry$$inline_307$$;
            break;
          case 32:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 33:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
            break;
          case 34:
            $location$$inline_298$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_298$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$(++$location$$inline_298$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
            break;
          case 35:
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 36:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 37:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 38:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 39:
            var $temp$$inline_308$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$V$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 16) << 6];
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $temp$$inline_308$$ & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 2 | $temp$$inline_308$$ >> 8;
            break;
          case 40:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 41:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 42:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$)));
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
            break;
          case 43:
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 44:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 45:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 46:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 47:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 18;
            break;
          case 48:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 49:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
            break;
          case 50:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
            break;
          case 51:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$++;
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 54:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 55:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -3;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17;
            break;
          case 56:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 57:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
            break;
          case 58:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$));
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
            break;
          case 59:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$--;
            break;
          case 60:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 61:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 62:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            break;
          case 63:
            0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1) ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -2, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -3;
            break;
          case 65:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 66:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 67:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 68:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 69:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 70:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 71:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 72:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 74:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 75:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 76:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 77:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 78:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 79:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 80:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 81:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 83:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 84:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 85:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 86:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 87:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 88:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 89:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 90:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 92:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 93:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 94:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 95:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 96:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 97:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 98:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 99:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 101:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 102:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 103:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 104:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 105:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 106:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 107:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 108:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 110:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 111:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
            break;
          case 112:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 113:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 114:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 115:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 116:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 117:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 118:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ = 0;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$F$ = $JSCompiler_alias_TRUE$$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--;
            break;
          case 119:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 120:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            break;
          case 121:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            break;
          case 122:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            break;
          case 123:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            break;
          case 124:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            break;
          case 125:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            break;
          case 126:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
            break;
          case 128:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 129:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 130:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 131:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 135:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 136:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 137:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 138:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 139:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 143:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 144:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 145:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 146:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 147:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 151:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 152:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 153:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 154:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 155:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 159:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 160:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$] | 16;
            break;
          case 161:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$] | 16;
            break;
          case 162:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$] | 16;
            break;
          case 163:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$] | 16;
            break;
          case 164:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))] | 16;
            break;
          case 167:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$] | 16;
            break;
          case 168:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$];
            break;
          case 169:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$];
            break;
          case 170:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$];
            break;
          case 171:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$];
            break;
          case 172:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$];
            break;
          case 173:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$];
            break;
          case 174:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
            break;
          case 175:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = 0];
            break;
          case 176:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$];
            break;
          case 177:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$];
            break;
          case 178:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$];
            break;
          case 179:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$];
            break;
          case 180:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$];
            break;
          case 181:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$];
            break;
          case 182:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
            break;
          case 183:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$];
            break;
          case 184:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
            break;
          case 185:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 186:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
            break;
          case 187:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
            break;
          case 191:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 192:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 193:
            var $value$$inline_309$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $value$$inline_309$$ >> 8;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $value$$inline_309$$ & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
            break;
          case 194:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 195:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            break;
          case 196:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 197:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
            break;
          case 198:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 199:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 0;
            break;
          case 200:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 201:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 203:
            var $opcode$$inline_310$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_310$$];
            switch($opcode$$inline_310$$) {
              case 0:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 1:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 2:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 3:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 4:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 5:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 6:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 7:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 8:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 9:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 10:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 11:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 12:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 13:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 14:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 15:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 16:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 17:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 18:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 19:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 20:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 21:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 22:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 23:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 24:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 25:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 26:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 27:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 28:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 29:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 30:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 31:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 32:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 33:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 34:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 35:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 36:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 37:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 38:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 39:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 40:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 41:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 42:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 43:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 44:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 45:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 46:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 47:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 48:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 49:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 50:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 51:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 52:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 53:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 54:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 55:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 56:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                break;
              case 57:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                break;
              case 58:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                break;
              case 59:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                break;
              case 60:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                break;
              case 61:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                break;
              case 62:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))));
                break;
              case 63:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                break;
              case 64:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 1);
                break;
              case 65:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 1);
                break;
              case 66:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 1);
                break;
              case 67:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 1);
                break;
              case 68:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 1);
                break;
              case 69:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 1);
                break;
              case 70:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 1);
                break;
              case 71:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 1);
                break;
              case 72:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 2);
                break;
              case 73:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 2);
                break;
              case 74:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 2);
                break;
              case 75:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 2);
                break;
              case 76:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 2);
                break;
              case 77:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 2);
                break;
              case 78:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 2);
                break;
              case 79:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 2);
                break;
              case 80:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 4);
                break;
              case 81:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 4);
                break;
              case 82:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 4);
                break;
              case 83:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 4);
                break;
              case 84:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 4);
                break;
              case 85:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 4);
                break;
              case 86:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 4);
                break;
              case 87:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 4);
                break;
              case 88:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 8);
                break;
              case 89:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 8);
                break;
              case 90:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 8);
                break;
              case 91:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 8);
                break;
              case 92:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 8);
                break;
              case 93:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 8);
                break;
              case 94:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 8);
                break;
              case 95:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 8);
                break;
              case 96:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 16);
                break;
              case 97:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 16);
                break;
              case 98:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 16);
                break;
              case 99:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 16);
                break;
              case 100:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 16);
                break;
              case 101:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 16);
                break;
              case 102:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 16);
                break;
              case 103:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 16);
                break;
              case 104:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 32);
                break;
              case 105:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 32);
                break;
              case 106:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 32);
                break;
              case 107:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 32);
                break;
              case 108:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 32);
                break;
              case 109:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 32);
                break;
              case 110:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 32);
                break;
              case 111:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 32);
                break;
              case 112:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 64);
                break;
              case 113:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 64);
                break;
              case 114:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 64);
                break;
              case 115:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 64);
                break;
              case 116:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 64);
                break;
              case 117:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 64);
                break;
              case 118:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 64);
                break;
              case 119:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 64);
                break;
              case 120:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ & 128);
                break;
              case 121:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ & 128);
                break;
              case 122:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ & 128);
                break;
              case 123:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ & 128);
                break;
              case 124:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ & 128);
                break;
              case 125:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ & 128);
                break;
              case 126:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & 128);
                break;
              case 127:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 128);
                break;
              case 128:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -2;
                break;
              case 129:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -2;
                break;
              case 130:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -2;
                break;
              case 131:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -2;
                break;
              case 132:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -2;
                break;
              case 133:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -2;
                break;
              case 134:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -2);
                break;
              case 135:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -2;
                break;
              case 136:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -3;
                break;
              case 137:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -3;
                break;
              case 138:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -3;
                break;
              case 139:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -3;
                break;
              case 140:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -3;
                break;
              case 141:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -3;
                break;
              case 142:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -3);
                break;
              case 143:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -3;
                break;
              case 144:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -5;
                break;
              case 145:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -5;
                break;
              case 146:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -5;
                break;
              case 147:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -5;
                break;
              case 148:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -5;
                break;
              case 149:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -5;
                break;
              case 150:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -5);
                break;
              case 151:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -5;
                break;
              case 152:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -9;
                break;
              case 153:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -9;
                break;
              case 154:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -9;
                break;
              case 155:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -9;
                break;
              case 156:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -9;
                break;
              case 157:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -9;
                break;
              case 158:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -9);
                break;
              case 159:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -9;
                break;
              case 160:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -17;
                break;
              case 161:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -17;
                break;
              case 162:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -17;
                break;
              case 163:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -17;
                break;
              case 164:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -17;
                break;
              case 165:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -17;
                break;
              case 166:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -17);
                break;
              case 167:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -17;
                break;
              case 168:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -33;
                break;
              case 169:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -33;
                break;
              case 170:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -33;
                break;
              case 171:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -33;
                break;
              case 172:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -33;
                break;
              case 173:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -33;
                break;
              case 174:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -33);
                break;
              case 175:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -33;
                break;
              case 176:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -65;
                break;
              case 177:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -65;
                break;
              case 178:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -65;
                break;
              case 179:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -65;
                break;
              case 180:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -65;
                break;
              case 181:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -65;
                break;
              case 182:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -65);
                break;
              case 183:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -65;
                break;
              case 184:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ &= -129;
                break;
              case 185:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ &= -129;
                break;
              case 186:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ &= -129;
                break;
              case 187:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ &= -129;
                break;
              case 188:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ &= -129;
                break;
              case 189:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ &= -129;
                break;
              case 190:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) & -129);
                break;
              case 191:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= -129;
                break;
              case 192:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 1;
                break;
              case 193:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 1;
                break;
              case 194:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 1;
                break;
              case 195:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 1;
                break;
              case 196:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 1;
                break;
              case 197:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 1;
                break;
              case 198:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 1);
                break;
              case 199:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 1;
                break;
              case 200:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 2;
                break;
              case 201:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 2;
                break;
              case 202:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 2;
                break;
              case 203:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 2;
                break;
              case 204:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 2;
                break;
              case 205:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 2;
                break;
              case 206:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 2);
                break;
              case 207:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 2;
                break;
              case 208:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 4;
                break;
              case 209:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 4;
                break;
              case 210:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 4;
                break;
              case 211:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 4;
                break;
              case 212:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 4;
                break;
              case 213:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 4;
                break;
              case 214:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 4);
                break;
              case 215:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 4;
                break;
              case 216:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 8;
                break;
              case 217:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 8;
                break;
              case 218:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 8;
                break;
              case 219:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 8;
                break;
              case 220:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 8;
                break;
              case 221:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 8;
                break;
              case 222:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 8);
                break;
              case 223:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 8;
                break;
              case 224:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 16;
                break;
              case 225:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 16;
                break;
              case 226:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 16;
                break;
              case 227:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 16;
                break;
              case 228:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 16;
                break;
              case 229:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 16;
                break;
              case 230:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 16);
                break;
              case 231:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 16;
                break;
              case 232:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 32;
                break;
              case 233:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 32;
                break;
              case 234:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 32;
                break;
              case 235:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 32;
                break;
              case 236:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 32;
                break;
              case 237:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 32;
                break;
              case 238:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 32);
                break;
              case 239:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 32;
                break;
              case 240:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 64;
                break;
              case 241:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 64;
                break;
              case 242:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 64;
                break;
              case 243:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 64;
                break;
              case 244:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 64;
                break;
              case 245:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 64;
                break;
              case 246:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 64);
                break;
              case 247:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 64;
                break;
              case 248:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ |= 128;
                break;
              case 249:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ |= 128;
                break;
              case 250:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ |= 128;
                break;
              case 251:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ |= 128;
                break;
              case 252:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ |= 128;
                break;
              case 253:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ |= 128;
                break;
              case 254:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)) | 128);
                break;
              case 255:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= 128;
                break;
              default:
                console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_310$$))
            }
            break;
          case 204:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64));
            break;
          case 205:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 2);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            break;
          case 206:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 207:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 8;
            break;
          case 208:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 209:
            var $value$$inline_311$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $value$$inline_311$$ >> 8;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $value$$inline_311$$ & 255;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
            break;
          case 210:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 211:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
            break;
          case 212:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 213:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
            break;
          case 214:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 215:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 16;
            break;
          case 216:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 217:
            var $temp$$inline_312$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$O$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$O$ = $temp$$inline_312$$;
            $temp$$inline_312$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$P$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$P$ = $temp$$inline_312$$;
            var $temp$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$Q$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$Q$ = $temp$$inline_313$$;
            $temp$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$R$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$R$ = $temp$$inline_313$$;
            var $temp$$inline_314$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$T$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$T$ = $temp$$inline_314$$;
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$U$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$U$ = $temp$$inline_314$$;
            break;
          case 218:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 219:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 220:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1));
            break;
          case 221:
            var $opcode$$inline_315$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++), $location$$inline_316$$ = 0, $temp$$inline_317$$ = 0;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_315$$];
            switch($opcode$$inline_315$$) {
              case 9:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_316$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_316$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_316$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ && ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 37:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 38:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 42:
                $location$$inline_316$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($location$$inline_316$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$(++$location$$inline_316$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ && ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 45:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 46:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$(++$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 69:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 70:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 77:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 78:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 85:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 86:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 93:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 94:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 102:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$;
                break;
              case 125:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$;
                break;
              case 126:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))] | 16;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$];
                break;
              case 173:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$];
                break;
              case 174:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$];
                break;
              case 181:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$];
                break;
              case 182:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_317$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$, $temp$$inline_317$$ & 255);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ + 1, $temp$$inline_317$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$r$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$p$);
                break;
              case 233:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_315$$)), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--
            }
            break;
          case 222:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 223:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 24;
            break;
          case 224:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 225:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
            break;
          case 226:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 227:
            $temp$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ + 1);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ + 1, $temp$$inline_299$$);
            $temp$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$, $temp$$inline_299$$);
            break;
          case 228:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
            break;
          case 230:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++)] | 16;
            break;
          case 231:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 32;
            break;
          case 232:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 233:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 234:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 235:
            $temp$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $temp$$inline_299$$;
            $temp$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $temp$$inline_299$$;
            break;
          case 236:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 4));
            break;
          case 237:
            var $opcode$$inline_318$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $temp$$inline_319$$ = 0, $location$$inline_320$$ = 0;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_318$$];
            switch($opcode$$inline_318$$) {
              case 64:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 65:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 66:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 67:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
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
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = 0;
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
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
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$z$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$A$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$H$ = 0;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 71:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$L$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 72:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 73:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 74:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 75:
                var $value$$inline_321$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $value$$inline_321$$ >> 8;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $value$$inline_321$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 79:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 80:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 81:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 82:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 83:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 86:
              ;
              case 118:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$H$ = 1;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 87:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$L$;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$M$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$] | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$A$ ? 4 : 0);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 88:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 89:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 90:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 91:
                var $value$$inline_322$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $value$$inline_322$$ >> 8;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $value$$inline_322$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 95:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = Math.round(255 * Math.random());
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$M$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$] | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$A$ ? 4 : 0);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 97:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 98:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 99:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 103:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($location$$inline_320$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, $temp$$inline_319$$ >> 4 | ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 15) << 4);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 240 | $temp$$inline_319$$ & 15;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 104:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 105:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 106:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 107:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 111:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($location$$inline_320$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, ($temp$$inline_319$$ & 15) << 4 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 15);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ & 240 | $temp$$inline_319$$ >> 4;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, 0);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 115:
                $location$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ & 255);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_320$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ >> 8);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 120:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 121:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 122:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 123:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ + 1));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 3;
                break;
              case 160:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 4 : 0);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 161:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 0 : 4;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 248 | $temp$$inline_319$$;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 162:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 163:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $temp$$inline_319$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                255 < $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -2, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 168:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 4 : 0);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 169:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 0 : 4;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 248 | $temp$$inline_319$$;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 170:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 171:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $temp$$inline_319$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                255 < $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -2, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 176:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 4, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17;
                break;
              case 177:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 0 : 4;
                0 != ($temp$$inline_319$$ & 4) && 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 248 | $temp$$inline_319$$;
                break;
              case 178:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                break;
              case 179:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                255 < $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -2, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                break;
              case 184:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 4, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17;
                break;
              case 185:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) ? 0 : 4;
                0 != ($temp$$inline_319$$ & 4) && 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 248 | $temp$$inline_319$$;
                break;
              case 186:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                break;
              case 187:
                $temp$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$, $temp$$inline_319$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                0 != $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--) : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                255 < $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 1, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -2, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ &= -17);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ | 2 : $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & -3;
                break;
              default:
                console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_318$$)), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++
            }
            break;
          case 238:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++)];
            break;
          case 239:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 40;
            break;
          case 240:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 241:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$++);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$++);
            break;
          case 242:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 243:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$z$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$A$ = $JSCompiler_alias_FALSE$$;
            break;
          case 244:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 245:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$);
            break;
          case 246:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++)];
            break;
          case 247:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 48;
            break;
          case 248:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 249:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
            break;
          case 250:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 251:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$z$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$A$ = $JSCompiler_alias_TRUE$$;
            break;
          case 252:
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ & 128));
            break;
          case 253:
            var $opcode$$inline_323$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++), $location$$inline_324$$ = $JSCompiler_alias_VOID$$, $temp$$inline_325$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_323$$];
            switch($opcode$$inline_323$$) {
              case 9:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_324$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_324$$++, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($location$$inline_324$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ && ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 37:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 38:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                break;
              case 42:
                $location$$inline_324$$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($location$$inline_324$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$(++$location$$inline_324$$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ && ($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 45:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 46:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$(++$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 69:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 70:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 77:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 78:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 85:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 86:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 93:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 94:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 102:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$g$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$f$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$j$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$h$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$k$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$i$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$;
                break;
              case 125:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$;
                break;
              case 126:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))] | 16;
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$];
                break;
              case 173:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$];
                break;
              case 174:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$];
                break;
              case 181:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$];
                break;
              case 182:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_297$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$))];
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_325$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$l$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$));
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$, $temp$$inline_325$$ & 255);
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ + 1, $temp$$inline_325$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$s$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$q$);
                break;
              case 233:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$n$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_323$$)), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$--
            }
            break;
          case 254:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$a$($JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$++));
            break;
          case 255:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_297$$, $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$), $JSCompiler_StaticMethods_interpret$self$$inline_297$$.$d$ = 56
        }
      }
      this.$z80TimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_23$$;
      if(this.$soundEnabled$) {
        var $line$$inline_212$$ = $lineno$$inline_24$$;
        0 == $line$$inline_212$$ && (this.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_213$$ = this.$samplesPerLine$[$line$$inline_212$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$ = this.$d$, $offset$$inline_328$$ = this.$audioBufferOffset$, $samplesToGenerate$$inline_329$$ = $samplesToGenerate$$inline_213$$, $buffer$$inline_330$$ = [], $sample$$inline_331$$ = 0, $i$$inline_332$$ = 0;$sample$$inline_331$$ < $samplesToGenerate$$inline_329$$;$sample$$inline_331$$++) {
          for($i$$inline_332$$ = 0;3 > $i$$inline_332$$;$i$$inline_332$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_332$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$[$i$$inline_332$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[($i$$inline_332$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$[$i$$inline_332$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[($i$$inline_332$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[$i$$inline_332$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ & 1) << 1;
          var $output$$inline_333$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[3];
          127 < $output$$inline_333$$ ? $output$$inline_333$$ = 127 : -128 > $output$$inline_333$$ && ($output$$inline_333$$ = -128);
          $buffer$$inline_330$$[$offset$$inline_328$$ + $sample$$inline_331$$] = $output$$inline_333$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$e$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$j$;
          var $clockCycles$$inline_334$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$e$ >> 8, $clockCyclesScaled$$inline_335$$ = $clockCycles$$inline_334$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$e$ -= $clockCyclesScaled$$inline_335$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[0] -= $clockCycles$$inline_334$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[1] -= $clockCycles$$inline_334$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[2] -= $clockCycles$$inline_334$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] - $clockCycles$$inline_334$$;
          for($i$$inline_332$$ = 0;3 > $i$$inline_332$$;$i$$inline_332$$++) {
            var $counter$$inline_336$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[$i$$inline_332$$];
            if(0 >= $counter$$inline_336$$) {
              var $tone$$inline_337$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[$i$$inline_332$$ << 1];
              6 < $tone$$inline_337$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$[$i$$inline_332$$] = ($clockCyclesScaled$$inline_335$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$e$ + 512 * $counter$$inline_336$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[$i$$inline_332$$] / ($clockCyclesScaled$$inline_335$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$e$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[$i$$inline_332$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[$i$$inline_332$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[$i$$inline_332$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$[$i$$inline_332$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[$i$$inline_332$$] += $tone$$inline_337$$ * ($clockCycles$$inline_334$$ / $tone$$inline_337$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$[$i$$inline_332$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ * 
          ($clockCycles$$inline_334$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$d$[3])) {
            var $feedback$$inline_338$$ = 0, $feedback$$inline_338$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$ >> 1 | $feedback$$inline_338$$ << 15
          }
        }
        this.$audioBuffer$ = $buffer$$inline_330$$;
        this.$audioBufferOffset$ += $samplesToGenerate$$inline_213$$
      }
      this.$c$.$l$ = $lineno$$inline_24$$;
      if(0 == this.$frameskip_counter$ && 192 > $lineno$$inline_24$$) {
        var $startTime$$inline_23$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_drawLine$self$$inline_215$$ = this.$c$, $lineno$$inline_216$$ = $lineno$$inline_24$$, $i$$inline_217$$ = 0, $temp$$inline_218$$ = 0, $temp2$$inline_219$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$h$.$is_gg$ || !(24 > $lineno$$inline_216$$ || 168 <= $lineno$$inline_216$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$m$) {
              var $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$;
              console.log("[" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$l$ + "] min dirty:" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$o$ + " max: " + $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$m$);
              for(var $i$$inline_341$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$o$;$i$$inline_341$$ <= $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$m$;$i$$inline_341$$++) {
                if($JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$v$[$i$$inline_341$$]) {
                  $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$v$[$i$$inline_341$$] = $JSCompiler_alias_FALSE$$;
                  console.log("tile " + $i$$inline_341$$ + " is dirty");
                  for(var $tile$$inline_342$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$t$[$i$$inline_341$$], $pixel_index$$inline_343$$ = 0, $address$$inline_344$$ = $i$$inline_341$$ << 5, $y$$inline_345$$ = 0;8 > $y$$inline_345$$;$y$$inline_345$$++) {
                    for(var $address0$$inline_346$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$d$[$address$$inline_344$$++], $address1$$inline_347$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$d$[$address$$inline_344$$++], $address2$$inline_348$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$d$[$address$$inline_344$$++], $address3$$inline_349$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$d$[$address$$inline_344$$++], $bit$$inline_350$$ = 
                    128;0 != $bit$$inline_350$$;$bit$$inline_350$$ >>= 1) {
                      var $colour$$inline_351$$ = 0;
                      0 != ($address0$$inline_346$$ & $bit$$inline_350$$) && ($colour$$inline_351$$ |= 1);
                      0 != ($address1$$inline_347$$ & $bit$$inline_350$$) && ($colour$$inline_351$$ |= 2);
                      0 != ($address2$$inline_348$$ & $bit$$inline_350$$) && ($colour$$inline_351$$ |= 4);
                      0 != ($address3$$inline_349$$ & $bit$$inline_350$$) && ($colour$$inline_351$$ |= 8);
                      $tile$$inline_342$$[$pixel_index$$inline_343$$++] = $colour$$inline_351$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$o$ = 512;
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_340$$.$m$ = -1
            }
            var $JSCompiler_StaticMethods_drawBg$self$$inline_353$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$, $lineno$$inline_354$$ = $lineno$$inline_216$$, $pixX$$inline_355$$ = 0, $colour$$inline_356$$ = 0, $temp$$inline_357$$ = 0, $temp2$$inline_358$$ = 0, $hscroll$$inline_359$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$c$[8], $vscroll$$inline_360$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$c$[9];
            16 > $lineno$$inline_354$$ && 0 != ($JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$c$[0] & 64) && ($hscroll$$inline_359$$ = 0);
            var $lock$$inline_361$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$c$[0] & 128, $tile_column$$inline_362$$ = 32 - ($hscroll$$inline_359$$ >> 3) + $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$s$, $tile_row$$inline_363$$ = $lineno$$inline_354$$ + $vscroll$$inline_360$$ >> 3;
            27 < $tile_row$$inline_363$$ && ($tile_row$$inline_363$$ -= 28);
            for(var $tile_y$$inline_364$$ = ($lineno$$inline_354$$ + ($vscroll$$inline_360$$ & 7) & 7) << 3, $row_precal$$inline_365$$ = $lineno$$inline_354$$ << 8, $tx$$inline_366$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$s$;$tx$$inline_366$$ < $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$u$;$tx$$inline_366$$++) {
              var $tile_props$$inline_367$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$D$ + (($tile_column$$inline_362$$ & 31) << 1) + ($tile_row$$inline_363$$ << 6), $secondbyte$$inline_368$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$d$[$tile_props$$inline_367$$ + 1], $pal$$inline_369$$ = ($secondbyte$$inline_368$$ & 8) << 1, $sx$$inline_370$$ = ($tx$$inline_366$$ << 3) + ($hscroll$$inline_359$$ & 7), $pixY$$inline_371$$ = 0 == ($secondbyte$$inline_368$$ & 4) ? $tile_y$$inline_364$$ : 
              56 - $tile_y$$inline_364$$, $tile$$inline_372$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$t$[($JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$d$[$tile_props$$inline_367$$] & 255) + (($secondbyte$$inline_368$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_368$$ & 2)) {
                for($pixX$$inline_355$$ = 0;8 > $pixX$$inline_355$$ && 256 > $sx$$inline_370$$;$pixX$$inline_355$$++, $sx$$inline_370$$++) {
                  $colour$$inline_356$$ = $tile$$inline_372$$[$pixX$$inline_355$$ + $pixY$$inline_371$$], $temp$$inline_357$$ = 4 * ($sx$$inline_370$$ + $row_precal$$inline_365$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + $pal$$inline_369$$), $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$p$[$sx$$inline_370$$] = 0 != ($secondbyte$$inline_368$$ & 16) && 0 != $colour$$inline_356$$, $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$ + 2]
                }
              }else {
                for($pixX$$inline_355$$ = 7;0 <= $pixX$$inline_355$$ && 256 > $sx$$inline_370$$;$pixX$$inline_355$$--, $sx$$inline_370$$++) {
                  $colour$$inline_356$$ = $tile$$inline_372$$[$pixX$$inline_355$$ + $pixY$$inline_371$$], $temp$$inline_357$$ = 4 * ($sx$$inline_370$$ + $row_precal$$inline_365$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + $pal$$inline_369$$), $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$p$[$sx$$inline_370$$] = 0 != ($secondbyte$$inline_368$$ & 16) && 0 != $colour$$inline_356$$, $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_353$$.$a$[$temp2$$inline_358$$ + 2]
                }
              }
              $tile_column$$inline_362$$++;
              0 != $lock$$inline_361$$ && 23 == $tx$$inline_366$$ && ($tile_row$$inline_363$$ = $lineno$$inline_354$$ >> 3, $tile_y$$inline_364$$ = ($lineno$$inline_354$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$k$) {
              var $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$;
              $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$k$ = $JSCompiler_alias_FALSE$$;
              for(var $i$$inline_375$$ = 0;$i$$inline_375$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$n$.length;$i$$inline_375$$++) {
                $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$n$[$i$$inline_375$$][0] = 0
              }
              var $height$$inline_376$$ = 0 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$c$[1] & 1) && ($height$$inline_376$$ <<= 1);
              for(var $spriteno$$inline_377$$ = 0;64 > $spriteno$$inline_377$$;$spriteno$$inline_377$$++) {
                var $y$$inline_378$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$d$[$JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$g$ + $spriteno$$inline_377$$] & 255;
                if(208 == $y$$inline_378$$) {
                  break
                }
                $y$$inline_378$$++;
                240 < $y$$inline_378$$ && ($y$$inline_378$$ -= 256);
                for(var $lineno$$inline_379$$ = $y$$inline_378$$;192 > $lineno$$inline_379$$;$lineno$$inline_379$$++) {
                  if($lineno$$inline_379$$ - $y$$inline_378$$ < $height$$inline_376$$) {
                    var $sprites$$inline_380$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$n$[$lineno$$inline_379$$];
                    if(!$sprites$$inline_380$$ || 8 <= $sprites$$inline_380$$[0]) {
                      break
                    }
                    var $off$$inline_381$$ = 3 * $sprites$$inline_380$$[0] + 1, $address$$inline_382$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$g$ + ($spriteno$$inline_377$$ << 1) + 128;
                    $sprites$$inline_380$$[$off$$inline_381$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$d$[$address$$inline_382$$++] & 255;
                    $sprites$$inline_380$$[$off$$inline_381$$++] = $y$$inline_378$$;
                    $sprites$$inline_380$$[$off$$inline_381$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_374$$.$d$[$address$$inline_382$$] & 255;
                    $sprites$$inline_380$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$n$[$lineno$$inline_216$$][0]) {
              for(var $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$, $lineno$$inline_385$$ = $lineno$$inline_216$$, $colour$$inline_386$$ = 0, $temp$$inline_387$$ = 0, $temp2$$inline_388$$ = 0, $i$$inline_389$$ = 0, $sprites$$inline_390$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$n$[$lineno$$inline_385$$], $count$$inline_391$$ = Math.min(8, $sprites$$inline_390$$[0]), $zoomed$$inline_392$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$c$[1] & 
              1, $row_precal$$inline_393$$ = $lineno$$inline_385$$ << 8, $off$$inline_394$$ = 3 * $count$$inline_391$$;$i$$inline_389$$ < $count$$inline_391$$;$i$$inline_389$$++) {
                var $n$$inline_395$$ = $sprites$$inline_390$$[$off$$inline_394$$--] | ($JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$c$[6] & 4) << 6, $y$$inline_396$$ = $sprites$$inline_390$$[$off$$inline_394$$--], $x$$inline_397$$ = $sprites$$inline_390$$[$off$$inline_394$$--] - ($JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$c$[0] & 8), $tileRow$$inline_398$$ = $lineno$$inline_385$$ - $y$$inline_396$$ >> $zoomed$$inline_392$$;
                0 != ($JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$c$[1] & 2) && ($n$$inline_395$$ &= -2);
                var $tile$$inline_399$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$t$[$n$$inline_395$$ + (($tileRow$$inline_398$$ & 8) >> 3)], $pix$$inline_400$$ = 0;
                0 > $x$$inline_397$$ && ($pix$$inline_400$$ = -$x$$inline_397$$, $x$$inline_397$$ = 0);
                var $offset$$inline_401$$ = $pix$$inline_400$$ + (($tileRow$$inline_398$$ & 7) << 3);
                if(0 == $zoomed$$inline_392$$) {
                  for(;8 > $pix$$inline_400$$ && 256 > $x$$inline_397$$;$pix$$inline_400$$++, $x$$inline_397$$++) {
                    $colour$$inline_386$$ = $tile$$inline_399$$[$offset$$inline_401$$++], 0 != $colour$$inline_386$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$p$[$x$$inline_397$$] && ($temp$$inline_387$$ = 4 * ($x$$inline_397$$ + $row_precal$$inline_393$$), $temp2$$inline_388$$ = 3 * ($colour$$inline_386$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_400$$ && 256 > $x$$inline_397$$;$pix$$inline_400$$++, $x$$inline_397$$ += 2) {
                    $colour$$inline_386$$ = $tile$$inline_399$$[$offset$$inline_401$$++], 0 != $colour$$inline_386$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$p$[$x$$inline_397$$] && ($temp$$inline_387$$ = 4 * ($x$$inline_397$$ + $row_precal$$inline_393$$), $temp2$$inline_388$$ = 3 * ($colour$$inline_386$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 2]), 0 != $colour$$inline_386$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$p$[$x$$inline_397$$ + 1] && ($temp$$inline_387$$ = 4 * ($x$$inline_397$$ + $row_precal$$inline_393$$ + 1), $temp2$$inline_388$$ = 
                    3 * ($colour$$inline_386$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$b$[$temp$$inline_387$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$a$[$temp2$$inline_388$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_390$$[0] && ($JSCompiler_StaticMethods_drawSprite$self$$inline_384$$.$e$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$h$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$c$[0] & 32)) {
              $temp$$inline_218$$ = 4 * ($lineno$$inline_216$$ << 8);
              $temp2$$inline_219$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$c$[7] & 15) + 16);
              for($i$$inline_217$$ = 0;8 > $i$$inline_217$$;$i$$inline_217$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$b$[$temp$$inline_218$$ + $i$$inline_217$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$a$[$temp2$$inline_219$$], $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$b$[$temp$$inline_218$$ + $i$$inline_217$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$a$[$temp2$$inline_219$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$b$[$temp$$inline_218$$ + $i$$inline_217$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$.$a$[$temp2$$inline_219$$ + 
                2]
              }
            }
          }else {
            for(var $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_215$$, $row_precal$$inline_405$$ = $lineno$$inline_216$$ << 8, $length$$inline_406$$ = 4 * ($row_precal$$inline_405$$ + 1024), $temp$$inline_407$$ = 3 * (($JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$c$[7] & 15) + 16), $row_precal$$inline_405$$ = 4 * $row_precal$$inline_405$$;$row_precal$$inline_405$$ < $length$$inline_406$$;$row_precal$$inline_405$$ += 4) {
              $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$b$[$row_precal$$inline_405$$] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$a$[$temp$$inline_407$$], $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$b$[$row_precal$$inline_405$$ + 1] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$a$[$temp$$inline_407$$ + 1], $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$b$[$row_precal$$inline_405$$ + 2] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_403$$.$a$[$temp$$inline_407$$ + 
              2]
            }
          }
        }
        this.$drawTimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_23$$
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_221$$ = this.$c$, $lineno$$inline_222$$ = $lineno$$inline_24$$;
      192 >= $lineno$$inline_222$$ ? (192 == $lineno$$inline_222$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$e$ |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$q$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$e$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$q$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$e$ & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$c$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$h$.$a$.$B$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$e$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$c$[1] & 32) && 224 > $lineno$$inline_222$$) && 
      ($JSCompiler_StaticMethods_interrupts$self$$inline_221$$.$h$.$a$.$B$ = $JSCompiler_alias_TRUE$$))
    }
    60 == ++this.$frameCount$ && (this.$frameCount$ = this.$drawTimeCounter$ = this.$z80TimeCounter$ = 0);
    if(this.$pause_button$) {
      var $JSCompiler_StaticMethods_nmi$self$$inline_224$$ = this.$a$;
      $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$A$ = $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$z$;
      $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$z$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$F$ && ($JSCompiler_StaticMethods_nmi$self$$inline_224$$.$d$++, $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$F$ = $JSCompiler_alias_FALSE$$);
      $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_nmi$self$$inline_224$$, $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$d$);
      $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$d$ = 102;
      $JSCompiler_StaticMethods_nmi$self$$inline_224$$.$o$ -= 11;
      this.$pause_button$ = $JSCompiler_alias_FALSE$$
    }
    0 == this.$frameskip_counter$-- && (this.$frameskip_counter$ = this.$frameSkip$);
    this.$fpsFrameCount$++;
    this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen)
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$21$$, $fileName$$) {
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1, $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ = $data$$21$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ ? (this.$is_sms$ = $JSCompiler_alias_TRUE$$, this.$is_gg$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 0, this.$c$.$u$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ && (this.$is_gg$ = $JSCompiler_alias_TRUE$$, this.$is_sms$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 5, this.$c$.$u$ = 27);
  if(16384 >= $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ = $data$$21$$;
  0 != $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.substr(512), $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ -= 512);
  var $i$$inline_32$$, $j$$inline_33$$, $number_of_pages$$inline_34$$ = Math.round($i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ / 16384), $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ = Array($number_of_pages$$inline_34$$);
  for($i$$inline_32$$ = 0;$i$$inline_32$$ < $number_of_pages$$inline_34$$;$i$$inline_32$$++) {
    if($i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$[$i$$inline_32$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for($j$$inline_33$$ = 0;16384 > $j$$inline_33$$;$j$$inline_33$$++) {
        $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$[$i$$inline_32$$].setUint8($j$$inline_33$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.charCodeAt(16384 * $i$$inline_32$$ + $j$$inline_33$$))
      }
    }else {
      for($j$$inline_33$$ = 0;16384 > $j$$inline_33$$;$j$$inline_33$$++) {
        $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$[$i$$inline_32$$][$j$$inline_33$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.charCodeAt(16384 * $i$$inline_32$$ + $j$$inline_33$$) & 255
      }
    }
  }
  if($i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$ = this.$a$;
  $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$rom$ = $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$J$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$J$ - 1;
    for($i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ = 0;3 > $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$;$i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$frameReg$[$i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$] = $i$$inline_39_pages$$inline_35_size$$10_size$$inline_31$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$J$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$J$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_37_data$$inline_30_mode$$9$$.$romPageMask$ = 0
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
function $JSSMS$Z80$$($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$) {
  this.$G$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
  this.$t$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$.$f$;
  this.$H$ = this.$n$ = this.$d$ = 0;
  this.$B$ = this.$F$ = this.$A$ = this.$z$ = $JSCompiler_alias_FALSE$$;
  this.$o$ = this.$S$ = this.$c$ = this.$L$ = this.$s$ = this.$q$ = this.$r$ = this.$p$ = this.$U$ = this.$T$ = this.$i$ = this.$k$ = this.$R$ = this.$Q$ = this.$h$ = this.$j$ = this.$P$ = this.$O$ = this.$f$ = this.$g$ = this.$N$ = this.$b$ = this.$I$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$J$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$V$ = Array(2048);
  this.$M$ = Array(256);
  this.$m$ = Array(256);
  this.$D$ = Array(256);
  this.$C$ = Array(256);
  this.$v$ = Array(131072);
  this.$u$ = Array(131072);
  this.$K$ = Array(256);
  var $c$$inline_58_padc$$inline_49_sf$$inline_43$$, $h$$inline_59_psub$$inline_50_zf$$inline_44$$, $n$$inline_60_psbc$$inline_51_yf$$inline_45$$, $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$, $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$, $flags$$inline_228_newval$$inline_54$$;
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;256 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
    $c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 0 != ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 128) ? 128 : 0, $h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 64 : 0, $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 32, $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 
    8, $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$) ? 4 : 0, this.$M$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$, this.$m$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 
    $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ | $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$, this.$D$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$, 
    this.$D$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 128 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 4 : 0, this.$D$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 0 == ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 15) ? 16 : 0, this.$C$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | 
    $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ | 2, this.$C$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 127 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 4 : 0, this.$C$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 15 == ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 15) ? 16 : 0, this.$K$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0 != $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 
    $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 128 : 68, this.$K$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ | 16
  }
  $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;
  $c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 65536;
  $h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0;
  $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = 65536;
  for($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ = 0;256 > $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$;$JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$++) {
    for($flags$$inline_228_newval$$inline_54$$ = 0;256 > $flags$$inline_228_newval$$inline_54$$;$flags$$inline_228_newval$$inline_54$$++) {
      $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = $flags$$inline_228_newval$$inline_54$$ - $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$, this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0 != $flags$$inline_228_newval$$inline_54$$ ? 0 != ($flags$$inline_228_newval$$inline_54$$ & 128) ? 128 : 0 : 64, this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= $flags$$inline_228_newval$$inline_54$$ & 40, ($flags$$inline_228_newval$$inline_54$$ & 
      15) < ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 16), $flags$$inline_228_newval$$inline_54$$ < $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ ^ 128) & ($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ 
      $flags$$inline_228_newval$$inline_54$$) & 128) && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 4), $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++, $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = $flags$$inline_228_newval$$inline_54$$ - $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ - 1, this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] = 0 != $flags$$inline_228_newval$$inline_54$$ ? 0 != ($flags$$inline_228_newval$$inline_54$$ & 
      128) ? 128 : 0 : 64, this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= $flags$$inline_228_newval$$inline_54$$ & 40, ($flags$$inline_228_newval$$inline_54$$ & 15) <= ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 16), $flags$$inline_228_newval$$inline_54$$ <= $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 1), 0 != (($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ 
      $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ ^ 128) & ($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ $flags$$inline_228_newval$$inline_54$$) & 128) && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 4), $c$$inline_58_padc$$inline_49_sf$$inline_43$$++, $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ - $flags$$inline_228_newval$$inline_54$$, this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] = 
      0 != $flags$$inline_228_newval$$inline_54$$ ? 0 != ($flags$$inline_228_newval$$inline_54$$ & 128) ? 130 : 2 : 66, this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= $flags$$inline_228_newval$$inline_54$$ & 40, ($flags$$inline_228_newval$$inline_54$$ & 15) > ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 16), $flags$$inline_228_newval$$inline_54$$ > $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ && 
      (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 1), 0 != (($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$) & ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ ^ $flags$$inline_228_newval$$inline_54$$) & 128) && (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 4), $h$$inline_59_psub$$inline_50_zf$$inline_44$$++, $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ - 
      $flags$$inline_228_newval$$inline_54$$ - 1, this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] = 0 != $flags$$inline_228_newval$$inline_54$$ ? 0 != ($flags$$inline_228_newval$$inline_54$$ & 128) ? 130 : 2 : 66, this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= $flags$$inline_228_newval$$inline_54$$ & 40, ($flags$$inline_228_newval$$inline_54$$ & 15) >= ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 
      16), $flags$$inline_228_newval$$inline_54$$ >= $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 1), 0 != (($JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$) & ($JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ ^ $flags$$inline_228_newval$$inline_54$$) & 128) && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 4), $n$$inline_60_psbc$$inline_51_yf$$inline_45$$++
    }
  }
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 256;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$--;) {
    for($c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 0;1 >= $c$$inline_58_padc$$inline_49_sf$$inline_43$$;$c$$inline_58_padc$$inline_49_sf$$inline_43$$++) {
      for($h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0;1 >= $h$$inline_59_psub$$inline_50_zf$$inline_44$$;$h$$inline_59_psub$$inline_50_zf$$inline_44$$++) {
        for($n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = 0;1 >= $n$$inline_60_psbc$$inline_51_yf$$inline_45$$;$n$$inline_60_psbc$$inline_51_yf$$inline_45$$++) {
          $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$ = this.$V$;
          $JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$ = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ << 8 | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ << 9 | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ << 10 | $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
          $flags$$inline_228_newval$$inline_54$$ = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ << 1 | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ << 4;
          this.$b$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
          this.$c$ = $flags$$inline_228_newval$$inline_54$$;
          var $a_copy$$inline_229$$ = this.$b$, $correction$$inline_230$$ = 0, $carry$$inline_231$$ = $flags$$inline_228_newval$$inline_54$$ & 1, $carry_copy$$inline_232$$ = $carry$$inline_231$$;
          if(0 != ($flags$$inline_228_newval$$inline_54$$ & 16) || 9 < ($a_copy$$inline_229$$ & 15)) {
            $correction$$inline_230$$ |= 6
          }
          if(1 == $carry$$inline_231$$ || 159 < $a_copy$$inline_229$$ || 143 < $a_copy$$inline_229$$ && 9 < ($a_copy$$inline_229$$ & 15)) {
            $correction$$inline_230$$ |= 96, $carry_copy$$inline_232$$ = 1
          }
          153 < $a_copy$$inline_229$$ && ($carry_copy$$inline_232$$ = 1);
          0 != ($flags$$inline_228_newval$$inline_54$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_230$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_230$$);
          $flags$$inline_228_newval$$inline_54$$ = this.$c$ & 254 | $carry_copy$$inline_232$$;
          $flags$$inline_228_newval$$inline_54$$ = $JSCompiler_StaticMethods_getParity$$(this.$b$) ? $flags$$inline_228_newval$$inline_54$$ & 251 | 4 : $flags$$inline_228_newval$$inline_54$$ & 251;
          $JSCompiler_temp_const$$195_val$$inline_52_xf$$inline_46$$[$JSCompiler_temp_const$$194_oldval$$inline_53_pf$$inline_47$$] = this.$b$ | $flags$$inline_228_newval$$inline_54$$ << 8
        }
      }
    }
  }
  this.$b$ = this.$c$ = 0;
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;8192 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$, 0)
    }
  }else {
    for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;8192 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
      this.$memWriteMap$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0
    }
  }
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;32768 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
      this.$sram$.setUint8($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$, 0)
    }
  }else {
    for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;32768 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
      this.$sram$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0
    }
  }
  this.$J$ = 2;
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;4 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
    this.$frameReg$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ % 3
  }
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$d$ = this.$S$ = this.$c$ = this.$L$ = this.$q$ = this.$s$ = this.$p$ = this.$r$ = this.$k$ = this.$i$ = this.$T$ = this.$U$ = this.$j$ = this.$h$ = this.$Q$ = this.$R$ = this.$g$ = this.$f$ = this.$O$ = this.$P$ = this.$b$ = this.$N$ = 0;
  this.$n$ = 57328;
  this.$H$ = this.$o$ = 0;
  this.$A$ = this.$z$ = $JSCompiler_alias_FALSE$$;
  this.$I$ = 0;
  this.$F$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$d$ + 2), this.$d$ = this.$l$(this.$d$), this.$o$ -= 7) : this.$d$ += 2
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
}, $a$:$SUPPORT_DATAVIEW$$ ? function($address$$2$$) {
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
}, $l$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
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
  return $JSCompiler_StaticMethods_d_$self$$.$a$($JSCompiler_StaticMethods_d_$self$$.$d$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$63$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$63$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$62$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$62$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$c$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$62$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$62$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$k$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$i$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$61$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$61$$ + ($JSCompiler_StaticMethods_adc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$c$ = ($hl$$ ^ $result$$1$$ ^ $value$$61$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$61$$ ^ $hl$$ ^ 32768) & ($value$$61$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$k$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$i$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$60$$) {
  var $result$$ = $reg$$ + $value$$60$$;
  $JSCompiler_StaticMethods_add16$self$$.$c$ = $JSCompiler_StaticMethods_add16$self$$.$c$ & 196 | ($reg$$ ^ $result$$ ^ $value$$60$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$59$$) {
  $value$$59$$ = $value$$59$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$C$[$value$$59$$];
  return $value$$59$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$58$$) {
  $value$$58$$ = $value$$58$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$D$[$value$$58$$];
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
  $JSCompiler_StaticMethods_cp_a$self$$.$c$ = $JSCompiler_StaticMethods_cp_a$self$$.$u$[$JSCompiler_StaticMethods_cp_a$self$$.$b$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$b$ - $value$$52$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$51$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$c$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$b$ - $value$$51$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$c$ = $JSCompiler_StaticMethods_sbc_a$self$$.$u$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$b$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$b$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$50$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$b$ - $value$$50$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$c$ = $JSCompiler_StaticMethods_sub_a$self$$.$u$[$JSCompiler_StaticMethods_sub_a$self$$.$b$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$b$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$49$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$c$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$b$ + $value$$49$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$c$ = $JSCompiler_StaticMethods_adc_a$self$$.$v$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$b$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$b$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$48$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$b$ + $value$$48$$ & 255;
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
  $JSCompiler_StaticMethods_bit$self$$.$c$ = $JSCompiler_StaticMethods_bit$self$$.$c$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$K$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$46$$) {
  var $carry$$7$$ = $value$$46$$ & 1;
  $value$$46$$ = $value$$46$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$c$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$m$[$value$$46$$];
  return $value$$46$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$45$$) {
  var $carry$$6$$ = $value$$45$$ & 1;
  $value$$45$$ = $value$$45$$ >> 1 | $value$$45$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$c$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$m$[$value$$45$$];
  return $value$$45$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$44$$) {
  var $carry$$5$$ = ($value$$44$$ & 128) >> 7;
  $value$$44$$ = ($value$$44$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$c$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$m$[$value$$44$$];
  return $value$$44$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$43$$) {
  var $carry$$4$$ = ($value$$43$$ & 128) >> 7;
  $value$$43$$ = $value$$43$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$c$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$m$[$value$$43$$];
  return $value$$43$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$42$$) {
  var $carry$$3$$ = $value$$42$$ & 1;
  $value$$42$$ = ($value$$42$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$c$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$c$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$m$[$value$$42$$];
  return $value$$42$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$41$$) {
  var $carry$$2$$ = ($value$$41$$ & 128) >> 7;
  $value$$41$$ = ($value$$41$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$c$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$c$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$m$[$value$$41$$];
  return $value$$41$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$40$$) {
  var $carry$$1$$ = $value$$40$$ & 1;
  $value$$40$$ = ($value$$40$$ >> 1 | $value$$40$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$c$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$m$[$value$$40$$];
  return $value$$40$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$39$$) {
  var $carry$$ = ($value$$39$$ & 128) >> 7;
  $value$$39$$ = ($value$$39$$ << 1 | $value$$39$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$c$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$m$[$value$$39$$];
  return $value$$39$$
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
function $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_push1$self$$, $value$$38$$) {
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$38$$ >> 8);
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$38$$ & 255)
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
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$d$ = $JSCompiler_StaticMethods_jp$self$$.$l$($JSCompiler_StaticMethods_jp$self$$.$d$) : $JSCompiler_StaticMethods_jp$self$$.$d$ += 2
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$w$:[]};
function $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_peepholePortIn$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_peepholePortIn$self$$.$G$.$is_gg$ && 7 > $port$$1$$) {
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
  if($JSCompiler_StaticMethods_peepholePortOut$self$$.$G$.$is_gg$ && 7 > $port$$) {
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
      if($JSCompiler_StaticMethods_peepholePortOut$self$$.$G$.$soundEnabled$) {
        return"this.psg.write(this.a);"
      }
  }
  return""
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self$$, $index$$45$$, $address$$9_address$$inline_118$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_119$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_118$$, $code$$6_code$$inline_123$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcodesArray$$inline_120_operand$$2$$ = "";
  $address$$9_address$$inline_118$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_119$$ = "ADD " + $index$$45$$ + ",BC";
      $code$$6_code$$inline_123$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_119$$ = "ADD " + $index$$45$$ + ",DE";
      $code$$6_code$$inline_123$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcodesArray$$inline_120_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$l$($address$$9_address$$inline_118$$));
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "," + $opcodesArray$$inline_120_operand$$2$$;
      $code$$6_code$$inline_123$$ = "this.set" + $index$$45$$ + "(" + $opcodesArray$$inline_120_operand$$2$$ + ");";
      $address$$9_address$$inline_118$$ += 2;
      break;
    case 34:
      $opcodesArray$$inline_120_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$l$($address$$9_address$$inline_118$$));
      $inst$$3_opcode$$inline_119$$ = "LD (" + $opcodesArray$$inline_120_operand$$2$$ + ")," + $index$$45$$;
      $code$$6_code$$inline_123$$ = "var location = " + $opcodesArray$$inline_120_operand$$2$$ + ";this.writeMem(location++, this." + $index$$45$$.toLowerCase() + "L);this.writeMem(location, this." + $index$$45$$.toLowerCase() + "H);";
      $address$$9_address$$inline_118$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_119$$ = "INC " + $index$$45$$;
      $code$$6_code$$inline_123$$ = "this.inc" + $index$$45$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_119$$ = "INC " + $index$$45$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_119$$ = "DEC " + $index$$45$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$)) + " *";
      $address$$9_address$$inline_118$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_119$$ = "ADD " + $index$$45$$ + "  " + $index$$45$$;
      break;
    case 42:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + " (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$l$($address$$9_address$$inline_118$$)) + ")";
      $address$$9_address$$inline_118$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_119$$ = "DEC " + $index$$45$$;
      $code$$6_code$$inline_123$$ = "this.dec" + $index$$45$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_119$$ = "INC " + $index$$45$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_119$$ = "DEC " + $index$$45$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$));
      $address$$9_address$$inline_118$$++;
      break;
    case 52:
      var $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$), $inst$$3_opcode$$inline_119$$ = "INC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")", $code$$6_code$$inline_123$$ = "this.incMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 53:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "DEC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.decMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 54:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $opcodesArray$$inline_120_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$ + 1));
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")," + $opcodesArray$$inline_120_operand$$2$$;
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", " + $opcodesArray$$inline_120_operand$$2$$ + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 57:
      $inst$$3_opcode$$inline_119$$ = "ADD " + $index$$45$$ + " SP";
      break;
    case 68:
      $inst$$3_opcode$$inline_119$$ = "LD B," + $index$$45$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_119$$ = "LD B," + $index$$45$$ + "L *";
      break;
    case 70:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD B,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.b = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_119$$ = "LD C," + $index$$45$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_119$$ = "LD C," + $index$$45$$ + "L *";
      break;
    case 78:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD C,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.c = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_119$$ = "LD D," + $index$$45$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_119$$ = "LD D," + $index$$45$$ + "L *";
      break;
    case 86:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD D,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.d = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_119$$ = "LD E," + $index$$45$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_119$$ = "LD E," + $index$$45$$ + "L *";
      break;
    case 94:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD E,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.e = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "L *";
      break;
    case 102:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD H,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.h = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "L *";
      break;
    case 110:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD L,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.l = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_119$$ = "LD " + $index$$45$$ + "L,A *";
      break;
    case 112:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),B";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.b);";
      $address$$9_address$$inline_118$$++;
      break;
    case 113:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),C";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.c);";
      $address$$9_address$$inline_118$$++;
      break;
    case 114:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),D";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.d);";
      $address$$9_address$$inline_118$$++;
      break;
    case 115:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),E";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.e);";
      $address$$9_address$$inline_118$$++;
      break;
    case 116:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),H";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.h);";
      $address$$9_address$$inline_118$$++;
      break;
    case 117:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),L";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.l);";
      $address$$9_address$$inline_118$$++;
      break;
    case 119:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "),A";
      $code$$6_code$$inline_123$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ", this.a);";
      $address$$9_address$$inline_118$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_119$$ = "LD A," + $index$$45$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_119$$ = "LD A," + $index$$45$$ + "L *";
      break;
    case 126:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "LD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")";
      $code$$6_code$$inline_123$$ = "this.a = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ");";
      $address$$9_address$$inline_118$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_119$$ = "ADD A," + $index$$45$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_119$$ = "ADD A," + $index$$45$$ + "L *";
      break;
    case 134:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "ADD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $code$$6_code$$inline_123$$ = "this.add_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "));";
      $address$$9_address$$inline_118$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_119$$ = "ADC A," + $index$$45$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_119$$ = "ADC A," + $index$$45$$ + "L *";
      break;
    case 142:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "ADC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $address$$9_address$$inline_118$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_119$$ = "SUB " + $index$$45$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_119$$ = "SUB " + $index$$45$$ + "L *";
      break;
    case 150:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "SUB A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $code$$6_code$$inline_123$$ = "this.sub_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "));";
      $address$$9_address$$inline_118$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_119$$ = "SBC A," + $index$$45$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_119$$ = "SBC A," + $index$$45$$ + "L *";
      break;
    case 158:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "SBC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $address$$9_address$$inline_118$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_119$$ = "AND " + $index$$45$$ + "H *";
      break;
    case 165:
      $inst$$3_opcode$$inline_119$$ = "AND " + $index$$45$$ + "L *";
      break;
    case 166:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "AND A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $address$$9_address$$inline_118$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_119$$ = "XOR A " + $index$$45$$ + "H*";
      break;
    case 173:
      $inst$$3_opcode$$inline_119$$ = "XOR A " + $index$$45$$ + "L*";
      break;
    case 174:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "XOR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $code$$6_code$$inline_123$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")];";
      $address$$9_address$$inline_118$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_119$$ = "OR A " + $index$$45$$ + "H*";
      break;
    case 181:
      $inst$$3_opcode$$inline_119$$ = "OR A " + $index$$45$$ + "L*";
      break;
    case 182:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "OR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $code$$6_code$$inline_123$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + ")];";
      $address$$9_address$$inline_118$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_119$$ = "CP " + $index$$45$$ + "H *";
      break;
    case 189:
      $inst$$3_opcode$$inline_119$$ = "CP " + $index$$45$$ + "L *";
      break;
    case 190:
      $inst$$inline_121_offset$$16$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $inst$$3_opcode$$inline_119$$ = "CP (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "))";
      $code$$6_code$$inline_123$$ = "this.cp_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_121_offset$$16$$) + "));";
      $address$$9_address$$inline_118$$++;
      break;
    case 203:
      $inst$$3_opcode$$inline_119$$ = $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$);
      $opcodesArray$$inline_120_operand$$2$$ = [$inst$$3_opcode$$inline_119$$];
      $inst$$inline_121_offset$$16$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$6_code$$inline_123$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_118$$++;
      switch($inst$$3_opcode$$inline_119$$) {
        case 0:
          $inst$$inline_121_offset$$16$$ = "LD B,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_121_offset$$16$$ = "LD C,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_121_offset$$16$$ = "LD D,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_121_offset$$16$$ = "LD E,RLC (" + $index$$45$$ + ")";
          break;
        case 4:
          $inst$$inline_121_offset$$16$$ = "LD H,RLC (" + $index$$45$$ + ")";
          break;
        case 5:
          $inst$$inline_121_offset$$16$$ = "LD L,RLC (" + $index$$45$$ + ")";
          break;
        case 6:
          $inst$$inline_121_offset$$16$$ = "RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_121_offset$$16$$ = "LD A,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_121_offset$$16$$ = "LD B,RRC (" + $index$$45$$ + ")";
          break;
        case 9:
          $inst$$inline_121_offset$$16$$ = "LD C,RRC (" + $index$$45$$ + ")";
          break;
        case 10:
          $inst$$inline_121_offset$$16$$ = "LD D,RRC (" + $index$$45$$ + ")";
          break;
        case 11:
          $inst$$inline_121_offset$$16$$ = "LD E,RRC (" + $index$$45$$ + ")";
          break;
        case 12:
          $inst$$inline_121_offset$$16$$ = "LD H,RRC (" + $index$$45$$ + ")";
          break;
        case 13:
          $inst$$inline_121_offset$$16$$ = "LD L,RRC (" + $index$$45$$ + ")";
          break;
        case 14:
          $inst$$inline_121_offset$$16$$ = "RRC (" + $index$$45$$ + ")";
          break;
        case 15:
          $inst$$inline_121_offset$$16$$ = "LD A,RRC (" + $index$$45$$ + ")";
          break;
        case 16:
          $inst$$inline_121_offset$$16$$ = "LD B,RL (" + $index$$45$$ + ")";
          break;
        case 17:
          $inst$$inline_121_offset$$16$$ = "LD C,RL (" + $index$$45$$ + ")";
          break;
        case 18:
          $inst$$inline_121_offset$$16$$ = "LD D,RL (" + $index$$45$$ + ")";
          break;
        case 19:
          $inst$$inline_121_offset$$16$$ = "LD E,RL (" + $index$$45$$ + ")";
          break;
        case 20:
          $inst$$inline_121_offset$$16$$ = "LD H,RL (" + $index$$45$$ + ")";
          break;
        case 21:
          $inst$$inline_121_offset$$16$$ = "LD L,RL (" + $index$$45$$ + ")";
          break;
        case 22:
          $inst$$inline_121_offset$$16$$ = "RL (" + $index$$45$$ + ")";
          break;
        case 23:
          $inst$$inline_121_offset$$16$$ = "LD A,RL (" + $index$$45$$ + ")";
          break;
        case 24:
          $inst$$inline_121_offset$$16$$ = "LD B,RR (" + $index$$45$$ + ")";
          break;
        case 25:
          $inst$$inline_121_offset$$16$$ = "LD C,RR (" + $index$$45$$ + ")";
          break;
        case 26:
          $inst$$inline_121_offset$$16$$ = "LD D,RR (" + $index$$45$$ + ")";
          break;
        case 27:
          $inst$$inline_121_offset$$16$$ = "LD E,RR (" + $index$$45$$ + ")";
          break;
        case 28:
          $inst$$inline_121_offset$$16$$ = "LD H,RR (" + $index$$45$$ + ")";
          break;
        case 29:
          $inst$$inline_121_offset$$16$$ = "LD L,RR (" + $index$$45$$ + ")";
          $code$$6_code$$inline_123$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_getIndex$self$$.$a$($address$$9_address$$inline_118$$) + ") & 0xFFFF;this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_121_offset$$16$$ = "RR (" + $index$$45$$ + ")";
          break;
        case 31:
          $inst$$inline_121_offset$$16$$ = "LD A,RR (" + $index$$45$$ + ")";
          break;
        case 32:
          $inst$$inline_121_offset$$16$$ = "LD B,SLA (" + $index$$45$$ + ")";
          break;
        case 33:
          $inst$$inline_121_offset$$16$$ = "LD C,SLA (" + $index$$45$$ + ")";
          break;
        case 34:
          $inst$$inline_121_offset$$16$$ = "LD D,SLA (" + $index$$45$$ + ")";
          break;
        case 35:
          $inst$$inline_121_offset$$16$$ = "LD E,SLA (" + $index$$45$$ + ")";
          break;
        case 36:
          $inst$$inline_121_offset$$16$$ = "LD H,SLA (" + $index$$45$$ + ")";
          break;
        case 37:
          $inst$$inline_121_offset$$16$$ = "LD L,SLA (" + $index$$45$$ + ")";
          break;
        case 38:
          $inst$$inline_121_offset$$16$$ = "SLA (" + $index$$45$$ + ")";
          break;
        case 39:
          $inst$$inline_121_offset$$16$$ = "LD A,SLA (" + $index$$45$$ + ")";
          break;
        case 40:
          $inst$$inline_121_offset$$16$$ = "LD B,SRA (" + $index$$45$$ + ")";
          break;
        case 41:
          $inst$$inline_121_offset$$16$$ = "LD C,SRA (" + $index$$45$$ + ")";
          break;
        case 42:
          $inst$$inline_121_offset$$16$$ = "LD D,SRA (" + $index$$45$$ + ")";
          break;
        case 43:
          $inst$$inline_121_offset$$16$$ = "LD E,SRA (" + $index$$45$$ + ")";
          break;
        case 44:
          $inst$$inline_121_offset$$16$$ = "LD H,SRA (" + $index$$45$$ + ")";
          break;
        case 45:
          $inst$$inline_121_offset$$16$$ = "LD L,SRA (" + $index$$45$$ + ")";
          break;
        case 46:
          $inst$$inline_121_offset$$16$$ = "SRA (" + $index$$45$$ + ")";
          break;
        case 47:
          $inst$$inline_121_offset$$16$$ = "LD A,SRA (" + $index$$45$$ + ")";
          break;
        case 48:
          $inst$$inline_121_offset$$16$$ = "LD B,SLL (" + $index$$45$$ + ")";
          break;
        case 49:
          $inst$$inline_121_offset$$16$$ = "LD C,SLL (" + $index$$45$$ + ")";
          break;
        case 50:
          $inst$$inline_121_offset$$16$$ = "LD D,SLL (" + $index$$45$$ + ")";
          break;
        case 51:
          $inst$$inline_121_offset$$16$$ = "LD E,SLL (" + $index$$45$$ + ")";
          break;
        case 52:
          $inst$$inline_121_offset$$16$$ = "LD H,SLL (" + $index$$45$$ + ")";
          break;
        case 53:
          $inst$$inline_121_offset$$16$$ = "LD L,SLL (" + $index$$45$$ + ")";
          break;
        case 54:
          $inst$$inline_121_offset$$16$$ = "SLL (" + $index$$45$$ + ") *";
          break;
        case 55:
          $inst$$inline_121_offset$$16$$ = "LD A,SLL (" + $index$$45$$ + ")";
          break;
        case 56:
          $inst$$inline_121_offset$$16$$ = "LD B,SRL (" + $index$$45$$ + ")";
          break;
        case 57:
          $inst$$inline_121_offset$$16$$ = "LD C,SRL (" + $index$$45$$ + ")";
          break;
        case 58:
          $inst$$inline_121_offset$$16$$ = "LD D,SRL (" + $index$$45$$ + ")";
          break;
        case 59:
          $inst$$inline_121_offset$$16$$ = "LD E,SRL (" + $index$$45$$ + ")";
          break;
        case 60:
          $inst$$inline_121_offset$$16$$ = "LD H,SRL (" + $index$$45$$ + ")";
          break;
        case 61:
          $inst$$inline_121_offset$$16$$ = "LD L,SRL (" + $index$$45$$ + ")";
          break;
        case 62:
          $inst$$inline_121_offset$$16$$ = "SRL (" + $index$$45$$ + ")";
          break;
        case 63:
          $inst$$inline_121_offset$$16$$ = "LD A,SRL (" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "BIT 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "RES 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_121_offset$$16$$ = "SET 7,(" + $index$$45$$ + ")"
      }
      $inst$$3_opcode$$inline_119$$ = $inst$$inline_121_offset$$16$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($opcodesArray$$inline_120_operand$$2$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_119$$ = "POP " + $index$$45$$;
      $code$$6_code$$inline_123$$ = "this.set" + $index$$45$$ + "(this.readMemWord(this.sp)); this.sp += 2;";
      break;
    case 227:
      $inst$$3_opcode$$inline_119$$ = "EX SP,(" + $index$$45$$ + ")";
      break;
    case 229:
      $inst$$3_opcode$$inline_119$$ = "PUSH " + $index$$45$$;
      $code$$6_code$$inline_123$$ = "this.push2(this." + $index$$45$$.toLowerCase() + "H, this." + $index$$45$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_opcode$$inline_119$$ = "JP (" + $index$$45$$ + ")";
      $address$$9_address$$inline_118$$ = $JSCompiler_alias_NULL$$;
      break;
    case 249:
      $inst$$3_opcode$$inline_119$$ = "LD SP," + $index$$45$$
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_119$$, code:$code$$6_code$$inline_123$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_118$$}
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
  for(var $tstates$$ = 0, $prevPc$$ = 0, $breakNeeded$$ = $JSCompiler_alias_FALSE$$, $code$$2$$ = ['"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$10$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$10$$ < $length$$17$$;$i$$10$$++) {
    if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$]) {
      if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$isJumpTarget$ || $prevPc$$ != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevPc$$ && !$breakNeeded$$ && $code$$2$$.push("this.pc = " + $JSSMS$Utils$toHex$$($prevPc$$) + ";"), $code$$2$$.push("},"), $code$$2$$.push("" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$) + ": function(temp) {")
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
function $JSSMS$Vdp$$($i$$inline_151_i$$inline_154_sms$$3$$) {
  this.$h$ = $i$$inline_151_i$$inline_154_sms$$3$$;
  var $i$$13_r$$inline_155$$ = 0;
  this.$z$ = 0;
  this.$d$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_155$$ = 0;96 > $i$$13_r$$inline_155$$;$i$$13_r$$inline_155$$++) {
    this.$a$[$i$$13_r$$inline_155$$] = 255
  }
  this.$c$ = Array(16);
  this.$e$ = 0;
  this.$j$ = $JSCompiler_alias_FALSE$$;
  this.$q$ = this.$l$ = this.$w$ = this.$r$ = this.$f$ = this.$i$ = 0;
  this.$p$ = Array(256);
  this.$D$ = 0;
  this.$b$ = $i$$inline_151_i$$inline_154_sms$$3$$.$b$.$canvasImageData$.data;
  this.$H$ = Array(64);
  this.$G$ = Array(64);
  this.$F$ = Array(64);
  this.$C$ = Array(256);
  this.$B$ = Array(256);
  this.$A$ = Array(16);
  this.$g$ = this.$u$ = this.$s$ = 0;
  this.$k$ = $JSCompiler_alias_FALSE$$;
  this.$n$ = Array(192);
  for($i$$13_r$$inline_155$$ = 0;192 > $i$$13_r$$inline_155$$;$i$$13_r$$inline_155$$++) {
    this.$n$[$i$$13_r$$inline_155$$] = Array(25)
  }
  this.$t$ = Array(512);
  this.$v$ = Array(512);
  for($i$$inline_151_i$$inline_154_sms$$3$$ = this.$m$ = this.$o$ = 0;512 > $i$$inline_151_i$$inline_154_sms$$3$$;$i$$inline_151_i$$inline_154_sms$$3$$++) {
    this.$t$[$i$$inline_151_i$$inline_154_sms$$3$$] = Array(64)
  }
  var $g$$inline_156$$, $b$$inline_157$$;
  for($i$$inline_151_i$$inline_154_sms$$3$$ = 0;64 > $i$$inline_151_i$$inline_154_sms$$3$$;$i$$inline_151_i$$inline_154_sms$$3$$++) {
    $i$$13_r$$inline_155$$ = $i$$inline_151_i$$inline_154_sms$$3$$ & 3, $g$$inline_156$$ = $i$$inline_151_i$$inline_154_sms$$3$$ >> 2 & 3, $b$$inline_157$$ = $i$$inline_151_i$$inline_154_sms$$3$$ >> 4 & 3, this.$H$[$i$$inline_151_i$$inline_154_sms$$3$$] = 85 * $i$$13_r$$inline_155$$ & 255, this.$G$[$i$$inline_151_i$$inline_154_sms$$3$$] = 85 * $g$$inline_156$$ & 255, this.$F$[$i$$inline_151_i$$inline_154_sms$$3$$] = 85 * $b$$inline_157$$ & 255
  }
  for($i$$inline_151_i$$inline_154_sms$$3$$ = 0;256 > $i$$inline_151_i$$inline_154_sms$$3$$;$i$$inline_151_i$$inline_154_sms$$3$$++) {
    $g$$inline_156$$ = $i$$inline_151_i$$inline_154_sms$$3$$ & 15, $b$$inline_157$$ = $i$$inline_151_i$$inline_154_sms$$3$$ >> 4 & 15, this.$C$[$i$$inline_151_i$$inline_154_sms$$3$$] = ($g$$inline_156$$ << 4 | $g$$inline_156$$) & 255, this.$B$[$i$$inline_151_i$$inline_154_sms$$3$$] = ($b$$inline_157$$ << 4 | $b$$inline_157$$) & 255
  }
  for($i$$inline_151_i$$inline_154_sms$$3$$ = 0;16 > $i$$inline_151_i$$inline_154_sms$$3$$;$i$$inline_151_i$$inline_154_sms$$3$$++) {
    this.$A$[$i$$inline_151_i$$inline_154_sms$$3$$] = ($i$$inline_151_i$$inline_154_sms$$3$$ << 4 | $i$$inline_151_i$$inline_154_sms$$3$$) & 255
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
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$ = this.$a$.$a$;
  console.time("DOT generation");
  for(var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$.$w$, $content$$inline_161$$ = ["digraph G {"], $i$$inline_162$$ = 0, $length$$inline_163$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$.length;$i$$inline_162$$ < $length$$inline_163$$;$i$$inline_162$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$] && ($content$$inline_161$$.push(" " + $i$$inline_162$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$].label + '"];'), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$].target != $JSCompiler_alias_NULL$$ && $content$$inline_161$$.push(" " + 
    $i$$inline_162$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$].target + ";"), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$].$nextAddress$ != $JSCompiler_alias_NULL$$ && $content$$inline_161$$.push(" " + $i$$inline_162$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_159_tree$$inline_160$$[$i$$inline_162$$].$nextAddress$ + 
    ";"))
  }
  $content$$inline_161$$.push("}");
  $content$$inline_161$$ = $content$$inline_161$$.join("\n");
  $content$$inline_161$$ = $content$$inline_161$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  console.timeEnd("DOT generation");
  return $content$$inline_161$$
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$z$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$l$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$l$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$l$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$j$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_171_value$$inline_168$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$w$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$w$ = $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$d$[$JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$f$++ & 
      16383] & 255;
      return $statuscopy$$inline_171_value$$inline_168$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$ = $JSCompiler_StaticMethods_in_$self$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$j$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_171_value$$inline_168$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$e$, $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$e$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_170_JSCompiler_StaticMethods_dataRead$self$$inline_167_JSCompiler_StaticMethods_getVCount$self$$inline_165_JSCompiler_inline_result$$4$$.$h$.$a$.$B$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_171_value$$inline_168$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$b$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$b$[0] | $JSCompiler_StaticMethods_in_$self$$.$b$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$, $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$, $reg$$inline_181_value$$70$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$d$.$is_gg$ && 7 > $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$)) {
    switch($address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[0] = ($reg$$inline_181_value$$70$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[1] = $reg$$inline_181_value$$70$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$;
        $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$r$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ & 16383;
            if($reg$$inline_181_value$$70$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$] & 255)) {
              if($address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ && $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ + 128 && $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_177$$ = $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$v$[$tileIndex$$inline_177$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_177$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_177$$);
                  $tileIndex$$inline_177$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$m$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$m$ = $tileIndex$$inline_177$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$] = $reg$$inline_181_value$$70$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$h$.$is_sms$ ? ($address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_181_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$G$[$reg$$inline_181_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$F$[$reg$$inline_181_value$$70$$]) : 
            ($address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$C$[$reg$$inline_181_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$B$[$reg$$inline_181_value$$70$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$A$[$reg$$inline_181_value$$70$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$a$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$j$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ = $reg$$inline_181_value$$70$$, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ & 16128 | $reg$$inline_181_value$$70$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$r$ = $reg$$inline_181_value$$70$$ >> 
          6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ | $reg$$inline_181_value$$70$$ << 8, 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$r$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$w$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$d$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$r$) {
              $reg$$inline_181_value$$70$$ &= 15;
              switch($reg$$inline_181_value$$70$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$e$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$B$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_181_value$$70$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$D$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$ & -130) << 7, $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_176_old$$inline_182_port$$2_temp$$inline_175$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$g$))
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_181_value$$70$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$i$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$d$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$e$, 0 != ($reg$$inline_181_value$$70$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_181_value$$70$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_181_value$$70$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_181_value$$70$$ & 63) << 4 : 
          $reg$$inline_181_value$$70$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$h$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_184_JSCompiler_StaticMethods_controlWrite$self$$inline_179_JSCompiler_StaticMethods_dataWrite$self$$inline_173_JSCompiler_StaticMethods_out$self$$.$f$ = 
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
