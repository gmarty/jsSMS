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
'use strict';var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1, $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$h$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if($opts$$ != $JSCompiler_alias_VOID$$) {
    for(var $key$$16$$ in this.$h$) {
      $opts$$[$key$$16$$] != $JSCompiler_alias_VOID$$ && (this.$h$[$key$$16$$] = $opts$$[$key$$16$$])
    }
  }
  this.$keyboard$ = new $JSSMS$Keyboard$$(this);
  this.$a$ = new $opts$$.ui(this);
  this.$vdp$ = new $JSSMS$Vdp$$(this);
  this.$b$ = new $JSSMS$SN76489$$(this);
  this.$c$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$a$.updateStatus("Ready to load a ROM.");
  this.ui = this.$a$
}
$JSSMS$$.prototype = {$isRunning$:$JSCompiler_alias_FALSE$$, $cyclesPerLine$:0, $no_of_scanlines$:0, $fps$:0, $pause_button$:$JSCompiler_alias_FALSE$$, $is_sms$:$JSCompiler_alias_TRUE$$, $is_gg$:$JSCompiler_alias_FALSE$$, $soundEnabled$:$JSCompiler_alias_FALSE$$, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $romData$:"", $romFileName$:"", $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ = this.$vdp$.$G$, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$G$ = $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ = this.$b$;
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$n$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$g$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$j$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$h$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$f$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ && ($JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$.$i$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $currentAddress$$inline_236_fractional$$inline_18$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $currentAddress$$inline_236_fractional$$inline_18$$, $currentAddress$$inline_236_fractional$$inline_18$$ = $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ - ($JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ >> 16
      }
    }
  }
  this.$keyboard$.reset();
  this.$a$.reset();
  this.$vdp$.reset();
  this.$c$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$main$.$a$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ = 16384 * $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$rom$.length, $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$, $i$$inline_237$$ = 0, $addresses$$inline_238$$ = [];
  $addresses$$inline_238$$.push(0);
  $addresses$$inline_238$$.push(56);
  for($addresses$$inline_238$$.push(102);$addresses$$inline_238$$.length;) {
    if($currentAddress$$inline_236_fractional$$inline_18$$ = $addresses$$inline_238$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$currentAddress$$inline_236_fractional$$inline_18$$]) {
      if($currentAddress$$inline_236_fractional$$inline_18$$ >= $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$ || 65 <= $currentAddress$$inline_236_fractional$$inline_18$$ >> 10) {
        console.log("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$inline_236_fractional$$inline_18$$))
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $currentAddress$$inline_236_fractional$$inline_18$$;
        $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
        var $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = [$instruction$$inline_235_opcode$$inline_385_options$$inline_408$$], $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "Unknown Opcode", $currAddr$$inline_388_prop$$inline_410$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$, $address$$inline_400_target$$inline_389$$ = $JSCompiler_alias_NULL$$, $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($instruction$$inline_235_opcode$$inline_385_options$$inline_408$$) + 
        '";', $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = "", $code$$inline_399_location$$inline_392_target$$inline_405$$ = 0;
        $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
        switch($instruction$$inline_235_opcode$$inline_385_options$$inline_408$$) {
          case 0:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "NOP";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 1:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD BC," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setBC(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 2:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (BC),A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC BC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 7:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RLCA";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "EX AF AF'";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD HL,BC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,(BC)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC BC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 15:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RRCA";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 5;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 17:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD DE," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setDE(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 18:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (DE),A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC DE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 23:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RLA";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $JSCompiler_alias_NULL$$;
            break;
          case 25:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD HL,DE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,(DE)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC DE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 31:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RRA";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 5;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 33:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD HL," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 34:
            $code$$inline_399_location$$inline_392_target$$inline_405$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($code$$inline_399_location$$inline_392_target$$inline_405$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "),HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($code$$inline_399_location$$inline_392_target$$inline_405$$ + 1) + ", this.h);";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 35:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 39:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DAA";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 5;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 41:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD HL,HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD HL,(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.readMemWord(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "));";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 43:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 47:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CPL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 5;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 49:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD SP," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sp = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 50:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "),A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ", this.a);";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 51:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC SP";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC (HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC (HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL)," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 55:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SCF";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$) + 1);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 5;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 57:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD HL,SP";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.readMem(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 59:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC SP";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "INC A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DEC A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ";";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 63:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CCF";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 65:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD B,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 74:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD C,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 83:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD D,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 92:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD E,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 101:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD H,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 110:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD L,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "HALT";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.tstates = 0;";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ += "this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "; return;";
            break;
          case 119:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD (HL),A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 128:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$.$m$[0]) + "; this.a = " + $JSSMS$Utils$toHex$$(0) + ";";
            break;
          case 176:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,B";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,D";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,E";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,H";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,L";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,(HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP A,A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET NZ";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "POP BC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 195:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $JSCompiler_alias_NULL$$;
            break;
          case 196:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 197:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "PUSH BC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADD A," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.add_a(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 199:
            $address$$inline_400_target$$inline_389$$ = 0;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 200:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET Z";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $JSCompiler_alias_NULL$$;
            break;
          case 202:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 203:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$];
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$;
            $code$$inline_399_location$$inline_392_target$$inline_405$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$) {
              case 0:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.rlc(this.c));";
                break;
              case 2:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.rlc(this.d));";
                break;
              case 3:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.rlc(this.e));";
                break;
              case 4:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.rlc(this.h));";
                break;
              case 5:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.rlc(this.l));";
                break;
              case 6:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
                break;
              case 7:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLC A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.rlc(this.a));";
                break;
              case 8:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.rrc(this.b));";
                break;
              case 9:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.rrc(this.c));";
                break;
              case 10:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.rrc(this.d));";
                break;
              case 11:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.rrc(this.e));";
                break;
              case 12:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.rrc(this.h));";
                break;
              case 13:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.rrc(this.l));";
                break;
              case 14:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
                break;
              case 15:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRC A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.rrc(this.a));";
                break;
              case 16:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.rl(this.b));";
                break;
              case 17:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.rl(this.c));";
                break;
              case 18:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.rl(this.d));";
                break;
              case 19:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.rl(this.e));";
                break;
              case 20:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.rl(this.h));";
                break;
              case 21:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.rl(this.l));";
                break;
              case 22:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
                break;
              case 23:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RL A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.rl(this.a));";
                break;
              case 24:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.rr(this.b));";
                break;
              case 25:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.rr(this.c));";
                break;
              case 26:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.rr(this.d));";
                break;
              case 27:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.rr(this.e));";
                break;
              case 28:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.rr(this.h));";
                break;
              case 29:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.rr(this.l));";
                break;
              case 30:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
                break;
              case 31:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RR A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.rr(this.a));";
                break;
              case 32:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.sla(this.b));";
                break;
              case 33:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.sla(this.c));";
                break;
              case 34:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.sla(this.d));";
                break;
              case 35:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.sla(this.e));";
                break;
              case 36:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.sla(this.h));";
                break;
              case 37:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.sla(this.l));";
                break;
              case 38:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
                break;
              case 39:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLA A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.sla(this.a));";
                break;
              case 40:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.sra(this.b));";
                break;
              case 41:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.sra(this.c));";
                break;
              case 42:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.sra(this.d));";
                break;
              case 43:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.sra(this.e));";
                break;
              case 44:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.sra(this.h));";
                break;
              case 45:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.sra(this.l));";
                break;
              case 46:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
                break;
              case 47:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRA A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.sra(this.a));";
                break;
              case 48:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = (this.sll(this.b));";
                break;
              case 49:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = (this.sll(this.c));";
                break;
              case 50:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = (this.sll(this.d));";
                break;
              case 51:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = (this.sll(this.e));";
                break;
              case 52:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = (this.sll(this.h));";
                break;
              case 53:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = (this.sll(this.l));";
                break;
              case 54:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
                break;
              case 55:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SLL A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = (this.sll(this.a));";
                break;
              case 56:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b = this.srl(this.b);";
                break;
              case 57:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c = this.srl(this.c);";
                break;
              case 58:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d = this.srl(this.d);";
                break;
              case 59:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e = this.srl(this.e);";
                break;
              case 60:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h = this.srl(this.h);";
                break;
              case 61:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l = this.srl(this.l);";
                break;
              case 62:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL (HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
                break;
              case 63:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SRL A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a = this.srl(this.a);";
                break;
              case 64:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_0);";
                break;
              case 65:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_0);";
                break;
              case 66:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_0);";
                break;
              case 67:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_0);";
                break;
              case 68:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_0);";
                break;
              case 69:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_0);";
                break;
              case 70:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
                break;
              case 71:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 0,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_0);";
                break;
              case 72:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_1);";
                break;
              case 73:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_1);";
                break;
              case 74:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_1);";
                break;
              case 75:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_1);";
                break;
              case 76:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_1);";
                break;
              case 77:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_1);";
                break;
              case 78:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
                break;
              case 79:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 1,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_1);";
                break;
              case 80:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_2);";
                break;
              case 81:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_2);";
                break;
              case 82:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_2);";
                break;
              case 83:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_2);";
                break;
              case 84:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_2);";
                break;
              case 85:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_2);";
                break;
              case 86:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
                break;
              case 87:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 2,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_2);";
                break;
              case 88:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_3);";
                break;
              case 89:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_3);";
                break;
              case 90:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_3);";
                break;
              case 91:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_3);";
                break;
              case 92:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_3);";
                break;
              case 93:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_3);";
                break;
              case 94:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
                break;
              case 95:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 3,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_3);";
                break;
              case 96:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_4);";
                break;
              case 97:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_4);";
                break;
              case 98:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_4);";
                break;
              case 99:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_4);";
                break;
              case 100:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_4);";
                break;
              case 101:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_4);";
                break;
              case 102:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
                break;
              case 103:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 4,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_4);";
                break;
              case 104:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_5);";
                break;
              case 105:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_5);";
                break;
              case 106:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_5);";
                break;
              case 107:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_5);";
                break;
              case 108:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_5);";
                break;
              case 109:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_5);";
                break;
              case 110:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
                break;
              case 111:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 5,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_5);";
                break;
              case 112:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_6);";
                break;
              case 113:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_6);";
                break;
              case 114:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_6);";
                break;
              case 115:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_6);";
                break;
              case 116:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_6);";
                break;
              case 117:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_6);";
                break;
              case 118:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
                break;
              case 119:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 6,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_6);";
                break;
              case 120:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.b & BIT_7);";
                break;
              case 121:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.c & BIT_7);";
                break;
              case 122:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.d & BIT_7);";
                break;
              case 123:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.e & BIT_7);";
                break;
              case 124:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.h & BIT_7);";
                break;
              case 125:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.l & BIT_7);";
                break;
              case 126:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
                break;
              case 127:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "BIT 7,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.bit(this.a & BIT_7);";
                break;
              case 128:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b &= ~BIT_0;";
                break;
              case 129:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c &= ~BIT_0;";
                break;
              case 130:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d &= ~BIT_0;";
                break;
              case 131:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e &= ~BIT_0;";
                break;
              case 132:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h &= ~BIT_0;";
                break;
              case 133:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l &= ~BIT_0;";
                break;
              case 134:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
                break;
              case 135:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 0,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a &= ~BIT_0;";
                break;
              case 136:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
                break;
              case 143:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
                break;
              case 151:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
                break;
              case 159:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 3,A";
                break;
              case 160:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
                break;
              case 167:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 4,A";
                break;
              case 168:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
                break;
              case 175:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
                break;
              case 183:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 6,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a &= ~BIT_6;";
                break;
              case 184:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b &= ~BIT_7;";
                break;
              case 185:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c &= ~BIT_7;";
                break;
              case 186:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d &= ~BIT_7;";
                break;
              case 187:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e &= ~BIT_7;";
                break;
              case 188:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h &= ~BIT_7;";
                break;
              case 189:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l &= ~BIT_7;";
                break;
              case 190:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
                break;
              case 191:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RES 7,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a &= ~BIT_7;";
                break;
              case 192:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b |= BIT_0;";
                break;
              case 193:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c |= BIT_0;";
                break;
              case 194:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d |= BIT_0;";
                break;
              case 195:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e |= BIT_0;";
                break;
              case 196:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h |= BIT_0;";
                break;
              case 197:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l |= BIT_0;";
                break;
              case 198:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
                break;
              case 199:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 0,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a |= BIT_0;";
                break;
              case 200:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
                break;
              case 207:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
                break;
              case 215:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
                break;
              case 223:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
                break;
              case 231:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 4,A";
                break;
              case 232:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
                break;
              case 239:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 5,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a |= BIT_5;";
                break;
              case 240:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b |= BIT_6;";
                break;
              case 241:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c |= BIT_6;";
                break;
              case 242:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d |= BIT_6;";
                break;
              case 243:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e |= BIT_6;";
                break;
              case 244:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h |= BIT_6;";
                break;
              case 245:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l |= BIT_6;";
                break;
              case 246:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
                break;
              case 247:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 6,A";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a |= BIT_6;";
                break;
              case 248:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,B";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.b |= BIT_7;";
                break;
              case 249:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,C";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.c |= BIT_7;";
                break;
              case 250:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,D";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.d |= BIT_7;";
                break;
              case 251:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,E";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.e |= BIT_7;";
                break;
              case 252:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,H";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.h |= BIT_7;";
                break;
              case 253:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,L";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.l |= BIT_7;";
                break;
              case 254:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,(HL)";
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
                break;
              case 255:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SET 7,A", $code$$inline_399_location$$inline_392_target$$inline_405$$ = "this.a |= BIT_7;"
            }
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $opcodes$:$inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$, $inst$:$code$$inline_390_inst$$inline_397_inst$$inline_403$$, code:$code$$inline_399_location$$inline_392_target$$inline_405$$, $address$:$_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$, 
            $nextAddress$:$address$$inline_384_address$$inline_394_opcode$$inline_401$$};
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$inst$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.code;
            $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.concat($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$opcodes$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 205:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 206:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "ADC ," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.adc_a(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 207:
            $address$$inline_400_target$$inline_389$$ = 8;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 208:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET NC";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "POP DE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 211:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$) + "),A";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 212:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 213:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "PUSH DE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SUB " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "";
            break;
          case 215:
            $address$$inline_400_target$$inline_389$$ = 16;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 216:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET C";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "EXX";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 219:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 220:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 221:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, "IX", $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$inst$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.code;
            $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.concat($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$opcodes$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$nextAddress$;
            break;
          case 222:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "SBC A," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sbc_a(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 223:
            $address$$inline_400_target$$inline_389$$ = 24;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 224:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET PO";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "POP HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 227:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "EX (SP),HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 229:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "PUSH HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "AND (" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "] | F_HALFCARRY;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 231:
            $address$$inline_400_target$$inline_389$$ = 32;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 232:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET PE";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP (HL)";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.pc = this.getHL(); return;";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $JSCompiler_alias_NULL$$;
            break;
          case 234:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 235:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "EX DE,HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 237:
            var $address$$inline_400_target$$inline_389$$ = $address$$inline_384_address$$inline_394_opcode$$inline_401$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$), $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = [$address$$inline_384_address$$inline_394_opcode$$inline_401$$], 
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "Unimplemented 0xED prefixed opcode", $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $address$$inline_400_target$$inline_389$$, $code$$inline_399_location$$inline_392_target$$inline_405$$ = $JSCompiler_alias_NULL$$, $code$$inline_406$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_407$$ = "";
            $address$$inline_400_target$$inline_389$$++;
            switch($address$$inline_384_address$$inline_394_opcode$$inline_401$$) {
              case 64:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN B,(C)";
                $code$$inline_406$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
                break;
              case 65:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),B";
                $code$$inline_406$$ = "this.port.out(this.c, this.b);";
                break;
              case 66:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SBC HL,BC";
                $code$$inline_406$$ = "this.sbc16(this.getBC());";
                break;
              case 67:
                $operand$$inline_407$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$));
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD (" + $operand$$inline_407$$ + "),BC";
                $code$$inline_406$$ = "var location = " + $operand$$inline_407$$ + ";this.writeMem(location++, this.c);this.writeMem(location, this.b);";
                $address$$inline_400_target$$inline_389$$ += 2;
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
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "NEG";
                $code$$inline_406$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RETN / RETI";
                $code$$inline_406$$ = "this.pc = this.readMemWord(this.sp);this.sp += 2;this.iff1 = this.iff2;";
                $address$$inline_400_target$$inline_389$$ = $JSCompiler_alias_NULL$$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IM 0";
                $code$$inline_406$$ = "this.im = 0;";
                break;
              case 71:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD I,A";
                $code$$inline_406$$ = "this.i = this.a;";
                break;
              case 72:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN C,(C)";
                $code$$inline_406$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
                break;
              case 73:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),C";
                $code$$inline_406$$ = "this.port.out(this.c, this.c);";
                break;
              case 74:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "ADC HL,BC";
                $code$$inline_406$$ = "this.adc16(this.getBC());";
                break;
              case 75:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD BC,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$)) + ")";
                $code$$inline_406$$ = "this.setBC(this.readMemWord(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$)) + "));";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 79:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD R,A";
                $code$$inline_406$$ = "this.r = this.a;";
                break;
              case 80:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN D,(C)";
                $code$$inline_406$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
                break;
              case 81:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),D";
                $code$$inline_406$$ = "this.port.out(this.c, this.d);";
                break;
              case 82:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SBC HL,DE";
                $code$$inline_406$$ = "this.sbc16(this.getDE());";
                break;
              case 83:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$)) + "),DE";
                $code$$inline_406$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.e);this.writeMem(location, this.d);";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IM 1";
                $code$$inline_406$$ = "this.im = 1;";
                break;
              case 87:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD A,I";
                $code$$inline_406$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 88:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN E,(C)";
                $code$$inline_406$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
                break;
              case 89:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),E";
                $code$$inline_406$$ = "this.port.out(this.c, this.e);";
                break;
              case 90:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "ADC HL,DE";
                $code$$inline_406$$ = "this.adc16(this.getDE());";
                break;
              case 91:
                $operand$$inline_407$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$));
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD DE,(" + $operand$$inline_407$$ + ")";
                $code$$inline_406$$ = "this.setDE(" + $operand$$inline_407$$ + ");";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 95:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD A,R";
                $code$$inline_406$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_406$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN H,(C)";
                $code$$inline_406$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
                break;
              case 97:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),H";
                $code$$inline_406$$ = "this.port.out(this.c, this.h);";
                break;
              case 98:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SBC HL,HL";
                $code$$inline_406$$ = "this.sbc16(this.getHL());";
                break;
              case 99:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$)) + "),HL";
                $code$$inline_406$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.l);this.writeMem(location, this.h);";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 103:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RRD";
                $code$$inline_406$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 104:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN L,(C)";
                $code$$inline_406$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
                break;
              case 105:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),L";
                $code$$inline_406$$ = "this.port.out(this.c, this.l);";
                break;
              case 106:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "ADC HL,HL";
                $code$$inline_406$$ = "this.adc16(this.getHL());";
                break;
              case 107:
                $operand$$inline_407$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$));
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD HL,(" + $operand$$inline_407$$ + ")";
                $code$$inline_406$$ = "this.setHL(this.readMemWord(" + $operand$$inline_407$$ + "));";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 111:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "RLD";
                $code$$inline_406$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 113:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),0";
                $code$$inline_406$$ = "this.port.out(this.c, 0);";
                break;
              case 114:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "SBC HL,SP";
                $code$$inline_406$$ = "this.sbc16(this.sp);";
                break;
              case 115:
                $operand$$inline_407$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$));
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD (" + $operand$$inline_407$$ + "),SP";
                $code$$inline_406$$ = "var location = this.readMemWord(" + $operand$$inline_407$$ + ");this.writeMem(location++, this.sp & 0xFF);this.writeMem(location, this.sp >> 8);";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 120:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IN A,(C)";
                $code$$inline_406$$ = "this.a = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 121:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUT (C),A";
                $code$$inline_406$$ = "this.port.out(this.c, this.a);";
                break;
              case 122:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "ADC HL,SP";
                $code$$inline_406$$ = "this.adc16(this.sp);";
                break;
              case 123:
                $operand$$inline_407$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_400_target$$inline_389$$));
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LD SP,(" + $operand$$inline_407$$ + ")";
                $code$$inline_406$$ = "this.sp = this.readMemWord(" + $operand$$inline_407$$ + ");";
                $address$$inline_400_target$$inline_389$$ += 2;
                break;
              case 160:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LDI";
                $code$$inline_406$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);";
                break;
              case 161:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "CPI";
                $code$$inline_406$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
                break;
              case 162:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "INI";
                $code$$inline_406$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 163:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUTI";
                $code$$inline_406$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LDD";
                break;
              case 169:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "CPD";
                break;
              case 170:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "IND";
                $code$$inline_406$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 171:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OUTD";
                $code$$inline_406$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 176:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LDIR";
                $code$$inline_406$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();";
                $code$$inline_406$$ += "for (;this.getBC() != 0; this.f |= F_PARITY, this.tstates -= 5) {this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();}";
                $code$$inline_406$$ += "if (!(this.getBC() != 0)) this.f &= ~ F_PARITY;this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "CPIR";
                $code$$inline_406$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);";
                $code$$inline_406$$ += "for (;(temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0; this.tstates -= 5) {temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);}";
                $code$$inline_406$$ += "this.f = (this.f & 0xF8) | temp;";
                break;
              case 178:
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = $address$$inline_400_target$$inline_389$$ - 2;
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "INIR";
                $code$$inline_406$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_399_location$$inline_392_target$$inline_405$$) + ";return;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 179:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OTIR";
                $code$$inline_406$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();";
                $code$$inline_406$$ += "for (;this.b != 0; this.tstates -= 5) {temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();}";
                $code$$inline_406$$ += "if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "LDDR";
                break;
              case 185:
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "CPDR";
                break;
              case 186:
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = $address$$inline_400_target$$inline_389$$ - 2;
                $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "INDR";
                $code$$inline_406$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_399_location$$inline_392_target$$inline_405$$) + ";return;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 187:
                $code$$inline_399_location$$inline_392_target$$inline_405$$ = $address$$inline_400_target$$inline_389$$ - 2, $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "OTDR", $code$$inline_406$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_399_location$$inline_392_target$$inline_405$$) + ";return;}if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;"
            }
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = {$opcode$:$address$$inline_384_address$$inline_394_opcode$$inline_401$$, $opcodes$:$inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$, $inst$:$code$$inline_390_inst$$inline_397_inst$$inline_403$$, code:$code$$inline_406$$, $address$:$_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$, $nextAddress$:$address$$inline_400_target$$inline_389$$, target:$code$$inline_399_location$$inline_392_target$$inline_405$$};
            $address$$inline_400_target$$inline_389$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.target;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$inst$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.code;
            $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.concat($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$opcodes$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$nextAddress$;
            break;
          case 238:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "XOR A," + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "];";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 239:
            $address$$inline_400_target$$inline_389$$ = 40;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 240:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET P";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "POP AF";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 243:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "DI";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 245:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "PUSH AF";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "OR " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + "];";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 247:
            $address$$inline_400_target$$inline_389$$ = 48;
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$);
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;";
            break;
          case 248:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RET M";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "LD SP,HL";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 251:
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "EI";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_400_target$$inline_389$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ")";
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + ";this.tstates -= 7;return;}";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ += 2;
            break;
          case 253:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, "IY", $address$$inline_384_address$$inline_394_opcode$$inline_401$$);
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$inst$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.code;
            $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.concat($_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$opcodes$);
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$ = $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$.$nextAddress$;
            break;
          case 254:
            $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$, $address$$inline_384_address$$inline_394_opcode$$inline_401$$));
            $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "CP " + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$;
            $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.cp_a(" + $_inst$$inline_393_currAddr$$inline_398_currAddr$$inline_404_operand$$inline_391$$ + ");";
            $address$$inline_384_address$$inline_394_opcode$$inline_401$$++;
            break;
          case 255:
            $address$$inline_400_target$$inline_389$$ = 56, $inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$), $code$$inline_390_inst$$inline_397_inst$$inline_403$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_384_address$$inline_394_opcode$$inline_401$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_400_target$$inline_389$$) + "; return;"
        }
        $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$ = {$opcode$:$instruction$$inline_235_opcode$$inline_385_options$$inline_408$$, $opcodes$:$defaultInstruction$$inline_409_opcodesArray$$inline_386$$, $inst$:$inst$$inline_387_opcodesArray$$inline_396_opcodesArray$$inline_402$$, code:$code$$inline_390_inst$$inline_397_inst$$inline_403$$, $address$:$currAddr$$inline_388_prop$$inline_410$$, $nextAddress$:$address$$inline_384_address$$inline_394_opcode$$inline_401$$, target:$address$$inline_400_target$$inline_389$$};
        $defaultInstruction$$inline_409_opcodesArray$$inline_386$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:$JSCompiler_alias_NULL$$, target:$JSCompiler_alias_NULL$$, $isJumpTarget$:$JSCompiler_alias_FALSE$$, $jumpTargetNb$:0, label:""};
        $currAddr$$inline_388_prop$$inline_410$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$ = "";
        for($currAddr$$inline_388_prop$$inline_410$$ in $defaultInstruction$$inline_409_opcodesArray$$inline_386$$) {
          $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$[$currAddr$$inline_388_prop$$inline_410$$] != $JSCompiler_alias_VOID$$ && ($defaultInstruction$$inline_409_opcodesArray$$inline_386$$[$currAddr$$inline_388_prop$$inline_410$$] = $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$[$currAddr$$inline_388_prop$$inline_410$$])
        }
        $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$address$);
        $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
        $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.label = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self$$inline_383_hexOpcodes$$inline_411_opcode$$inline_395$$ + $defaultInstruction$$inline_409_opcodesArray$$inline_386$$.$inst$;
        $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$ = $defaultInstruction$$inline_409_opcodesArray$$inline_386$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$currentAddress$$inline_236_fractional$$inline_18$$] = $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$;
        $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$.$nextAddress$ != $JSCompiler_alias_NULL$$ && $addresses$$inline_238$$.push($instruction$$inline_235_opcode$$inline_385_options$$inline_408$$.$nextAddress$);
        $instruction$$inline_235_opcode$$inline_385_options$$inline_408$$.target != $JSCompiler_alias_NULL$$ && $addresses$$inline_238$$.push($instruction$$inline_235_opcode$$inline_385_options$$inline_408$$.target)
      }
    }
  }
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[0].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[56].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[102].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;$i$$inline_237$$ < $JSCompiler_StaticMethods_init$self$$inline_229_mode$$inline_14_romSize$$inline_234_v$$inline_17$$;$i$$inline_237$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$] && ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].$nextAddress$ != $JSCompiler_alias_NULL$$ && $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].$nextAddress$] && 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].$nextAddress$].$jumpTargetNb$++, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].target != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].target] ? 
    ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].target].$isJumpTarget$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].target].$jumpTargetNb$++) : 
    console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$instructions$[$i$$inline_237$$].target)))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_231$$.$main$.$a$.updateStatus("Instructions parsed");
  clearInterval(this.$f$)
}, start:function $$JSSMS$$$$start$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = $JSCompiler_alias_TRUE$$, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen), this.$g$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$f$ = setInterval(function() {
    var $now$$inline_25$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$a$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_25$$ - $self$$1$$.$g$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$g$ = $now$$inline_25$$
  }, 500));
  this.$a$.updateStatus("Running")
}, stop:function $$JSSMS$$$$stop$() {
  clearInterval(this.$f$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  this.$isRunning$ && ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$), this.$fpsFrameCount$++, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen))
}, $nextStep$:function $$JSSMS$$$$$nextStep$$() {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$)
}, $loadROM$:function $$JSSMS$$$$$loadROM$$($data$$31$$, $size$$11$$) {
  0 != $size$$11$$ % 1024 && ($data$$31$$ = $data$$31$$.substr(512), $size$$11$$ -= 512);
  var $i$$2$$, $j$$, $number_of_pages$$ = Math.round($size$$11$$ / 16384), $pages$$1$$ = Array($number_of_pages$$);
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
  var $i$$inline_33_pages_size$$10$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  $i$$inline_33_pages_size$$10$$ = $data$$30$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$ ? ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$A$ = 0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$D$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$ && ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = 
  $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$A$ = 5, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$D$ = 27);
  if(16384 >= $i$$inline_33_pages_size$$10$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $i$$inline_33_pages_size$$10$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$loadROM$($data$$30$$, $i$$inline_33_pages_size$$10$$);
  if($i$$inline_33_pages_size$$10$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$cpu$;
  $i$$inline_33_pages_size$$10$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$rom$ = $i$$inline_33_pages_size$$10$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$K$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$K$ - 1;
    for($i$$inline_33_pages_size$$10$$ = 0;3 > $i$$inline_33_pages_size$$10$$;$i$$inline_33_pages_size$$10$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$frameReg$[$i$$inline_33_pages_size$$10$$] = $i$$inline_33_pages_size$$10$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$K$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$K$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_31_mode$$9$$.$romPageMask$ = 0
  }
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romData$ = $data$$30$$;
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romFileName$ = $fileName$$;
  return $JSCompiler_alias_TRUE$$
}
;var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
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
[23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 
20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23], $OP_ED_STATES$$ = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
function $JSSMS$Z80$$($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$) {
  this.$main$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;
  this.$vdp$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$.$vdp$;
  this.$w$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$.$c$;
  this.$I$ = this.$n$ = this.$c$ = 0;
  this.$D$ = this.$H$ = this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$o$ = this.$T$ = this.$b$ = this.$M$ = this.$v$ = this.$s$ = this.$t$ = this.$q$ = this.$V$ = this.$U$ = this.$l$ = this.$j$ = this.$S$ = this.$R$ = this.$e$ = this.$d$ = this.$Q$ = this.$P$ = this.$h$ = this.$i$ = this.$O$ = this.$a$ = this.$J$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$K$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$W$ = Array(2048);
  this.$N$ = Array(256);
  this.$m$ = Array(256);
  this.$G$ = Array(256);
  this.$F$ = Array(256);
  this.$A$ = Array(131072);
  this.$z$ = Array(131072);
  this.$L$ = Array(256);
  var $c$$inline_65_padc$$inline_56_sf$$inline_50$$, $h$$inline_66_psub$$inline_57_zf$$inline_51$$, $n$$inline_67_psbc$$inline_58_yf$$inline_52$$, $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$, $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$, $flags$$inline_242_newval$$inline_61$$;
  for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;256 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
    $c$$inline_65_padc$$inline_56_sf$$inline_50$$ = 0 != ($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 128) ? 128 : 0, $h$$inline_66_psub$$inline_57_zf$$inline_51$$ = 0 == $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ ? 64 : 0, $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 32, $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 
    8, $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$) ? 4 : 0, this.$N$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = $c$$inline_65_padc$$inline_56_sf$$inline_50$$ | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ | $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$, this.$m$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = 
    $c$$inline_65_padc$$inline_56_sf$$inline_50$$ | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ | $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ | $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$, this.$G$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = $c$$inline_65_padc$$inline_56_sf$$inline_50$$ | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ | $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$, 
    this.$G$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 128 == $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ ? 4 : 0, this.$G$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 0 == ($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 15) ? 16 : 0, this.$F$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = $c$$inline_65_padc$$inline_56_sf$$inline_50$$ | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ | 
    $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ | 2, this.$F$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 127 == $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ ? 4 : 0, this.$F$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 15 == ($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 15) ? 16 : 0, this.$L$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = 0 != $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ ? 
    $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ & 128 : 68, this.$L$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ | $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ | 16
  }
  $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;
  $c$$inline_65_padc$$inline_56_sf$$inline_50$$ = 65536;
  $h$$inline_66_psub$$inline_57_zf$$inline_51$$ = 0;
  $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ = 65536;
  for($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ = 0;256 > $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$;$JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$++) {
    for($flags$$inline_242_newval$$inline_61$$ = 0;256 > $flags$$inline_242_newval$$inline_61$$;$flags$$inline_242_newval$$inline_61$$++) {
      $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = $flags$$inline_242_newval$$inline_61$$ - $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$, this.$A$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = 0 != $flags$$inline_242_newval$$inline_61$$ ? 0 != ($flags$$inline_242_newval$$inline_61$$ & 128) ? 128 : 0 : 64, this.$A$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= $flags$$inline_242_newval$$inline_61$$ & 40, ($flags$$inline_242_newval$$inline_61$$ & 
      15) < ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ & 15) && (this.$A$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 16), $flags$$inline_242_newval$$inline_61$$ < $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ && (this.$A$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ ^ 128) & ($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ 
      $flags$$inline_242_newval$$inline_61$$) & 128) && (this.$A$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] |= 4), $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++, $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = $flags$$inline_242_newval$$inline_61$$ - $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ - 1, this.$A$[$c$$inline_65_padc$$inline_56_sf$$inline_50$$] = 0 != $flags$$inline_242_newval$$inline_61$$ ? 0 != ($flags$$inline_242_newval$$inline_61$$ & 
      128) ? 128 : 0 : 64, this.$A$[$c$$inline_65_padc$$inline_56_sf$$inline_50$$] |= $flags$$inline_242_newval$$inline_61$$ & 40, ($flags$$inline_242_newval$$inline_61$$ & 15) <= ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ & 15) && (this.$A$[$c$$inline_65_padc$$inline_56_sf$$inline_50$$] |= 16), $flags$$inline_242_newval$$inline_61$$ <= $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ && (this.$A$[$c$$inline_65_padc$$inline_56_sf$$inline_50$$] |= 1), 0 != (($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ 
      $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ ^ 128) & ($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ $flags$$inline_242_newval$$inline_61$$) & 128) && (this.$A$[$c$$inline_65_padc$$inline_56_sf$$inline_50$$] |= 4), $c$$inline_65_padc$$inline_56_sf$$inline_50$$++, $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ - $flags$$inline_242_newval$$inline_61$$, this.$z$[$h$$inline_66_psub$$inline_57_zf$$inline_51$$] = 
      0 != $flags$$inline_242_newval$$inline_61$$ ? 0 != ($flags$$inline_242_newval$$inline_61$$ & 128) ? 130 : 2 : 66, this.$z$[$h$$inline_66_psub$$inline_57_zf$$inline_51$$] |= $flags$$inline_242_newval$$inline_61$$ & 40, ($flags$$inline_242_newval$$inline_61$$ & 15) > ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ & 15) && (this.$z$[$h$$inline_66_psub$$inline_57_zf$$inline_51$$] |= 16), $flags$$inline_242_newval$$inline_61$$ > $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ && 
      (this.$z$[$h$$inline_66_psub$$inline_57_zf$$inline_51$$] |= 1), 0 != (($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$) & ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ ^ $flags$$inline_242_newval$$inline_61$$) & 128) && (this.$z$[$h$$inline_66_psub$$inline_57_zf$$inline_51$$] |= 4), $h$$inline_66_psub$$inline_57_zf$$inline_51$$++, $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ - 
      $flags$$inline_242_newval$$inline_61$$ - 1, this.$z$[$n$$inline_67_psbc$$inline_58_yf$$inline_52$$] = 0 != $flags$$inline_242_newval$$inline_61$$ ? 0 != ($flags$$inline_242_newval$$inline_61$$ & 128) ? 130 : 2 : 66, this.$z$[$n$$inline_67_psbc$$inline_58_yf$$inline_52$$] |= $flags$$inline_242_newval$$inline_61$$ & 40, ($flags$$inline_242_newval$$inline_61$$ & 15) >= ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ & 15) && (this.$z$[$n$$inline_67_psbc$$inline_58_yf$$inline_52$$] |= 
      16), $flags$$inline_242_newval$$inline_61$$ >= $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ && (this.$z$[$n$$inline_67_psbc$$inline_58_yf$$inline_52$$] |= 1), 0 != (($JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ ^ $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$) & ($JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ ^ $flags$$inline_242_newval$$inline_61$$) & 128) && (this.$z$[$n$$inline_67_psbc$$inline_58_yf$$inline_52$$] |= 4), $n$$inline_67_psbc$$inline_58_yf$$inline_52$$++
    }
  }
  for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 256;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$--;) {
    for($c$$inline_65_padc$$inline_56_sf$$inline_50$$ = 0;1 >= $c$$inline_65_padc$$inline_56_sf$$inline_50$$;$c$$inline_65_padc$$inline_56_sf$$inline_50$$++) {
      for($h$$inline_66_psub$$inline_57_zf$$inline_51$$ = 0;1 >= $h$$inline_66_psub$$inline_57_zf$$inline_51$$;$h$$inline_66_psub$$inline_57_zf$$inline_51$$++) {
        for($n$$inline_67_psbc$$inline_58_yf$$inline_52$$ = 0;1 >= $n$$inline_67_psbc$$inline_58_yf$$inline_52$$;$n$$inline_67_psbc$$inline_58_yf$$inline_52$$++) {
          $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$ = this.$W$;
          $JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$ = $c$$inline_65_padc$$inline_56_sf$$inline_50$$ << 8 | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ << 9 | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ << 10 | $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;
          $flags$$inline_242_newval$$inline_61$$ = $c$$inline_65_padc$$inline_56_sf$$inline_50$$ | $n$$inline_67_psbc$$inline_58_yf$$inline_52$$ << 1 | $h$$inline_66_psub$$inline_57_zf$$inline_51$$ << 4;
          this.$a$ = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;
          this.$b$ = $flags$$inline_242_newval$$inline_61$$;
          var $a_copy$$inline_243$$ = this.$a$, $correction$$inline_244$$ = 0, $carry$$inline_245$$ = $flags$$inline_242_newval$$inline_61$$ & 1, $carry_copy$$inline_246$$ = $carry$$inline_245$$;
          if(0 != ($flags$$inline_242_newval$$inline_61$$ & 16) || 9 < ($a_copy$$inline_243$$ & 15)) {
            $correction$$inline_244$$ |= 6
          }
          if(1 == $carry$$inline_245$$ || 159 < $a_copy$$inline_243$$ || 143 < $a_copy$$inline_243$$ && 9 < ($a_copy$$inline_243$$ & 15)) {
            $correction$$inline_244$$ |= 96, $carry_copy$$inline_246$$ = 1
          }
          153 < $a_copy$$inline_243$$ && ($carry_copy$$inline_246$$ = 1);
          0 != ($flags$$inline_242_newval$$inline_61$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_244$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_244$$);
          $flags$$inline_242_newval$$inline_61$$ = this.$b$ & 254 | $carry_copy$$inline_246$$;
          $flags$$inline_242_newval$$inline_61$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_242_newval$$inline_61$$ & 251 | 4 : $flags$$inline_242_newval$$inline_61$$ & 251;
          $JSCompiler_temp_const$$227_val$$inline_59_xf$$inline_53$$[$JSCompiler_temp_const$$226_oldval$$inline_60_pf$$inline_54$$] = this.$a$ | $flags$$inline_242_newval$$inline_61$$ << 8
        }
      }
    }
  }
  this.$a$ = this.$b$ = 0;
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;8192 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$, 0)
    }
  }else {
    for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;8192 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
      this.$memWriteMap$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = 0
    }
  }
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;32768 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
      this.$sram$.setUint8($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$, 0)
    }
  }else {
    for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;32768 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
      this.$sram$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = 0
    }
  }
  this.$K$ = 2;
  for($i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ = 0;4 > $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$;$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$++) {
    this.$frameReg$[$i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$] = $i$$inline_49_i$$inline_64_i$$inline_70_padd$$inline_55_sms$$ % 3
  }
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$c$ = this.$T$ = this.$b$ = this.$M$ = this.$s$ = this.$v$ = this.$q$ = this.$t$ = this.$j$ = this.$l$ = this.$U$ = this.$V$ = this.$d$ = this.$e$ = this.$R$ = this.$S$ = this.$i$ = this.$h$ = this.$P$ = this.$Q$ = this.$a$ = this.$O$ = 0;
  this.$n$ = 57328;
  this.$I$ = this.$o$ = 0;
  this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$J$ = 0;
  this.$H$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$c$ + 2), this.$c$ = this.$p$(this.$c$), this.$o$ -= 7) : this.$c$ += 2
}, $g$:$SUPPORT_DATAVIEW$$ ? function($address$$, $value$$73$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setInt8($address$$ & 8191, $value$$73$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$73$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$73$$ & this.$romPageMask$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$73$$ & this.$romPageMask$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$73$$ & this.$romPageMask$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$), $JSSMS$Utils$toHex$$($address$$ & 8191));
    debugger
  }
} : function($address$$1$$, $value$$74$$) {
  if(65535 >= $address$$1$$) {
    this.$memWriteMap$[$address$$1$$ & 8191] = $value$$74$$, 65532 == $address$$1$$ ? this.$frameReg$[3] = $value$$74$$ : 65533 == $address$$1$$ ? this.$frameReg$[0] = $value$$74$$ & this.$romPageMask$ : 65534 == $address$$1$$ ? this.$frameReg$[1] = $value$$74$$ & this.$romPageMask$ : 65535 == $address$$1$$ && (this.$frameReg$[2] = $value$$74$$ & this.$romPageMask$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$1$$), $JSSMS$Utils$toHex$$($address$$1$$ & 8191));
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
  console.error($JSSMS$Utils$toHex$$($address$$2$$));
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
  console.error($JSSMS$Utils$toHex$$($address$$3$$));
  debugger;
  return 0
}, $p$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
  if(1024 > $address$$4$$) {
    return this.$rom$[0].getUint16($address$$4$$, $JSCompiler_alias_TRUE$$)
  }
  if(16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0]].getUint16($address$$4$$, $JSCompiler_alias_TRUE$$)
  }
  if(32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1]].getUint16($address$$4$$ - 16384, $JSCompiler_alias_TRUE$$)
  }
  if(49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$4$$ - 32768, $JSCompiler_alias_TRUE$$)
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
  console.error($JSSMS$Utils$toHex$$($address$$5$$));
  debugger;
  return 0
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$f$($JSCompiler_StaticMethods_d_$self$$.$c$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$72$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$72$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$71$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$71$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$b$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$71$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$71$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$j$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$70$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$70$$ + ($JSCompiler_StaticMethods_adc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$b$ = ($hl$$ ^ $result$$1$$ ^ $value$$70$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$70$$ ^ $hl$$ ^ 32768) & ($value$$70$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$j$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$69$$) {
  var $result$$ = $reg$$ + $value$$69$$;
  $JSCompiler_StaticMethods_add16$self$$.$b$ = $JSCompiler_StaticMethods_add16$self$$.$b$ & 196 | ($reg$$ ^ $result$$ ^ $value$$69$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$b$ = $JSCompiler_StaticMethods_dec8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$F$[$value$$68$$];
  return $value$$68$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$67$$) {
  $value$$67$$ = $value$$67$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$b$ = $JSCompiler_StaticMethods_inc8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$G$[$value$$67$$];
  return $value$$67$$
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
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$66$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$v$ = $value$$66$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$s$ = $value$$66$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$65$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$t$ = $value$$65$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$q$ = $value$$65$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$j$ = $value$$64$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$64$$ & 255
}
function $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_getIY$self$$) {
  return $JSCompiler_StaticMethods_getIY$self$$.$v$ << 8 | $JSCompiler_StaticMethods_getIY$self$$.$s$
}
function $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_getIX$self$$) {
  return $JSCompiler_StaticMethods_getIX$self$$.$t$ << 8 | $JSCompiler_StaticMethods_getIX$self$$.$q$
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
  $JSCompiler_StaticMethods_cp_a$self$$.$b$ = $JSCompiler_StaticMethods_cp_a$self$$.$z$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$61$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$60$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$b$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$60$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$b$ = $JSCompiler_StaticMethods_sbc_a$self$$.$z$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$59$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$59$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$b$ = $JSCompiler_StaticMethods_sub_a$self$$.$z$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$58$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$b$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$58$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$b$ = $JSCompiler_StaticMethods_adc_a$self$$.$A$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$57$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$57$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$b$ = $JSCompiler_StaticMethods_add_a$self$$.$A$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45$$) {
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$f$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
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
      console.log("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$c$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$b$ = $JSCompiler_StaticMethods_bit$self$$.$b$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$L$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$55$$) {
  var $carry$$7$$ = $value$$55$$ & 1;
  $value$$55$$ = $value$$55$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$b$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$m$[$value$$55$$];
  return $value$$55$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$54$$) {
  var $carry$$6$$ = $value$$54$$ & 1;
  $value$$54$$ = $value$$54$$ >> 1 | $value$$54$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$b$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$m$[$value$$54$$];
  return $value$$54$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$53$$) {
  var $carry$$5$$ = ($value$$53$$ & 128) >> 7;
  $value$$53$$ = ($value$$53$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$b$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$m$[$value$$53$$];
  return $value$$53$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$52$$) {
  var $carry$$4$$ = ($value$$52$$ & 128) >> 7;
  $value$$52$$ = $value$$52$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$b$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$m$[$value$$52$$];
  return $value$$52$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$51$$) {
  var $carry$$3$$ = $value$$51$$ & 1;
  $value$$51$$ = ($value$$51$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$b$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$b$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$m$[$value$$51$$];
  return $value$$51$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$50$$) {
  var $carry$$2$$ = ($value$$50$$ & 128) >> 7;
  $value$$50$$ = ($value$$50$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$b$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$b$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$m$[$value$$50$$];
  return $value$$50$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$49$$) {
  var $carry$$1$$ = $value$$49$$ & 1;
  $value$$49$$ = ($value$$49$$ >> 1 | $value$$49$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$b$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$m$[$value$$49$$];
  return $value$$49$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$48$$) {
  var $carry$$ = ($value$$48$$ & 128) >> 7;
  $value$$48$$ = ($value$$48$$ << 1 | $value$$48$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$b$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$m$[$value$$48$$];
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
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$c$ = $JSCompiler_StaticMethods_ret$self$$.$p$($JSCompiler_StaticMethods_ret$self$$.$n$), $JSCompiler_StaticMethods_ret$self$$.$n$ += 2, $JSCompiler_StaticMethods_ret$self$$.$o$ -= 6)
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$c$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$o$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$c$++
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$c$ = $JSCompiler_StaticMethods_jp$self$$.$p$($JSCompiler_StaticMethods_jp$self$$.$c$) : $JSCompiler_StaticMethods_jp$self$$.$c$ += 2
}
function $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$) {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$lineno$ = 0;
  for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$cyclesPerLine$;;) {
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$a$.$updateDisassembly$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$c$);
    var $JSCompiler_StaticMethods_interpret$self$$inline_76$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$, $location$$inline_77$$ = 0, $temp$$inline_78$$ = 0, $opcode$$inline_79$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
    $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$o$ -= $OP_STATES$$[$opcode$$inline_79$$];
    switch($opcode$$inline_79$$) {
      case 1:
        var $JSCompiler_StaticMethods_setBC$self$$inline_413$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $value$$inline_414$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        $JSCompiler_StaticMethods_setBC$self$$inline_413$$.$i$ = $value$$inline_414$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_413$$.$h$ = $value$$inline_414$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++;
        break;
      case 2:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 3:
        var $JSCompiler_StaticMethods_incBC$self$$inline_248$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$;
        $JSCompiler_StaticMethods_incBC$self$$inline_248$$.$h$ = $JSCompiler_StaticMethods_incBC$self$$inline_248$$.$h$ + 1 & 255;
        0 == $JSCompiler_StaticMethods_incBC$self$$inline_248$$.$h$ && ($JSCompiler_StaticMethods_incBC$self$$inline_248$$.$i$ = $JSCompiler_StaticMethods_incBC$self$$inline_248$$.$i$ + 1 & 255);
        break;
      case 4:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 5:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 6:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 7:
        var $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $carry$$inline_251$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$.$a$ << 1 & 255 | $carry$$inline_251$$;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_250$$.$b$ & 236 | $carry$$inline_251$$;
        break;
      case 8:
        var $JSCompiler_StaticMethods_exAF$self$$inline_253$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $temp$$inline_254$$ = $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$a$;
        $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$O$;
        $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$O$ = $temp$$inline_254$$;
        $temp$$inline_254$$ = $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$b$;
        $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$T$;
        $JSCompiler_StaticMethods_exAF$self$$inline_253$$.$T$ = $temp$$inline_254$$;
        break;
      case 9:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 10:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 11:
        $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 12:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 13:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 14:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 15:
        var $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $carry$$inline_257$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$.$a$ & 1;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$.$a$ >> 1 | $carry$$inline_257$$ << 7;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_256$$.$b$ & 236 | $carry$$inline_257$$;
        break;
      case 16:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ - 1 & 255;
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 17:
        var $JSCompiler_StaticMethods_setDE$self$$inline_416$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $value$$inline_417$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        $JSCompiler_StaticMethods_setDE$self$$inline_416$$.$d$ = $value$$inline_417$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_416$$.$e$ = $value$$inline_417$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++;
        break;
      case 18:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 19:
        $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 20:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 21:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 22:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 23:
        var $JSCompiler_StaticMethods_rla_a$self$$inline_259$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $carry$$inline_260$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$b$ & 1) & 255;
        $JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$b$ = $JSCompiler_StaticMethods_rla_a$self$$inline_259$$.$b$ & 236 | $carry$$inline_260$$;
        break;
      case 24:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$) + 1);
        break;
      case 25:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 26:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 27:
        $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 28:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 29:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 30:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 31:
        var $JSCompiler_StaticMethods_rra_a$self$$inline_262$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $carry$$inline_263$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$a$ & 1;
        $JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$b$ & 1) << 7) & 255;
        $JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$b$ = $JSCompiler_StaticMethods_rra_a$self$$inline_262$$.$b$ & 236 | $carry$$inline_263$$;
        break;
      case 32:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 33:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++;
        break;
      case 34:
        $location$$inline_77$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($location$$inline_77$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$(++$location$$inline_77$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += 2;
        break;
      case 35:
        $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 36:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 37:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 38:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 39:
        var $JSCompiler_StaticMethods_daa$self$$inline_265$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $temp$$inline_266$$ = $JSCompiler_StaticMethods_daa$self$$inline_265$$.$W$[$JSCompiler_StaticMethods_daa$self$$inline_265$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_265$$.$b$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_265$$.$b$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_265$$.$b$ & 16) << 6];
        $JSCompiler_StaticMethods_daa$self$$inline_265$$.$a$ = $temp$$inline_266$$ & 255;
        $JSCompiler_StaticMethods_daa$self$$inline_265$$.$b$ = $JSCompiler_StaticMethods_daa$self$$inline_265$$.$b$ & 2 | $temp$$inline_266$$ >> 8;
        break;
      case 40:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 41:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 42:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$)));
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += 2;
        break;
      case 43:
        $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 44:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 45:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 46:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 47:
        var $JSCompiler_StaticMethods_cpl_a$self$$inline_268$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_268$$.$a$ ^= 255;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_268$$.$b$ |= 18;
        break;
      case 48:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 49:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += 2;
        break;
      case 50:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += 2;
        break;
      case 51:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$++;
        break;
      case 52:
        $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 53:
        $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 54:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 55:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ |= 1;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ &= -3;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ &= -17;
        break;
      case 56:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 57:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$));
        break;
      case 58:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$));
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ += 2;
        break;
      case 59:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$--;
        break;
      case 60:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 61:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 62:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        break;
      case 63:
        var $JSCompiler_StaticMethods_ccf$self$$inline_270$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$;
        0 != ($JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ &= -17);
        $JSCompiler_StaticMethods_ccf$self$$inline_270$$.$b$ &= -3;
        break;
      case 65:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 66:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 67:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 68:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 69:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 70:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 71:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 72:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 74:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 75:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 76:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 77:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 78:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 79:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 80:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 81:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 83:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 84:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 85:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 86:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 87:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 88:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 89:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 90:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 92:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 93:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 94:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 95:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 96:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 97:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 98:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 99:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 101:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 102:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 103:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 104:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 105:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 106:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 107:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 108:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 110:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 111:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$;
        break;
      case 112:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 113:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 114:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 115:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 116:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 117:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 118:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$o$ = 0;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$H$ = $JSCompiler_alias_TRUE$$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$--;
        break;
      case 119:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 120:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$;
        break;
      case 121:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$;
        break;
      case 122:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        break;
      case 123:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        break;
      case 124:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        break;
      case 125:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        break;
      case 126:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$));
        break;
      case 128:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 129:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 130:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 131:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 132:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 133:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 134:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 135:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 136:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 137:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 138:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 139:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 140:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 141:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 142:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 143:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 144:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 145:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 146:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 147:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 148:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 149:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 150:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 151:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 152:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 153:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 154:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 155:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 156:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 157:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 158:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 159:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 160:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$] | 16;
        break;
      case 161:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$] | 16;
        break;
      case 162:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$] | 16;
        break;
      case 163:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$] | 16;
        break;
      case 164:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$] | 16;
        break;
      case 165:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$] | 16;
        break;
      case 166:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$))] | 16;
        break;
      case 167:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$] | 16;
        break;
      case 168:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$];
        break;
      case 169:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$];
        break;
      case 170:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$];
        break;
      case 171:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$];
        break;
      case 172:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$];
        break;
      case 173:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$];
        break;
      case 174:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$))];
        break;
      case 175:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = 0];
        break;
      case 176:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$];
        break;
      case 177:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$];
        break;
      case 178:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$];
        break;
      case 179:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$];
        break;
      case 180:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$];
        break;
      case 181:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$];
        break;
      case 182:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$))];
        break;
      case 183:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$];
        break;
      case 184:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$);
        break;
      case 185:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 186:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$);
        break;
      case 187:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 188:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$);
        break;
      case 189:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 190:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$)));
        break;
      case 191:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 192:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 193:
        var $JSCompiler_StaticMethods_setBC$self$$inline_419$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $value$$inline_420$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$);
        $JSCompiler_StaticMethods_setBC$self$$inline_419$$.$i$ = $value$$inline_420$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_419$$.$h$ = $value$$inline_420$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ += 2;
        break;
      case 194:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 195:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        break;
      case 196:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 197:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$i$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$h$);
        break;
      case 198:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 199:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 0;
        break;
      case 200:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 201:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ += 2;
        break;
      case 202:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 203:
        var $JSCompiler_StaticMethods_doCB$self$$inline_272$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $opcode$$inline_273$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++);
        $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_273$$];
        switch($opcode$$inline_273$$) {
          case 0:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 1:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 2:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 3:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 4:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 5:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 6:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 7:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 8:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 9:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 10:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 11:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 12:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 13:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 14:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 15:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 16:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 17:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 18:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 19:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 20:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 21:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 22:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 23:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 24:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 25:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 26:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 27:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 28:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 29:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 30:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 31:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 32:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 33:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 34:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 35:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 36:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 39:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 40:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 41:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 42:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 43:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 44:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 47:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 48:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 49:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 50:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 51:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 52:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 53:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 54:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 55:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 56:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$);
            break;
          case 57:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$);
            break;
          case 58:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$);
            break;
          case 59:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$);
            break;
          case 60:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$);
            break;
          case 61:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$);
            break;
          case 62:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$))));
            break;
          case 63:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$);
            break;
          case 64:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 1);
            break;
          case 65:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 1);
            break;
          case 66:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 1);
            break;
          case 67:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 1);
            break;
          case 68:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 1);
            break;
          case 69:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 1);
            break;
          case 70:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 1);
            break;
          case 71:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 1);
            break;
          case 72:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 2);
            break;
          case 73:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 2);
            break;
          case 74:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 2);
            break;
          case 75:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 2);
            break;
          case 76:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 2);
            break;
          case 77:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 2);
            break;
          case 78:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 2);
            break;
          case 79:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 2);
            break;
          case 80:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 4);
            break;
          case 81:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 4);
            break;
          case 82:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 4);
            break;
          case 83:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 4);
            break;
          case 84:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 4);
            break;
          case 85:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 4);
            break;
          case 86:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 4);
            break;
          case 87:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 4);
            break;
          case 88:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 8);
            break;
          case 89:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 8);
            break;
          case 90:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 8);
            break;
          case 91:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 8);
            break;
          case 92:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 8);
            break;
          case 93:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 8);
            break;
          case 94:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 8);
            break;
          case 95:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 8);
            break;
          case 96:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 16);
            break;
          case 97:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 16);
            break;
          case 98:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 16);
            break;
          case 99:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 16);
            break;
          case 100:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 16);
            break;
          case 101:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 16);
            break;
          case 102:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 16);
            break;
          case 103:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 16);
            break;
          case 104:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 32);
            break;
          case 105:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 32);
            break;
          case 106:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 32);
            break;
          case 107:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 32);
            break;
          case 108:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 32);
            break;
          case 109:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 32);
            break;
          case 110:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 32);
            break;
          case 111:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 32);
            break;
          case 112:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 64);
            break;
          case 113:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 64);
            break;
          case 114:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 64);
            break;
          case 115:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 64);
            break;
          case 116:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 64);
            break;
          case 117:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 64);
            break;
          case 118:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 64);
            break;
          case 119:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 64);
            break;
          case 120:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ & 128);
            break;
          case 121:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ & 128);
            break;
          case 122:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ & 128);
            break;
          case 123:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ & 128);
            break;
          case 124:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ & 128);
            break;
          case 125:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ & 128);
            break;
          case 126:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & 128);
            break;
          case 127:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$, $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ & 128);
            break;
          case 128:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -2;
            break;
          case 129:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -2;
            break;
          case 130:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -2;
            break;
          case 131:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -2;
            break;
          case 132:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -2;
            break;
          case 133:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -2;
            break;
          case 134:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -2);
            break;
          case 135:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -2;
            break;
          case 136:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -3;
            break;
          case 137:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -3;
            break;
          case 138:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -3;
            break;
          case 139:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -3;
            break;
          case 140:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -3;
            break;
          case 141:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -3;
            break;
          case 142:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -3);
            break;
          case 143:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -3;
            break;
          case 144:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -5;
            break;
          case 145:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -5;
            break;
          case 146:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -5;
            break;
          case 147:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -5;
            break;
          case 148:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -5;
            break;
          case 149:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -5;
            break;
          case 150:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -5);
            break;
          case 151:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -5;
            break;
          case 152:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -9;
            break;
          case 153:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -9;
            break;
          case 154:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -9;
            break;
          case 155:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -9;
            break;
          case 156:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -9;
            break;
          case 157:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -9;
            break;
          case 158:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -9);
            break;
          case 159:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -9;
            break;
          case 160:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -17;
            break;
          case 161:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -17;
            break;
          case 162:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -17;
            break;
          case 163:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -17;
            break;
          case 164:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -17;
            break;
          case 165:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -17;
            break;
          case 166:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -17);
            break;
          case 167:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -17;
            break;
          case 168:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -33;
            break;
          case 169:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -33;
            break;
          case 170:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -33;
            break;
          case 171:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -33;
            break;
          case 172:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -33;
            break;
          case 173:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -33;
            break;
          case 174:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -33);
            break;
          case 175:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -33;
            break;
          case 176:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -65;
            break;
          case 177:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -65;
            break;
          case 178:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -65;
            break;
          case 179:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -65;
            break;
          case 180:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -65;
            break;
          case 181:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -65;
            break;
          case 182:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -65);
            break;
          case 183:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -65;
            break;
          case 184:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ &= -129;
            break;
          case 185:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ &= -129;
            break;
          case 186:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ &= -129;
            break;
          case 187:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ &= -129;
            break;
          case 188:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ &= -129;
            break;
          case 189:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ &= -129;
            break;
          case 190:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) & -129);
            break;
          case 191:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ &= -129;
            break;
          case 192:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 1;
            break;
          case 193:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 1;
            break;
          case 194:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 1;
            break;
          case 195:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 1;
            break;
          case 196:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 1;
            break;
          case 197:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 1;
            break;
          case 198:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 1);
            break;
          case 199:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 1;
            break;
          case 200:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 2;
            break;
          case 201:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 2;
            break;
          case 203:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 2;
            break;
          case 204:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 2;
            break;
          case 205:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 2;
            break;
          case 206:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 2);
            break;
          case 207:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 2;
            break;
          case 208:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 4;
            break;
          case 209:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 4;
            break;
          case 210:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 4;
            break;
          case 211:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 4;
            break;
          case 212:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 4;
            break;
          case 213:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 4;
            break;
          case 214:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 4);
            break;
          case 215:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 4;
            break;
          case 216:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 8;
            break;
          case 217:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 8;
            break;
          case 218:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 8;
            break;
          case 219:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 8;
            break;
          case 220:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 8;
            break;
          case 221:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 8;
            break;
          case 222:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 8);
            break;
          case 223:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 8;
            break;
          case 224:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 16;
            break;
          case 225:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 16;
            break;
          case 226:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 16;
            break;
          case 227:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 16;
            break;
          case 228:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 16;
            break;
          case 229:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 16;
            break;
          case 230:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 16);
            break;
          case 231:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 16;
            break;
          case 232:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 32;
            break;
          case 233:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 32;
            break;
          case 234:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 32;
            break;
          case 235:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 32;
            break;
          case 236:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 32;
            break;
          case 237:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 32;
            break;
          case 238:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 32);
            break;
          case 239:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 32;
            break;
          case 240:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 64;
            break;
          case 241:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 64;
            break;
          case 242:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 64;
            break;
          case 243:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 64;
            break;
          case 244:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 64;
            break;
          case 245:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 64;
            break;
          case 246:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 64);
            break;
          case 247:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 64;
            break;
          case 248:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$i$ |= 128;
            break;
          case 249:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$h$ |= 128;
            break;
          case 250:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$d$ |= 128;
            break;
          case 251:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$e$ |= 128;
            break;
          case 252:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$j$ |= 128;
            break;
          case 253:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$l$ |= 128;
            break;
          case 254:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$), $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_272$$)) | 128);
            break;
          case 255:
            $JSCompiler_StaticMethods_doCB$self$$inline_272$$.$a$ |= 128;
            break;
          default:
            console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_273$$))
        }
        break;
      case 204:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 64));
        break;
      case 205:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ + 2);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        break;
      case 206:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 207:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 8;
        break;
      case 208:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 209:
        var $JSCompiler_StaticMethods_setDE$self$$inline_422$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $value$$inline_423$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$);
        $JSCompiler_StaticMethods_setDE$self$$inline_422$$.$d$ = $value$$inline_423$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_422$$.$e$ = $value$$inline_423$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ += 2;
        break;
      case 210:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 211:
        $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$w$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$);
        break;
      case 212:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 213:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$);
        break;
      case 214:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 215:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 16;
        break;
      case 216:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 217:
        var $JSCompiler_StaticMethods_exBC$self$$inline_275$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $temp$$inline_276$$ = $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$i$;
        $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$i$ = $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$P$;
        $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$P$ = $temp$$inline_276$$;
        $temp$$inline_276$$ = $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$h$;
        $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$h$ = $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$Q$;
        $JSCompiler_StaticMethods_exBC$self$$inline_275$$.$Q$ = $temp$$inline_276$$;
        var $JSCompiler_StaticMethods_exDE$self$$inline_278$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $temp$$inline_279$$ = $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$d$;
        $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$R$;
        $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$R$ = $temp$$inline_279$$;
        $temp$$inline_279$$ = $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$e$;
        $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$S$;
        $JSCompiler_StaticMethods_exDE$self$$inline_278$$.$S$ = $temp$$inline_279$$;
        var $JSCompiler_StaticMethods_exHL$self$$inline_281$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $temp$$inline_282$$ = $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$j$;
        $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$j$ = $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$U$;
        $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$U$ = $temp$$inline_282$$;
        $temp$$inline_282$$ = $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$l$;
        $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$V$;
        $JSCompiler_StaticMethods_exHL$self$$inline_281$$.$V$ = $temp$$inline_282$$;
        break;
      case 218:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 219:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$w$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 220:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 1));
        break;
      case 221:
        var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $opcode$$inline_285$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++), $location$$inline_286$$ = 0, $temp$$inline_287$$ = 0;
        $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_285$$];
        switch($opcode$$inline_285$$) {
          case 9:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$ += 2;
            break;
          case 34:
            $location$$inline_286$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($location$$inline_286$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($location$$inline_286$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIX$self$$inline_425$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$;
            $JSCompiler_StaticMethods_incIX$self$$inline_425$$.$q$ = $JSCompiler_StaticMethods_incIX$self$$inline_425$$.$q$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIX$self$$inline_425$$.$q$ && ($JSCompiler_StaticMethods_incIX$self$$inline_425$$.$t$ = $JSCompiler_StaticMethods_incIX$self$$inline_425$$.$t$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            break;
          case 42:
            $location$$inline_286$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($location$$inline_286$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$(++$location$$inline_286$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIX$self$$inline_427$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$;
            $JSCompiler_StaticMethods_decIX$self$$inline_427$$.$q$ = $JSCompiler_StaticMethods_decIX$self$$inline_427$$.$q$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIX$self$$inline_427$$.$q$ && ($JSCompiler_StaticMethods_decIX$self$$inline_427$$.$t$ = $JSCompiler_StaticMethods_decIX$self$$inline_427$$.$t$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$i$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_287$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$);
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$, $temp$$inline_287$$ & 255);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$ + 1, $temp$$inline_287$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$t$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$q$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$n$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$);
            break;
          default:
            console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_285$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_284$$.$c$--
        }
        break;
      case 222:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 223:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 24;
        break;
      case 224:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 225:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$));
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ += 2;
        break;
      case 226:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 227:
        $temp$$inline_78$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ + 1);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ + 1, $temp$$inline_78$$);
        $temp$$inline_78$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$, $temp$$inline_78$$);
        break;
      case 228:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 229:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$);
        break;
      case 230:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++)] | 16;
        break;
      case 231:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 32;
        break;
      case 232:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 233:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 234:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 235:
        $temp$$inline_78$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$j$ = $temp$$inline_78$$;
        $temp$$inline_78$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$;
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$l$ = $temp$$inline_78$$;
        break;
      case 236:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 4));
        break;
      case 237:
        var $JSCompiler_StaticMethods_doED$self$$inline_289$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $opcode$$inline_290$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$), $temp$$inline_291$$ = 0, $location$$inline_292$$ = 0;
        $JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_290$$];
        switch($opcode$$inline_290$$) {
          case 64:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 65:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 66:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 67:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$++, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
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
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = 0;
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
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
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$ += 2;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$B$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$C$;
            break;
          case 70:
          ;
          case 78:
          ;
          case 102:
          ;
          case 110:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$I$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 71:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$M$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 72:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 73:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 74:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 75:
            var $JSCompiler_StaticMethods_setBC$self$$inline_429$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$, $value$$inline_430$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1));
            $JSCompiler_StaticMethods_setBC$self$$inline_429$$.$i$ = $value$$inline_430$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_429$$.$h$ = $value$$inline_430$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 79:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 80:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$d$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 81:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 82:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 83:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$++, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 86:
          ;
          case 118:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$I$ = 1;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 87:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$M$;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$N$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$C$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 88:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$e$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 89:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 90:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 91:
            var $JSCompiler_StaticMethods_setDE$self$$inline_432$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$, $value$$inline_433$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1));
            $JSCompiler_StaticMethods_setDE$self$$inline_432$$.$d$ = $value$$inline_433$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_432$$.$e$ = $value$$inline_433$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 95:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = Math.round(255 * Math.random());
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$N$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$C$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$j$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 97:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$j$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 98:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 99:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$++, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$j$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 103:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($location$$inline_292$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, $temp$$inline_291$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ & 15) << 4);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ & 240 | $temp$$inline_291$$ & 15;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 104:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 105:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 106:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 107:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1)));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 111:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($location$$inline_292$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, ($temp$$inline_291$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ & 15);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ & 240 | $temp$$inline_291$$ >> 4;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, 0);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 115:
            $location$$inline_292$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$++, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$ & 255);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($location$$inline_292$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$ >> 8);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 120:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_289$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 121:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$a$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 122:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 123:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ + 1));
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$ += 3;
            break;
          case 160:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 161:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 248 | $temp$$inline_291$$;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 162:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 128 == ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 163:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $temp$$inline_291$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$ + $temp$$inline_291$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 128 == ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 168:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 169:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 248 | $temp$$inline_291$$;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 170:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 0 != ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 171:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $temp$$inline_291$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$ + $temp$$inline_291$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 128 == ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            break;
          case 176:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17;
            break;
          case 177:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 0 : 4;
            0 != ($temp$$inline_291$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 248 | $temp$$inline_291$$;
            break;
          case 178:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 128 == ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            break;
          case 179:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$ + $temp$$inline_291$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 0 != ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            break;
          case 184:
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -3;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17;
            break;
          case 185:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$)));
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            $temp$$inline_291$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_289$$) ? 0 : 4;
            0 != ($temp$$inline_291$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & 248 | $temp$$inline_291$$;
            break;
          case 186:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$), $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 0 != ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            break;
          case 187:
            $temp$$inline_291$$ = $JSCompiler_StaticMethods_doED$self$$inline_289$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_289$$.$w$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$h$, $temp$$inline_291$$);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_289$$, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_289$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_289$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_289$$.$l$ + $temp$$inline_291$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ = 0 != ($temp$$inline_291$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_289$$.$b$ & -3;
            break;
          default:
            console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_290$$)), $JSCompiler_StaticMethods_doED$self$$inline_289$$.$c$++
        }
        break;
      case 238:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++)];
        break;
      case 239:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 40;
        break;
      case 240:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 241:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$++);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$++);
        break;
      case 242:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 243:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$B$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$C$ = $JSCompiler_alias_FALSE$$;
        break;
      case 244:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 245:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$);
        break;
      case 246:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_76$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++)];
        break;
      case 247:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$);
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 48;
        break;
      case 248:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 249:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$);
        break;
      case 250:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 251:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$B$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$C$ = $JSCompiler_alias_TRUE$$;
        break;
      case 252:
        $JSCompiler_StaticMethods_interpret$self$$inline_76$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$b$ & 128));
        break;
      case 253:
        var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$, $opcode$$inline_295$$ = $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++), $location$$inline_296$$ = $JSCompiler_alias_VOID$$, $temp$$inline_297$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_295$$];
        switch($opcode$$inline_295$$) {
          case 9:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$ += 2;
            break;
          case 34:
            $location$$inline_296$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($location$$inline_296$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($location$$inline_296$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIY$self$$inline_435$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$;
            $JSCompiler_StaticMethods_incIY$self$$inline_435$$.$s$ = $JSCompiler_StaticMethods_incIY$self$$inline_435$$.$s$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIY$self$$inline_435$$.$s$ && ($JSCompiler_StaticMethods_incIY$self$$inline_435$$.$v$ = $JSCompiler_StaticMethods_incIY$self$$inline_435$$.$v$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            break;
          case 42:
            $location$$inline_296$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($location$$inline_296$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$(++$location$$inline_296$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIY$self$$inline_437$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$;
            $JSCompiler_StaticMethods_decIY$self$$inline_437$$.$s$ = $JSCompiler_StaticMethods_decIY$self$$inline_437$$.$s$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIY$self$$inline_437$$.$s$ && ($JSCompiler_StaticMethods_decIY$self$$inline_437$$.$v$ = $JSCompiler_StaticMethods_decIY$self$$inline_437$$.$v$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$i$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_297$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$);
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$, $temp$$inline_297$$ & 255);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$ + 1, $temp$$inline_297$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$v$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$s$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$n$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$);
            break;
          default:
            console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_295$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_294$$.$c$--
        }
        break;
      case 254:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$++));
        break;
      case 255:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_76$$, $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_76$$.$c$ = 56
    }
    var $JSCompiler_temp$$1$$;
    if($JSCompiler_temp$$1$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$) {
      var $JSCompiler_StaticMethods_eol$self$$inline_81$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      if($JSCompiler_StaticMethods_eol$self$$inline_81$$.$main$.$soundEnabled$) {
        var $JSCompiler_StaticMethods_updateSound$self$$inline_299$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$main$, $line$$inline_300$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$;
        0 == $line$$inline_300$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_301$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$samplesPerLine$[$line$$inline_300$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$b$, $offset$$inline_303$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$audioBufferOffset$, $buffer$$inline_304$$ = [], $sample$$inline_305$$ = 0, $i$$inline_306$$ = 0;$sample$$inline_305$$ < $samplesToGenerate$$inline_301$$;$sample$$inline_305$$++) {
          for($i$$inline_306$$ = 0;3 > $i$$inline_306$$;$i$$inline_306$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[$i$$inline_306$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$i$[$i$$inline_306$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$b$[($i$$inline_306$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$i$[$i$$inline_306$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$b$[($i$$inline_306$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[$i$$inline_306$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ & 1) << 1;
          var $output$$inline_307$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$m$[3];
          127 < $output$$inline_307$$ ? $output$$inline_307$$ = 127 : -128 > $output$$inline_307$$ && ($output$$inline_307$$ = -128);
          $buffer$$inline_304$$[$offset$$inline_303$$ + $sample$$inline_305$$] = $output$$inline_307$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$g$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$n$;
          var $clockCycles$$inline_308$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$g$ >> 8, $clockCyclesScaled$$inline_309$$ = $clockCycles$$inline_308$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$g$ -= $clockCyclesScaled$$inline_309$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[0] -= $clockCycles$$inline_308$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[1] -= $clockCycles$$inline_308$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[2] -= $clockCycles$$inline_308$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$j$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[3] - $clockCycles$$inline_308$$;
          for($i$$inline_306$$ = 0;3 > $i$$inline_306$$;$i$$inline_306$$++) {
            var $counter$$inline_310$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[$i$$inline_306$$];
            if(0 >= $counter$$inline_310$$) {
              var $tone$$inline_311$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$b$[$i$$inline_306$$ << 1];
              6 < $tone$$inline_311$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$i$[$i$$inline_306$$] = ($clockCyclesScaled$$inline_309$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$g$ + 512 * $counter$$inline_310$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[$i$$inline_306$$] / ($clockCyclesScaled$$inline_309$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$g$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[$i$$inline_306$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[$i$$inline_306$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[$i$$inline_306$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$i$[$i$$inline_306$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[$i$$inline_306$$] += $tone$$inline_311$$ * ($clockCycles$$inline_308$$ / $tone$$inline_311$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$i$[$i$$inline_306$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$j$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$j$ * 
          ($clockCycles$$inline_308$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$j$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$f$[3])) {
            var $feedback$$inline_312$$ = 0, $feedback$$inline_312$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_302$$.$h$ >> 1 | $feedback$$inline_312$$ << 15
          }
        }
        $JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$audioBuffer$ = $buffer$$inline_304$$;
        $JSCompiler_StaticMethods_updateSound$self$$inline_299$$.$audioBufferOffset$ += $samplesToGenerate$$inline_301$$
      }
      $JSCompiler_StaticMethods_eol$self$$inline_81$$.$vdp$.$p$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$;
      if(192 > $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$) {
        var $JSCompiler_StaticMethods_drawLine$self$$inline_314$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$vdp$, $lineno$$inline_315$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$, $i$$inline_316$$ = 0, $temp$$inline_317$$ = 0, $temp2$$inline_318$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$main$.$is_gg$ || !(24 > $lineno$$inline_315$$ || 168 <= $lineno$$inline_315$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$m$) {
              console.log("[" + $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$p$ + "] min dirty:" + $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$q$ + " max: " + $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$m$);
              for(var $i$$inline_319$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$q$;$i$$inline_319$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$m$;$i$$inline_319$$++) {
                if($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$w$[$i$$inline_319$$]) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$w$[$i$$inline_319$$] = $JSCompiler_alias_FALSE$$;
                  console.log("tile " + $i$$inline_319$$ + " is dirty");
                  for(var $tile$$inline_320$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$B$[$i$$inline_319$$], $pixel_index$$inline_321$$ = 0, $address$$inline_322$$ = $i$$inline_319$$ << 5, $y$$inline_323$$ = 0;8 > $y$$inline_323$$;$y$$inline_323$$++) {
                    for(var $address0$$inline_324$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_322$$++], $address1$$inline_325$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_322$$++], $address2$$inline_326$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_322$$++], $address3$$inline_327$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_322$$++], $bit$$inline_328$$ = 128;0 != 
                    $bit$$inline_328$$;$bit$$inline_328$$ >>= 1) {
                      var $colour$$inline_329$$ = 0;
                      0 != ($address0$$inline_324$$ & $bit$$inline_328$$) && ($colour$$inline_329$$ |= 1);
                      0 != ($address1$$inline_325$$ & $bit$$inline_328$$) && ($colour$$inline_329$$ |= 2);
                      0 != ($address2$$inline_326$$ & $bit$$inline_328$$) && ($colour$$inline_329$$ |= 4);
                      0 != ($address3$$inline_327$$ & $bit$$inline_328$$) && ($colour$$inline_329$$ |= 8);
                      $tile$$inline_320$$[$pixel_index$$inline_321$$++] = $colour$$inline_329$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$q$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$m$ = -1
            }
            var $pixX$$inline_330$$ = 0, $colour$$inline_331$$ = 0, $temp$$inline_332$$ = 0, $temp2$$inline_333$$ = 0, $hscroll$$inline_334$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[8], $vscroll$$inline_335$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[9];
            16 > $lineno$$inline_315$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[0] & 64) && ($hscroll$$inline_334$$ = 0);
            var $lock$$inline_336$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[0] & 128, $tile_column$$inline_337$$ = 32 - ($hscroll$$inline_334$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$A$, $tile_row$$inline_338$$ = $lineno$$inline_315$$ + $vscroll$$inline_335$$ >> 3;
            27 < $tile_row$$inline_338$$ && ($tile_row$$inline_338$$ -= 28);
            for(var $tile_y$$inline_339$$ = ($lineno$$inline_315$$ + ($vscroll$$inline_335$$ & 7) & 7) << 3, $row_precal$$inline_340$$ = $lineno$$inline_315$$ << 8, $tx$$inline_341$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$A$;$tx$$inline_341$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$D$;$tx$$inline_341$$++) {
              var $tile_props$$inline_342$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$C$ + (($tile_column$$inline_337$$ & 31) << 1) + ($tile_row$$inline_338$$ << 6), $secondbyte$$inline_343$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$tile_props$$inline_342$$ + 1], $pal$$inline_344$$ = ($secondbyte$$inline_343$$ & 8) << 1, $sx$$inline_345$$ = ($tx$$inline_341$$ << 3) + ($hscroll$$inline_334$$ & 7), $pixY$$inline_346$$ = 0 == ($secondbyte$$inline_343$$ & 4) ? $tile_y$$inline_339$$ : 
              56 - $tile_y$$inline_339$$, $tile$$inline_347$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$B$[($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$tile_props$$inline_342$$] & 255) + (($secondbyte$$inline_343$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_343$$ & 2)) {
                for($pixX$$inline_330$$ = 0;8 > $pixX$$inline_330$$ && 256 > $sx$$inline_345$$;$pixX$$inline_330$$++, $sx$$inline_345$$++) {
                  $colour$$inline_331$$ = $tile$$inline_347$$[$pixX$$inline_330$$ + $pixY$$inline_346$$], $temp$$inline_332$$ = 4 * ($sx$$inline_345$$ + $row_precal$$inline_340$$), $temp2$$inline_333$$ = 3 * ($colour$$inline_331$$ + $pal$$inline_344$$), $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$t$[$sx$$inline_345$$] = 0 != ($secondbyte$$inline_343$$ & 16) && 0 != $colour$$inline_331$$, $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$ + 2]
                }
              }else {
                for($pixX$$inline_330$$ = 7;0 <= $pixX$$inline_330$$ && 256 > $sx$$inline_345$$;$pixX$$inline_330$$--, $sx$$inline_345$$++) {
                  $colour$$inline_331$$ = $tile$$inline_347$$[$pixX$$inline_330$$ + $pixY$$inline_346$$], $temp$$inline_332$$ = 4 * ($sx$$inline_345$$ + $row_precal$$inline_340$$), $temp2$$inline_333$$ = 3 * ($colour$$inline_331$$ + $pal$$inline_344$$), $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$t$[$sx$$inline_345$$] = 0 != ($secondbyte$$inline_343$$ & 16) && 0 != $colour$$inline_331$$, $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_332$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_333$$ + 2]
                }
              }
              $tile_column$$inline_337$$++;
              0 != $lock$$inline_336$$ && 23 == $tx$$inline_341$$ && ($tile_row$$inline_338$$ = $lineno$$inline_315$$ >> 3, $tile_y$$inline_339$$ = ($lineno$$inline_315$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$j$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$j$ = $JSCompiler_alias_FALSE$$;
              for(var $i$$inline_348$$ = 0;$i$$inline_348$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$s$.length;$i$$inline_348$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$s$[$i$$inline_348$$][0] = 0
              }
              var $height$$inline_349$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[1] & 1) && ($height$$inline_349$$ <<= 1);
              for(var $spriteno$$inline_350$$ = 0;64 > $spriteno$$inline_350$$;$spriteno$$inline_350$$++) {
                var $y$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$i$ + $spriteno$$inline_350$$] & 255;
                if(208 == $y$$inline_351$$) {
                  break
                }
                $y$$inline_351$$++;
                240 < $y$$inline_351$$ && ($y$$inline_351$$ -= 256);
                for(var $lineno$$inline_352$$ = $y$$inline_351$$;192 > $lineno$$inline_352$$;$lineno$$inline_352$$++) {
                  if($lineno$$inline_352$$ - $y$$inline_351$$ < $height$$inline_349$$) {
                    var $sprites$$inline_353$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$s$[$lineno$$inline_352$$];
                    if(!$sprites$$inline_353$$ || 8 <= $sprites$$inline_353$$[0]) {
                      break
                    }
                    var $off$$inline_354$$ = 3 * $sprites$$inline_353$$[0] + 1, $address$$inline_355$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$i$ + ($spriteno$$inline_350$$ << 1) + 128;
                    $sprites$$inline_353$$[$off$$inline_354$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_355$$++] & 255;
                    $sprites$$inline_353$$[$off$$inline_354$$++] = $y$$inline_351$$;
                    $sprites$$inline_353$$[$off$$inline_354$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$f$[$address$$inline_355$$] & 255;
                    $sprites$$inline_353$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$s$[$lineno$$inline_315$$][0]) {
              for(var $colour$$inline_356$$ = 0, $temp$$inline_357$$ = 0, $temp2$$inline_358$$ = 0, $i$$inline_359$$ = 0, $sprites$$inline_360$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$s$[$lineno$$inline_315$$], $count$$inline_361$$ = Math.min(8, $sprites$$inline_360$$[0]), $zoomed$$inline_362$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[1] & 1, $row_precal$$inline_363$$ = $lineno$$inline_315$$ << 8, $off$$inline_364$$ = 3 * $count$$inline_361$$;$i$$inline_359$$ < 
              $count$$inline_361$$;$i$$inline_359$$++) {
                var $n$$inline_365$$ = $sprites$$inline_360$$[$off$$inline_364$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[6] & 4) << 6, $y$$inline_366$$ = $sprites$$inline_360$$[$off$$inline_364$$--], $x$$inline_367$$ = $sprites$$inline_360$$[$off$$inline_364$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[0] & 8), $tileRow$$inline_368$$ = $lineno$$inline_315$$ - $y$$inline_366$$ >> $zoomed$$inline_362$$;
                0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[1] & 2) && ($n$$inline_365$$ &= -2);
                var $tile$$inline_369$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$B$[$n$$inline_365$$ + (($tileRow$$inline_368$$ & 8) >> 3)], $pix$$inline_370$$ = 0;
                0 > $x$$inline_367$$ && ($pix$$inline_370$$ = -$x$$inline_367$$, $x$$inline_367$$ = 0);
                var $offset$$inline_371$$ = $pix$$inline_370$$ + (($tileRow$$inline_368$$ & 7) << 3);
                if(0 == $zoomed$$inline_362$$) {
                  for(;8 > $pix$$inline_370$$ && 256 > $x$$inline_367$$;$pix$$inline_370$$++, $x$$inline_367$$++) {
                    $colour$$inline_356$$ = $tile$$inline_369$$[$offset$$inline_371$$++], 0 != $colour$$inline_356$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$t$[$x$$inline_367$$] && ($temp$$inline_357$$ = 4 * ($x$$inline_367$$ + $row_precal$$inline_363$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_370$$ && 256 > $x$$inline_367$$;$pix$$inline_370$$++, $x$$inline_367$$ += 2) {
                    $colour$$inline_356$$ = $tile$$inline_369$$[$offset$$inline_371$$++], 0 != $colour$$inline_356$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$t$[$x$$inline_367$$] && ($temp$$inline_357$$ = 4 * ($x$$inline_367$$ + $row_precal$$inline_363$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 2]), 0 != $colour$$inline_356$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$t$[$x$$inline_367$$ + 1] && ($temp$$inline_357$$ = 4 * ($x$$inline_367$$ + $row_precal$$inline_363$$ + 1), $temp2$$inline_358$$ = 3 * 
                    ($colour$$inline_356$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_358$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_360$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$g$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[0] & 32)) {
              $temp$$inline_317$$ = 4 * ($lineno$$inline_315$$ << 8);
              $temp2$$inline_318$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[7] & 15) + 16);
              for($i$$inline_316$$ = 0;8 > $i$$inline_316$$;$i$$inline_316$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_317$$ + $i$$inline_316$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_318$$], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_317$$ + $i$$inline_316$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_318$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$temp$$inline_317$$ + $i$$inline_316$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp2$$inline_318$$ + 
                2]
              }
            }
          }else {
            for(var $row_precal$$inline_372$$ = $lineno$$inline_315$$ << 8, $length$$inline_373$$ = 4 * ($row_precal$$inline_372$$ + 1024), $temp$$inline_374$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$c$[7] & 15) + 16), $row_precal$$inline_372$$ = 4 * $row_precal$$inline_372$$;$row_precal$$inline_372$$ < $length$$inline_373$$;$row_precal$$inline_372$$ += 4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$row_precal$$inline_372$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp$$inline_374$$], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$row_precal$$inline_372$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp$$inline_374$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$b$[$row_precal$$inline_372$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_314$$.$a$[$temp$$inline_374$$ + 
              2]
            }
          }
        }
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_376$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$vdp$, $lineno$$inline_377$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$;
      192 >= $lineno$$inline_377$$ ? (192 == $lineno$$inline_377$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$g$ |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$v$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$g$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$v$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$g$ & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$c$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$main$.$cpu$.$D$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$g$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$c$[1] & 32) && 224 > $lineno$$inline_377$$) && 
      ($JSCompiler_StaticMethods_interrupts$self$$inline_376$$.$main$.$cpu$.$D$ = $JSCompiler_alias_TRUE$$));
      if($JSCompiler_StaticMethods_eol$self$$inline_81$$.$D$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_379$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$B$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$H$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$c$++, $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$H$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$B$ = $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$C$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$D$ = $JSCompiler_alias_FALSE$$, 
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_379$$, $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$c$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$I$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$c$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$J$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$J$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$J$, $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$o$ -= 
        13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$I$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$c$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$c$ = $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$p$(($JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$M$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$J$), $JSCompiler_StaticMethods_interrupt$self$$inline_379$$.$o$ -= 
        19))
      }
      $JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$++;
      if($JSCompiler_StaticMethods_eol$self$$inline_81$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_81$$.$main$.$no_of_scanlines$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_381$$ = $JSCompiler_StaticMethods_eol$self$$inline_81$$;
        $JSCompiler_StaticMethods_eof$self$$inline_381$$.$main$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_381$$.$C$ = $JSCompiler_StaticMethods_eof$self$$inline_381$$.$B$, $JSCompiler_StaticMethods_eof$self$$inline_381$$.$B$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_eof$self$$inline_381$$.$H$ && ($JSCompiler_StaticMethods_eof$self$$inline_381$$.$c$++, $JSCompiler_StaticMethods_eof$self$$inline_381$$.$H$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_eof$self$$inline_381$$, 
        $JSCompiler_StaticMethods_eof$self$$inline_381$$.$c$), $JSCompiler_StaticMethods_eof$self$$inline_381$$.$c$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_381$$.$o$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_381$$.$main$.$pause_button$ = $JSCompiler_alias_FALSE$$);
        $JSCompiler_StaticMethods_eof$self$$inline_381$$.$main$.$a$.$writeFrame$();
        $JSCompiler_temp$$1$$ = $JSCompiler_alias_TRUE$$
      }else {
        $JSCompiler_StaticMethods_eol$self$$inline_81$$.$o$ += $JSCompiler_StaticMethods_eol$self$$inline_81$$.$main$.$cyclesPerLine$, $JSCompiler_temp$$1$$ = $JSCompiler_alias_FALSE$$
      }
    }
    if($JSCompiler_temp$$1$$) {
      break
    }
  }
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$instructions$:[]};
function $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_peepholePortIn$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_peepholePortIn$self$$.$main$.$is_gg$ && 7 > $port$$1$$) {
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
  if($JSCompiler_StaticMethods_peepholePortOut$self$$.$main$.$is_gg$ && 7 > $port$$) {
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
      if($JSCompiler_StaticMethods_peepholePortOut$self$$.$main$.$soundEnabled$) {
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
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self$$, $index$$46$$, $address$$9_address$$inline_85$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_86$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_85$$, $code$$8_code$$inline_90_offset$$16$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcodesArray$$inline_87_operand$$2$$ = "";
  $address$$9_address$$inline_85$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$46$$ + ",BC";
      $code$$8_code$$inline_90_offset$$16$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$46$$ + ",DE";
      $code$$8_code$$inline_90_offset$$16$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.set" + $index$$46$$ + "(" + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 34:
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $inst$$3_opcode$$inline_86$$ = "LD (" + $opcodesArray$$inline_87_operand$$2$$ + ")," + $index$$46$$;
      $code$$8_code$$inline_90_offset$$16$$ = "var location = " + $opcodesArray$$inline_87_operand$$2$$ + ";this.writeMem(location++, this." + $index$$46$$.toLowerCase() + "L);this.writeMem(location, this." + $index$$46$$.toLowerCase() + "H);";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$46$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.inc" + $index$$46$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$46$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$46$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$)) + " *";
      $address$$9_address$$inline_85$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$46$$ + "  " + $index$$46$$;
      break;
    case 42:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + " (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$)) + ")";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$46$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.dec" + $index$$46$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$46$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$46$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $address$$9_address$$inline_85$$++;
      break;
    case 52:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "INC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.incMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 53:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "DEC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.decMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 54:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$ + 1));
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", " + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 57:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$46$$ + " SP";
      $code$$8_code$$inline_90_offset$$16$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$46$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$46$$ + "L *";
      break;
    case 70:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD B,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.b = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$46$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$46$$ + "L *";
      break;
    case 78:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD C,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.c = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$46$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$46$$ + "L *";
      break;
    case 86:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD D,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.d = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$46$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$46$$ + "L *";
      break;
    case 94:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD E,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.e = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "L *";
      break;
    case 102:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD H,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.h = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "L *";
      $code$$8_code$$inline_90_offset$$16$$ = "";
      break;
    case 110:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD L,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.l = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$46$$ + "L,A *";
      $code$$8_code$$inline_90_offset$$16$$ = "this." + $index$$46$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),B";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.b);";
      $address$$9_address$$inline_85$$++;
      break;
    case 113:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),C";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.c);";
      $address$$9_address$$inline_85$$++;
      break;
    case 114:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),D";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.d);";
      $address$$9_address$$inline_85$$++;
      break;
    case 115:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),E";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.e);";
      $address$$9_address$$inline_85$$++;
      break;
    case 116:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),H";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.h);";
      $address$$9_address$$inline_85$$++;
      break;
    case 117:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),L";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.l);";
      $address$$9_address$$inline_85$$++;
      break;
    case 119:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "),A";
      $code$$8_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ", this.a);";
      $address$$9_address$$inline_85$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$46$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$46$$ + "L *";
      break;
    case 126:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.a = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$46$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$46$$ + "L *";
      break;
    case 134:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.add_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$46$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$46$$ + "L *";
      break;
    case 142:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.adc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$46$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$46$$ + "L *";
      break;
    case 150:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SUB A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.sub_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$46$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$46$$ + "L *";
      break;
    case 158:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SBC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.sbc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$46$$ + "H *";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$46$$ + "L *";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 166:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "AND A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")] | F_HALFCARRY;";
      $address$$9_address$$inline_85$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 174:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "XOR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 182:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "OR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$46$$ + "H *";
      $code$$8_code$$inline_90_offset$$16$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$46$$ + "L *";
      $code$$8_code$$inline_90_offset$$16$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 190:
      $code$$8_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "CP (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "))";
      $code$$8_code$$inline_90_offset$$16$$ = "this.cp_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($code$$8_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 203:
      var $inst$$3_opcode$$inline_86$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$), $opcodesArray$$inline_87_operand$$2$$ = [$inst$$3_opcode$$inline_86$$], $inst$$inline_88$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode", $code$$8_code$$inline_90_offset$$16$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_85$$++;
      switch($inst$$3_opcode$$inline_86$$) {
        case 0:
          $inst$$inline_88$$ = "LD B,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_88$$ = "LD C,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_88$$ = "LD D,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_88$$ = "LD E,RLC (" + $index$$46$$ + ")";
          break;
        case 4:
          $inst$$inline_88$$ = "LD H,RLC (" + $index$$46$$ + ")";
          break;
        case 5:
          $inst$$inline_88$$ = "LD L,RLC (" + $index$$46$$ + ")";
          break;
        case 6:
          $inst$$inline_88$$ = "RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_88$$ = "LD A,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_88$$ = "LD B,RRC (" + $index$$46$$ + ")";
          break;
        case 9:
          $inst$$inline_88$$ = "LD C,RRC (" + $index$$46$$ + ")";
          break;
        case 10:
          $inst$$inline_88$$ = "LD D,RRC (" + $index$$46$$ + ")";
          break;
        case 11:
          $inst$$inline_88$$ = "LD E,RRC (" + $index$$46$$ + ")";
          break;
        case 12:
          $inst$$inline_88$$ = "LD H,RRC (" + $index$$46$$ + ")";
          break;
        case 13:
          $inst$$inline_88$$ = "LD L,RRC (" + $index$$46$$ + ")";
          break;
        case 14:
          $inst$$inline_88$$ = "RRC (" + $index$$46$$ + ")";
          break;
        case 15:
          $inst$$inline_88$$ = "LD A,RRC (" + $index$$46$$ + ")";
          break;
        case 16:
          $inst$$inline_88$$ = "LD B,RL (" + $index$$46$$ + ")";
          break;
        case 17:
          $inst$$inline_88$$ = "LD C,RL (" + $index$$46$$ + ")";
          break;
        case 18:
          $inst$$inline_88$$ = "LD D,RL (" + $index$$46$$ + ")";
          break;
        case 19:
          $inst$$inline_88$$ = "LD E,RL (" + $index$$46$$ + ")";
          break;
        case 20:
          $inst$$inline_88$$ = "LD H,RL (" + $index$$46$$ + ")";
          break;
        case 21:
          $inst$$inline_88$$ = "LD L,RL (" + $index$$46$$ + ")";
          break;
        case 22:
          $inst$$inline_88$$ = "RL (" + $index$$46$$ + ")";
          break;
        case 23:
          $inst$$inline_88$$ = "LD A,RL (" + $index$$46$$ + ")";
          break;
        case 24:
          $inst$$inline_88$$ = "LD B,RR (" + $index$$46$$ + ")";
          break;
        case 25:
          $inst$$inline_88$$ = "LD C,RR (" + $index$$46$$ + ")";
          break;
        case 26:
          $inst$$inline_88$$ = "LD D,RR (" + $index$$46$$ + ")";
          break;
        case 27:
          $inst$$inline_88$$ = "LD E,RR (" + $index$$46$$ + ")";
          break;
        case 28:
          $inst$$inline_88$$ = "LD H,RR (" + $index$$46$$ + ")";
          break;
        case 29:
          $inst$$inline_88$$ = "LD L,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$46$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_88$$ = "RR (" + $index$$46$$ + ")";
          break;
        case 31:
          $inst$$inline_88$$ = "LD A,RR (" + $index$$46$$ + ")";
          break;
        case 32:
          $inst$$inline_88$$ = "LD B,SLA (" + $index$$46$$ + ")";
          break;
        case 33:
          $inst$$inline_88$$ = "LD C,SLA (" + $index$$46$$ + ")";
          break;
        case 34:
          $inst$$inline_88$$ = "LD D,SLA (" + $index$$46$$ + ")";
          break;
        case 35:
          $inst$$inline_88$$ = "LD E,SLA (" + $index$$46$$ + ")";
          break;
        case 36:
          $inst$$inline_88$$ = "LD H,SLA (" + $index$$46$$ + ")";
          break;
        case 37:
          $inst$$inline_88$$ = "LD L,SLA (" + $index$$46$$ + ")";
          break;
        case 38:
          $inst$$inline_88$$ = "SLA (" + $index$$46$$ + ")";
          break;
        case 39:
          $inst$$inline_88$$ = "LD A,SLA (" + $index$$46$$ + ")";
          break;
        case 40:
          $inst$$inline_88$$ = "LD B,SRA (" + $index$$46$$ + ")";
          break;
        case 41:
          $inst$$inline_88$$ = "LD C,SRA (" + $index$$46$$ + ")";
          break;
        case 42:
          $inst$$inline_88$$ = "LD D,SRA (" + $index$$46$$ + ")";
          break;
        case 43:
          $inst$$inline_88$$ = "LD E,SRA (" + $index$$46$$ + ")";
          break;
        case 44:
          $inst$$inline_88$$ = "LD H,SRA (" + $index$$46$$ + ")";
          break;
        case 45:
          $inst$$inline_88$$ = "LD L,SRA (" + $index$$46$$ + ")";
          break;
        case 46:
          $inst$$inline_88$$ = "SRA (" + $index$$46$$ + ")";
          break;
        case 47:
          $inst$$inline_88$$ = "LD A,SRA (" + $index$$46$$ + ")";
          break;
        case 48:
          $inst$$inline_88$$ = "LD B,SLL (" + $index$$46$$ + ")";
          break;
        case 49:
          $inst$$inline_88$$ = "LD C,SLL (" + $index$$46$$ + ")";
          break;
        case 50:
          $inst$$inline_88$$ = "LD D,SLL (" + $index$$46$$ + ")";
          break;
        case 51:
          $inst$$inline_88$$ = "LD E,SLL (" + $index$$46$$ + ")";
          break;
        case 52:
          $inst$$inline_88$$ = "LD H,SLL (" + $index$$46$$ + ")";
          break;
        case 53:
          $inst$$inline_88$$ = "LD L,SLL (" + $index$$46$$ + ")";
          break;
        case 54:
          $inst$$inline_88$$ = "SLL (" + $index$$46$$ + ") *";
          break;
        case 55:
          $inst$$inline_88$$ = "LD A,SLL (" + $index$$46$$ + ")";
          break;
        case 56:
          $inst$$inline_88$$ = "LD B,SRL (" + $index$$46$$ + ")";
          break;
        case 57:
          $inst$$inline_88$$ = "LD C,SRL (" + $index$$46$$ + ")";
          break;
        case 58:
          $inst$$inline_88$$ = "LD D,SRL (" + $index$$46$$ + ")";
          break;
        case 59:
          $inst$$inline_88$$ = "LD E,SRL (" + $index$$46$$ + ")";
          break;
        case 60:
          $inst$$inline_88$$ = "LD H,SRL (" + $index$$46$$ + ")";
          break;
        case 61:
          $inst$$inline_88$$ = "LD L,SRL (" + $index$$46$$ + ")";
          break;
        case 62:
          $inst$$inline_88$$ = "SRL (" + $index$$46$$ + ")";
          break;
        case 63:
          $inst$$inline_88$$ = "LD A,SRL (" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "BIT 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "RES 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_88$$ = "SET 7,(" + $index$$46$$ + ")"
      }
      $inst$$3_opcode$$inline_86$$ = $inst$$inline_88$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($opcodesArray$$inline_87_operand$$2$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_86$$ = "POP " + $index$$46$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.set" + $index$$46$$ + "(this.readMemWord(this.sp)); this.sp += 2;";
      break;
    case 227:
      $inst$$3_opcode$$inline_86$$ = "EX SP,(" + $index$$46$$ + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "temp = this.get" + $index$$46$$ + "();this.set" + $index$$46$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_opcode$$inline_86$$ = "PUSH " + $index$$46$$;
      $code$$8_code$$inline_90_offset$$16$$ = "this.push2(this." + $index$$46$$.toLowerCase() + "H, this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_opcode$$inline_86$$ = "JP (" + $index$$46$$ + ")";
      $code$$8_code$$inline_90_offset$$16$$ = "this.pc = this.get" + $index$$46$$ + "();";
      $address$$9_address$$inline_85$$ = $JSCompiler_alias_NULL$$;
      break;
    case 249:
      $inst$$3_opcode$$inline_86$$ = "LD SP," + $index$$46$$, $code$$8_code$$inline_90_offset$$16$$ = "this.sp = this.get" + $index$$46$$ + "();"
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_86$$, code:$code$$8_code$$inline_90_offset$$16$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_85$$}
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$ggstart$ = this.$a$ = this.$controller1$ = 0
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$ggstart$ = this.$a$ = this.$controller1$ = 255;
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
$JSSMS$SN76489$$.prototype = {};
function $JSSMS$Vdp$$($i$$inline_118_i$$inline_121_sms$$3$$) {
  this.$main$ = $i$$inline_118_i$$inline_121_sms$$3$$;
  var $i$$13_r$$inline_122$$ = 0;
  this.$G$ = 0;
  this.$f$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_122$$ = 0;96 > $i$$13_r$$inline_122$$;$i$$13_r$$inline_122$$++) {
    this.$a$[$i$$13_r$$inline_122$$] = 255
  }
  this.$c$ = Array(16);
  this.$g$ = 0;
  this.$o$ = $JSCompiler_alias_FALSE$$;
  this.$v$ = this.$p$ = this.$F$ = this.$z$ = this.$h$ = this.$n$ = 0;
  this.$t$ = Array(256);
  this.$C$ = 0;
  this.$b$ = $i$$inline_118_i$$inline_121_sms$$3$$.$a$.$canvasImageData$.data;
  this.$M$ = Array(64);
  this.$L$ = Array(64);
  this.$K$ = Array(64);
  this.$J$ = Array(256);
  this.$I$ = Array(256);
  this.$H$ = Array(16);
  this.$i$ = this.$D$ = this.$A$ = 0;
  this.$j$ = $JSCompiler_alias_FALSE$$;
  this.$s$ = Array(192);
  for($i$$13_r$$inline_122$$ = 0;192 > $i$$13_r$$inline_122$$;$i$$13_r$$inline_122$$++) {
    this.$s$[$i$$13_r$$inline_122$$] = Array(25)
  }
  this.$B$ = Array(512);
  this.$w$ = Array(512);
  for($i$$inline_118_i$$inline_121_sms$$3$$ = this.$m$ = this.$q$ = 0;512 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    this.$B$[$i$$inline_118_i$$inline_121_sms$$3$$] = Array(64)
  }
  var $g$$inline_123$$, $b$$inline_124$$;
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;64 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    $i$$13_r$$inline_122$$ = $i$$inline_118_i$$inline_121_sms$$3$$ & 3, $g$$inline_123$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 2 & 3, $b$$inline_124$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 4 & 3, this.$M$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $i$$13_r$$inline_122$$ & 255, this.$L$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $g$$inline_123$$ & 255, this.$K$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $b$$inline_124$$ & 255
  }
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;256 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    $g$$inline_123$$ = $i$$inline_118_i$$inline_121_sms$$3$$ & 15, $b$$inline_124$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 4 & 15, this.$J$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($g$$inline_123$$ << 4 | $g$$inline_123$$) & 255, this.$I$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($b$$inline_124$$ << 4 | $b$$inline_124$$) & 255
  }
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;16 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    this.$H$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($i$$inline_118_i$$inline_121_sms$$3$$ << 4 | $i$$inline_118_i$$inline_121_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14$$;
  this.$o$ = $JSCompiler_alias_TRUE$$;
  for($i$$14$$ = this.$z$ = this.$g$ = this.$v$ = this.$h$ = 0;16 > $i$$14$$;$i$$14$$++) {
    this.$c$[$i$$14$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$main$.$cpu$.$D$ = $JSCompiler_alias_FALSE$$;
  this.$j$ = $JSCompiler_alias_TRUE$$;
  this.$q$ = 512;
  this.$m$ = -1;
  for($i$$14$$ = 0;16384 > $i$$14$$;$i$$14$$++) {
    this.$f$[$i$$14$$] = 0
  }
  for($i$$14$$ = 0;196608 > $i$$14$$;$i$$14$$ += 4) {
    this.$b$[$i$$14$$] = 0, this.$b$[$i$$14$$ + 1] = 0, this.$b$[$i$$14$$ + 2] = 0, this.$b$[$i$$14$$ + 3] = 255
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$C$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$q$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$m$ = 511;
  for(var $i$$15$$ = 0, $l$$ = $JSCompiler_StaticMethods_forceFullRedraw$self$$.$w$.length;$i$$15$$ < $l$$;$i$$15$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$w$[$i$$15$$] = $JSCompiler_alias_TRUE$$
  }
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$i$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[5] & -130) << 7;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$j$ = $JSCompiler_alias_TRUE$$
}
;function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.enable = function $this$enable$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.$writeFrame$ = function $this$$writeFrame$$() {
  }
}
window.$ && ($.fn.JSSMSUI = function $$$fn$JSSMSUI$($roms$$) {
  function $UI$$($root_sms$$5$$) {
    this.$main$ = $root_sms$$5$$;
    if("[object OperaMini]" == Object.prototype.toString.call(window.operamini)) {
      $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
    }else {
      var $self$$2$$ = this;
      $root_sms$$5$$ = $("<div></div>");
      var $screenContainer$$ = $('<div id="screen"></div>'), $gamepadContainer$$ = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>'), $controls$$ = $('<div id="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), 
      $requestAnimationFramePrefix_startButton$$ = $JSSMS$Utils$getPrefix$$(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window), $i$$22$$;
      if($requestAnimationFramePrefix_startButton$$) {
        this.requestAnimationFrame = window[$requestAnimationFramePrefix_startButton$$].bind(window)
      }else {
        var $lastTime$$ = 0;
        this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$54$$) {
          var $currTime$$ = $JSSMS$Utils$getTimestamp$$(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$));
          window.setTimeout(function() {
            $callback$$54$$($currTime$$ + $timeToCall$$)
          }, $timeToCall$$);
          $lastTime$$ = $currTime$$ + $timeToCall$$
        }
      }
      this.screen = $("<canvas width=256 height=192></canvas>");
      this.$canvasContext$ = this.screen[0].getContext("2d");
      if(this.$canvasContext$.getImageData) {
        this.$canvasImageData$ = this.$canvasContext$.getImageData(0, 0, 256, 192);
        this.$gamepad$ = {$u$:{$e$:$(".up", $gamepadContainer$$), $k$:1}, $r$:{$e$:$(".right", $gamepadContainer$$), $k$:8}, $d$:{$e$:$(".down", $gamepadContainer$$), $k$:2}, $l$:{$e$:$(".left", $gamepadContainer$$), $k$:4}, 1:{$e$:$(".fire1", $gamepadContainer$$), $k$:16}, 2:{$e$:$(".fire2", $gamepadContainer$$), $k$:32}};
        $requestAnimationFramePrefix_startButton$$ = $(".start", $gamepadContainer$$);
        this.$romContainer$ = $('<div id="romSelector"></div>');
        this.$romSelect$ = $("<select></select>").change(function() {
          $self$$2$$.$loadROM$()
        });
        this.$buttons$ = Object.create($JSCompiler_alias_NULL$$);
        this.$buttons$.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$isRunning$ ? ($self$$2$$.$main$.stop(), $self$$2$$.updateStatus("Paused"), $self$$2$$.$buttons$.start.attr("value", "Start")) : ($self$$2$$.$main$.start(), $self$$2$$.$buttons$.start.attr("value", "Pause"))
        });
        this.$buttons$.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
          "" != $self$$2$$.$main$.$romData$ && "" != $self$$2$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$2$$.$main$, $self$$2$$.$main$.$romData$, $self$$2$$.$main$.$romFileName$) ? ($self$$2$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$2$$.$main$.$vdp$), $self$$2$$.$main$.start()) : $(this).attr("disabled", "disabled")
        });
        this.$dissambler$ = $('<div id="dissambler"></div>');
        $($parent$$2$$).after(this.$dissambler$);
        this.$buttons$.$nextStep$ = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$nextStep$()
        });
        this.$main$.$soundEnabled$ && (this.$buttons$.$sound$ = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$soundEnabled$ ? ($self$$2$$.$main$.$soundEnabled$ = $JSCompiler_alias_FALSE$$, $self$$2$$.$buttons$.$sound$.attr("value", "Enable sound")) : ($self$$2$$.$main$.$soundEnabled$ = $JSCompiler_alias_TRUE$$, $self$$2$$.$buttons$.$sound$.attr("value", "Disable sound"))
        }));
        $fullscreenSupport$$ ? this.$buttons$.$fullscreen$ = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var $screen$$1$$ = $screenContainer$$[0];
          $screen$$1$$.requestFullscreen ? $screen$$1$$.requestFullscreen() : $screen$$1$$.mozRequestFullScreen ? $screen$$1$$.mozRequestFullScreen() : $screen$$1$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }) : (this.$zoomed$ = $JSCompiler_alias_FALSE$$, this.$buttons$.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          $self$$2$$.$zoomed$ ? ($self$$2$$.screen.animate({width:"256px", height:"192px"}, function() {
            $(this).removeAttr("style")
          }), $self$$2$$.$buttons$.zoom.attr("value", "Zoom in")) : ($self$$2$$.screen.animate({width:"512px", height:"384px"}), $self$$2$$.$buttons$.zoom.attr("value", "Zoom out"));
          $self$$2$$.$zoomed$ = !$self$$2$$.$zoomed$
        }));
        for($i$$22$$ in this.$buttons$) {
          this.$buttons$[$i$$22$$].appendTo($controls$$)
        }
        this.log = $('<div id="status"></div>');
        this.screen.appendTo($screenContainer$$);
        $gamepadContainer$$.appendTo($screenContainer$$);
        $screenContainer$$.appendTo($root_sms$$5$$);
        this.$romContainer$.appendTo($root_sms$$5$$);
        $controls$$.appendTo($root_sms$$5$$);
        this.log.appendTo($root_sms$$5$$);
        $root_sms$$5$$.appendTo($($parent$$2$$));
        $roms$$ != $JSCompiler_alias_VOID$$ && this.$setRoms$($roms$$);
        $(document).bind("keydown", function($evt$$18$$) {
          $self$$2$$.$main$.$keyboard$.keydown($evt$$18$$)
        }).bind("keyup", function($evt$$19$$) {
          $self$$2$$.$main$.$keyboard$.keyup($evt$$19$$)
        });
        for($i$$22$$ in this.$gamepad$) {
          this.$gamepad$[$i$$22$$].$e$.on("mousedown touchstart", function($key$$17$$) {
            return function($evt$$20$$) {
              $self$$2$$.$main$.$keyboard$.$controller1$ &= ~$key$$17$$;
              $evt$$20$$.preventDefault()
            }
          }(this.$gamepad$[$i$$22$$].$k$)).on("mouseup touchend", function($key$$18$$) {
            return function($evt$$21$$) {
              $self$$2$$.$main$.$keyboard$.$controller1$ |= $key$$18$$;
              $evt$$21$$.preventDefault()
            }
          }(this.$gamepad$[$i$$22$$].$k$))
        }
        $requestAnimationFramePrefix_startButton$$.on("mousedown touchstart", function($evt$$22$$) {
          $self$$2$$.$main$.$is_sms$ ? $self$$2$$.$main$.$pause_button$ = $JSCompiler_alias_TRUE$$ : $self$$2$$.$main$.$keyboard$.$ggstart$ &= -129;
          $evt$$22$$.preventDefault()
        }).on("mouseup touchend", function($evt$$23$$) {
          $self$$2$$.$main$.$is_sms$ || ($self$$2$$.$main$.$keyboard$.$ggstart$ |= 128);
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
    var $groupName$$, $optgroup$$, $length$$19$$, $i$$23$$, $count$$7$$ = 0;
    this.$romSelect$.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.$romSelect$);
    for($groupName$$ in $roms$$1$$) {
      if($roms$$1$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$19$$ = $roms$$1$$[$groupName$$].length;
        for($i$$23$$ = 0;$i$$23$$ < $length$$19$$;$i$$23$$++) {
          $("<option>" + $roms$$1$$[$groupName$$][$i$$23$$][0] + "</option>").attr("value", $roms$$1$$[$groupName$$][$i$$23$$][1]).appendTo($optgroup$$)
        }
        $optgroup$$.appendTo(this.$romSelect$)
      }
      $count$$7$$++
    }
    $count$$7$$ && this.$romSelect$.appendTo(this.$romContainer$)
  }, $loadROM$:function $$UI$$$$$loadROM$$() {
    var $self$$3$$ = this;
    this.updateStatus("Downloading...");
    $.ajax({url:escape(this.$romSelect$.val()), xhr:function() {
      var $xhr$$ = $.ajaxSettings.xhr();
      $xhr$$.overrideMimeType != $JSCompiler_alias_VOID$$ && $xhr$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$3$$.xhr = $xhr$$
    }, complete:function($xhr$$1$$, $status$$) {
      var $data$$32$$;
      "error" == $status$$ ? $self$$3$$.updateStatus("The selected rom could not be loaded.") : ($data$$32$$ = $xhr$$1$$.responseText, $self$$3$$.$main$.stop(), $JSCompiler_StaticMethods_readRomDirectly$$($self$$3$$.$main$, $data$$32$$, $self$$3$$.$romSelect$.val()), $self$$3$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$3$$.$main$.$vdp$), $self$$3$$.enable())
    }})
  }, enable:function $$UI$$$$enable$() {
    this.$buttons$.start.removeAttr("disabled");
    this.$buttons$.start.attr("value", "Start");
    this.$buttons$.reset.removeAttr("disabled");
    this.$buttons$.$nextStep$.removeAttr("disabled");
    this.$main$.$soundEnabled$ && (this.$buttons$.$sound$ ? this.$buttons$.$sound$.attr("value", "Disable sound") : this.$buttons$.$sound$.attr("value", "Enable sound"))
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
    for(var $instructions$$ = this.$main$.$cpu$.$instructions$, $length$$20$$ = $instructions$$.length, $html$$ = "", $i$$24$$ = 8 > $currentAddress$$1$$ ? 0 : $currentAddress$$1$$ - 8, $num$$4$$ = 0;16 > $num$$4$$ && $i$$24$$ <= $length$$20$$;$i$$24$$++) {
      $instructions$$[$i$$24$$] && ($html$$ += "<div" + ($instructions$$[$i$$24$$].$address$ == $currentAddress$$1$$ ? ' class="current"' : "") + ">" + $instructions$$[$i$$24$$].$hexAddress$ + ($instructions$$[$i$$24$$].$isJumpTarget$ ? ":" : " ") + "<code>" + $instructions$$[$i$$24$$].$inst$ + "</code></div>", $num$$4$$++)
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$G$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$p$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$p$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$p$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$o$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_201_value$$inline_198$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$F$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$F$ = $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$f$[$JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$h$++ & 
      16383] & 255;
      return $statuscopy$$inline_201_value$$inline_198$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$o$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_201_value$$inline_198$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$g$, $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$g$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_200_JSCompiler_StaticMethods_dataRead$self$$inline_197_JSCompiler_StaticMethods_getVCount$self$$inline_195_JSCompiler_inline_result$$5$$.$main$.$cpu$.$D$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_201_value$$inline_198$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$a$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$a$[0] | $JSCompiler_StaticMethods_in_$self$$.$a$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$, $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$, $reg$$inline_211_value$$79$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$)) {
    switch($address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[0] = ($reg$$inline_211_value$$79$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[1] = $reg$$inline_211_value$$79$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$o$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$z$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ & 16383;
            if($reg$$inline_211_value$$79$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$] & 255)) {
              if($address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ && $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ + 128 && $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_207$$ = $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$w$[$tileIndex$$inline_207$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_207$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$q$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$q$ = $tileIndex$$inline_207$$);
                  $tileIndex$$inline_207$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$m$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$m$ = $tileIndex$$inline_207$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$] = $reg$$inline_211_value$$79$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$M$[$reg$$inline_211_value$$79$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$L$[$reg$$inline_211_value$$79$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$K$[$reg$$inline_211_value$$79$$]) : 
            ($address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$J$[$reg$$inline_211_value$$79$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$I$[$reg$$inline_211_value$$79$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_211_value$$79$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$o$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$o$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ = $reg$$inline_211_value$$79$$, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ & 16128 | $reg$$inline_211_value$$79$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$o$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$z$ = $reg$$inline_211_value$$79$$ >> 
          6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ | $reg$$inline_211_value$$79$$ << 8, 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$z$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$F$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$z$) {
              $reg$$inline_211_value$$79$$ &= 15;
              switch($reg$$inline_211_value$$79$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$g$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$D$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_211_value$$79$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$C$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$ & -130) << 7, $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_206_old$$inline_212_port$$2_temp$$inline_205$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$i$))
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_211_value$$79$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$n$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$, 0 != ($reg$$inline_211_value$$79$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_211_value$$79$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_211_value$$79$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_211_value$$79$$ & 63) << 4 : 
          $reg$$inline_211_value$$79$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$j$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_214_JSCompiler_StaticMethods_controlWrite$self$$inline_209_JSCompiler_StaticMethods_dataWrite$self$$inline_203_JSCompiler_StaticMethods_out$self$$.$h$ = 
              32768
          }
        }
    }
  }
}
;window.JSSMS = $JSSMS$$;

