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
(function(window){'use strict';var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$i$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if(void 0 != $opts$$) {
    for(var $key$$14$$ in this.$i$) {
      void 0 != $opts$$[$key$$14$$] && (this.$i$[$key$$14$$] = $opts$$[$key$$14$$])
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
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $fps$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!1, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ = this.$c$.$A$, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$c$.$A$ = $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ = this.$d$;
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$j$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$e$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$h$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$f$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$d$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ && ($JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$.$g$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $currentAddress$$inline_241_fractional$$inline_18$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $currentAddress$$inline_241_fractional$$inline_18$$, $currentAddress$$inline_241_fractional$$inline_18$$ = $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ - ($JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ >> 16
      }
    }
  }
  this.$e$.reset();
  this.$b$.reset();
  this.$c$.reset();
  this.$f$.reset();
  this.$a$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$ = this.$a$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$A$.$b$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ = 16384 * $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$rom$.length, $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$, $i$$inline_242$$ = 0, $addresses$$inline_243$$ = [];
  $addresses$$inline_243$$.push(0);
  $addresses$$inline_243$$.push(56);
  for($addresses$$inline_243$$.push(102);$addresses$$inline_243$$.length;) {
    if($currentAddress$$inline_241_fractional$$inline_18$$ = $addresses$$inline_243$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$currentAddress$$inline_241_fractional$$inline_18$$]) {
      if($currentAddress$$inline_241_fractional$$inline_18$$ >= $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$ || 65 <= $currentAddress$$inline_241_fractional$$inline_18$$ >> 10) {
        console.log("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$inline_241_fractional$$inline_18$$))
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $currentAddress$$inline_241_fractional$$inline_18$$;
        $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
        var $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = [$instruction$$inline_240_opcode$$inline_264_options$$inline_288$$], $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "Unknown Opcode", $currAddr$$inline_267_prop$$inline_290$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$, $address$$inline_279_target$$inline_268$$ = null, $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($instruction$$inline_240_opcode$$inline_264_options$$inline_288$$) + 
        '";', $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = "", $code$$inline_278_location$$inline_271_target$$inline_284$$ = 0;
        $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
        switch($instruction$$inline_240_opcode$$inline_264_options$$inline_288$$) {
          case 0:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "NOP";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 1:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD BC," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setBC(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 2:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (BC),A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC BC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 7:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RLCA";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "EX AF AF'";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD HL,BC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,(BC)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC BC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 15:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RRCA";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 17:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD DE," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setDE(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 18:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (DE),A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC DE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 23:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RLA";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = null;
            break;
          case 25:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD HL,DE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,(DE)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC DE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 31:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RRA";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 5;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 33:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD HL," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 34:
            $code$$inline_278_location$$inline_271_target$$inline_284$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "),HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$ + 1) + ", this.h);";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 35:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 39:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DAA";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 5;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 41:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD HL,HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD HL,(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.readMemWord(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "));";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 43:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 47:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CPL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 5;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 49:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD SP," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sp = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 50:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "),A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ", this.a);";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 51:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC SP";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC (HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC (HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL)," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 55:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SCF";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$) + 1);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 5;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 57:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD HL,SP";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.readMem(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 59:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC SP";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "INC A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DEC A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ";";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 63:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CCF";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 65:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD B,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 74:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD C,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 83:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD D,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 92:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD E,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 101:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD H,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 110:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD L,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "HALT";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.tstates = 0;";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ += "this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "; return;";
            break;
          case 119:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD (HL),A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "";
            break;
          case 128:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.a = " + $JSSMS$Utils$toHex$$(0) + "; this.f = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$.$l$[0]) + ";";
            break;
          case 176:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,B";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,D";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,E";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,H";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,L";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,(HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP A,A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET NZ";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "POP BC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 195:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = null;
            break;
          case 196:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 197:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "PUSH BC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADD A," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.add_a(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 199:
            $address$$inline_279_target$$inline_268$$ = 0;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 200:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET Z";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = null;
            break;
          case 202:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 203:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = void 0;
            $JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$];
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$;
            $code$$inline_278_location$$inline_271_target$$inline_284$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$) {
              case 0:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.rlc(this.c));";
                break;
              case 2:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.rlc(this.d));";
                break;
              case 3:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.rlc(this.e));";
                break;
              case 4:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.rlc(this.h));";
                break;
              case 5:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.rlc(this.l));";
                break;
              case 6:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
                break;
              case 7:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLC A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.rlc(this.a));";
                break;
              case 8:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.rrc(this.b));";
                break;
              case 9:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.rrc(this.c));";
                break;
              case 10:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.rrc(this.d));";
                break;
              case 11:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.rrc(this.e));";
                break;
              case 12:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.rrc(this.h));";
                break;
              case 13:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.rrc(this.l));";
                break;
              case 14:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
                break;
              case 15:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRC A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.rrc(this.a));";
                break;
              case 16:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.rl(this.b));";
                break;
              case 17:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.rl(this.c));";
                break;
              case 18:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.rl(this.d));";
                break;
              case 19:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.rl(this.e));";
                break;
              case 20:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.rl(this.h));";
                break;
              case 21:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.rl(this.l));";
                break;
              case 22:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
                break;
              case 23:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RL A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.rl(this.a));";
                break;
              case 24:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.rr(this.b));";
                break;
              case 25:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.rr(this.c));";
                break;
              case 26:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.rr(this.d));";
                break;
              case 27:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.rr(this.e));";
                break;
              case 28:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.rr(this.h));";
                break;
              case 29:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.rr(this.l));";
                break;
              case 30:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
                break;
              case 31:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RR A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.rr(this.a));";
                break;
              case 32:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.sla(this.b));";
                break;
              case 33:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.sla(this.c));";
                break;
              case 34:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.sla(this.d));";
                break;
              case 35:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.sla(this.e));";
                break;
              case 36:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.sla(this.h));";
                break;
              case 37:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.sla(this.l));";
                break;
              case 38:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
                break;
              case 39:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLA A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.sla(this.a));";
                break;
              case 40:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.sra(this.b));";
                break;
              case 41:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.sra(this.c));";
                break;
              case 42:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.sra(this.d));";
                break;
              case 43:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.sra(this.e));";
                break;
              case 44:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.sra(this.h));";
                break;
              case 45:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.sra(this.l));";
                break;
              case 46:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
                break;
              case 47:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRA A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.sra(this.a));";
                break;
              case 48:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = (this.sll(this.b));";
                break;
              case 49:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = (this.sll(this.c));";
                break;
              case 50:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = (this.sll(this.d));";
                break;
              case 51:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = (this.sll(this.e));";
                break;
              case 52:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = (this.sll(this.h));";
                break;
              case 53:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = (this.sll(this.l));";
                break;
              case 54:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
                break;
              case 55:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SLL A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = (this.sll(this.a));";
                break;
              case 56:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b = this.srl(this.b);";
                break;
              case 57:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c = this.srl(this.c);";
                break;
              case 58:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d = this.srl(this.d);";
                break;
              case 59:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e = this.srl(this.e);";
                break;
              case 60:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h = this.srl(this.h);";
                break;
              case 61:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l = this.srl(this.l);";
                break;
              case 62:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL (HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
                break;
              case 63:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SRL A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a = this.srl(this.a);";
                break;
              case 64:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_0);";
                break;
              case 65:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_0);";
                break;
              case 66:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_0);";
                break;
              case 67:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_0);";
                break;
              case 68:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_0);";
                break;
              case 69:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_0);";
                break;
              case 70:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
                break;
              case 71:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 0,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_0);";
                break;
              case 72:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_1);";
                break;
              case 73:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_1);";
                break;
              case 74:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_1);";
                break;
              case 75:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_1);";
                break;
              case 76:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_1);";
                break;
              case 77:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_1);";
                break;
              case 78:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
                break;
              case 79:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 1,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_1);";
                break;
              case 80:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_2);";
                break;
              case 81:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_2);";
                break;
              case 82:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_2);";
                break;
              case 83:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_2);";
                break;
              case 84:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_2);";
                break;
              case 85:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_2);";
                break;
              case 86:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
                break;
              case 87:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 2,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_2);";
                break;
              case 88:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_3);";
                break;
              case 89:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_3);";
                break;
              case 90:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_3);";
                break;
              case 91:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_3);";
                break;
              case 92:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_3);";
                break;
              case 93:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_3);";
                break;
              case 94:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
                break;
              case 95:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 3,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_3);";
                break;
              case 96:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_4);";
                break;
              case 97:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_4);";
                break;
              case 98:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_4);";
                break;
              case 99:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_4);";
                break;
              case 100:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_4);";
                break;
              case 101:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_4);";
                break;
              case 102:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
                break;
              case 103:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 4,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_4);";
                break;
              case 104:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_5);";
                break;
              case 105:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_5);";
                break;
              case 106:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_5);";
                break;
              case 107:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_5);";
                break;
              case 108:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_5);";
                break;
              case 109:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_5);";
                break;
              case 110:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
                break;
              case 111:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 5,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_5);";
                break;
              case 112:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_6);";
                break;
              case 113:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_6);";
                break;
              case 114:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_6);";
                break;
              case 115:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_6);";
                break;
              case 116:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_6);";
                break;
              case 117:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_6);";
                break;
              case 118:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
                break;
              case 119:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 6,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_6);";
                break;
              case 120:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.b & BIT_7);";
                break;
              case 121:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.c & BIT_7);";
                break;
              case 122:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.d & BIT_7);";
                break;
              case 123:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.e & BIT_7);";
                break;
              case 124:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.h & BIT_7);";
                break;
              case 125:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.l & BIT_7);";
                break;
              case 126:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
                break;
              case 127:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "BIT 7,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.bit(this.a & BIT_7);";
                break;
              case 128:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b &= ~BIT_0;";
                break;
              case 129:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c &= ~BIT_0;";
                break;
              case 130:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d &= ~BIT_0;";
                break;
              case 131:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e &= ~BIT_0;";
                break;
              case 132:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h &= ~BIT_0;";
                break;
              case 133:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l &= ~BIT_0;";
                break;
              case 134:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
                break;
              case 135:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 0,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a &= ~BIT_0;";
                break;
              case 136:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
                break;
              case 143:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
                break;
              case 151:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
                break;
              case 159:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 3,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a &= ~BIT_3;";
                break;
              case 160:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
                break;
              case 167:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 4,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a &= ~BIT_4;";
                break;
              case 168:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
                break;
              case 175:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
                break;
              case 183:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 6,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a &= ~BIT_6;";
                break;
              case 184:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b &= ~BIT_7;";
                break;
              case 185:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c &= ~BIT_7;";
                break;
              case 186:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d &= ~BIT_7;";
                break;
              case 187:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e &= ~BIT_7;";
                break;
              case 188:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h &= ~BIT_7;";
                break;
              case 189:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l &= ~BIT_7;";
                break;
              case 190:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
                break;
              case 191:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RES 7,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a &= ~BIT_7;";
                break;
              case 192:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b |= BIT_0;";
                break;
              case 193:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c |= BIT_0;";
                break;
              case 194:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d |= BIT_0;";
                break;
              case 195:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e |= BIT_0;";
                break;
              case 196:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h |= BIT_0;";
                break;
              case 197:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l |= BIT_0;";
                break;
              case 198:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
                break;
              case 199:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 0,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a |= BIT_0;";
                break;
              case 200:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
                break;
              case 207:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
                break;
              case 215:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
                break;
              case 223:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
                break;
              case 231:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 4,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a |= BIT_4;";
                break;
              case 232:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
                break;
              case 239:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 5,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a |= BIT_5;";
                break;
              case 240:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b |= BIT_6;";
                break;
              case 241:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c |= BIT_6;";
                break;
              case 242:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d |= BIT_6;";
                break;
              case 243:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e |= BIT_6;";
                break;
              case 244:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h |= BIT_6;";
                break;
              case 245:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l |= BIT_6;";
                break;
              case 246:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
                break;
              case 247:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 6,A";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a |= BIT_6;";
                break;
              case 248:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,B";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.b |= BIT_7;";
                break;
              case 249:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,C";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.c |= BIT_7;";
                break;
              case 250:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,D";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.d |= BIT_7;";
                break;
              case 251:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,E";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.e |= BIT_7;";
                break;
              case 252:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,H";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.h |= BIT_7;";
                break;
              case 253:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,L";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.l |= BIT_7;";
                break;
              case 254:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,(HL)";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
                break;
              case 255:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SET 7,A", $code$$inline_278_location$$inline_271_target$$inline_284$$ = "this.a |= BIT_7;"
            }
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $opcodes$:$inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$, $inst$:$code$$inline_269_inst$$inline_276_inst$$inline_282$$, code:$code$$inline_278_location$$inline_271_target$$inline_284$$, $address$:$_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$, 
            $nextAddress$:$address$$inline_263_address$$inline_273_opcode$$inline_280$$};
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$inst$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.code;
            $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.concat($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$opcodes$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 205:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 206:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "ADC ," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.adc_a(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 207:
            $address$$inline_279_target$$inline_268$$ = 8;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 208:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET NC";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "POP DE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 211:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$) + "),A";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 212:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 213:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "PUSH DE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SUB " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sub_a(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 215:
            $address$$inline_279_target$$inline_268$$ = 16;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 216:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET C";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "EXX";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 219:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 220:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 221:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, "IX", $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$inst$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.code;
            $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.concat($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$opcodes$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$nextAddress$;
            break;
          case 222:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "SBC A," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sbc_a(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 223:
            $address$$inline_279_target$$inline_268$$ = 24;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 224:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET PO";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "POP HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 227:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "EX (SP),HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 229:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "PUSH HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "AND (" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "] | F_HALFCARRY;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 231:
            $address$$inline_279_target$$inline_268$$ = 32;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 232:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET PE";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP (HL)";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.pc = this.getHL(); return;";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = null;
            break;
          case 234:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 235:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "EX DE,HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 237:
            var $address$$inline_279_target$$inline_268$$ = $address$$inline_263_address$$inline_273_opcode$$inline_280$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$), $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = [$address$$inline_263_address$$inline_273_opcode$$inline_280$$], 
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "Unimplemented 0xED prefixed opcode", $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $address$$inline_279_target$$inline_268$$, $code$$inline_278_location$$inline_271_target$$inline_284$$ = null, $code$$inline_285$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_286$$ = "", $location$$inline_287$$ = 0;
            $address$$inline_279_target$$inline_268$$++;
            switch($address$$inline_263_address$$inline_273_opcode$$inline_280$$) {
              case 64:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN B,(C)";
                $code$$inline_285$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
                break;
              case 65:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),B";
                $code$$inline_285$$ = "this.port.out(this.c, this.b);";
                break;
              case 66:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SBC HL,BC";
                $code$$inline_285$$ = "this.sbc16(this.getBC());";
                break;
              case 67:
                $location$$inline_287$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$);
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($location$$inline_287$$);
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD (" + $operand$$inline_286$$ + "),BC";
                $code$$inline_285$$ = "this.writeMem(" + $operand$$inline_286$$ + ", this.c);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_287$$ + 1) + ", this.b);";
                $address$$inline_279_target$$inline_268$$ += 2;
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
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "NEG";
                $code$$inline_285$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RETN / RETI";
                $code$$inline_285$$ = "this.pc = this.readMemWord(this.sp);this.sp += 2;this.iff1 = this.iff2;";
                $address$$inline_279_target$$inline_268$$ = null;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IM 0";
                $code$$inline_285$$ = "this.im = 0;";
                break;
              case 71:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD I,A";
                $code$$inline_285$$ = "this.i = this.a;";
                break;
              case 72:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN C,(C)";
                $code$$inline_285$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
                break;
              case 73:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),C";
                $code$$inline_285$$ = "this.port.out(this.c, this.c);";
                break;
              case 74:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "ADC HL,BC";
                $code$$inline_285$$ = "this.adc16(this.getBC());";
                break;
              case 75:
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$));
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD BC,(" + $operand$$inline_286$$ + ")";
                $code$$inline_285$$ = "this.setBC(this.readMemWord(" + $operand$$inline_286$$ + "));";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 79:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD R,A";
                $code$$inline_285$$ = "this.r = this.a;";
                break;
              case 80:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN D,(C)";
                $code$$inline_285$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
                break;
              case 81:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),D";
                $code$$inline_285$$ = "this.port.out(this.c, this.d);";
                break;
              case 82:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SBC HL,DE";
                $code$$inline_285$$ = "this.sbc16(this.getDE());";
                break;
              case 83:
                $location$$inline_287$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$);
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($location$$inline_287$$);
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD (" + $operand$$inline_286$$ + "),DE";
                $code$$inline_285$$ = "this.writeMem(" + $operand$$inline_286$$ + ", this.e);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_287$$ + 1) + ", this.d);";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IM 1";
                $code$$inline_285$$ = "this.im = 1;";
                break;
              case 87:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD A,I";
                $code$$inline_285$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 88:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN E,(C)";
                $code$$inline_285$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
                break;
              case 89:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),E";
                $code$$inline_285$$ = "this.port.out(this.c, this.e);";
                break;
              case 90:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "ADC HL,DE";
                $code$$inline_285$$ = "this.adc16(this.getDE());";
                break;
              case 91:
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$));
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD DE,(" + $operand$$inline_286$$ + ")";
                $code$$inline_285$$ = "this.setDE(" + $operand$$inline_286$$ + ");";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 95:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD A,R";
                $code$$inline_285$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_285$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN H,(C)";
                $code$$inline_285$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
                break;
              case 97:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),H";
                $code$$inline_285$$ = "this.port.out(this.c, this.h);";
                break;
              case 98:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SBC HL,HL";
                $code$$inline_285$$ = "this.sbc16(this.getHL());";
                break;
              case 99:
                $location$$inline_287$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$);
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($location$$inline_287$$);
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD (" + $operand$$inline_286$$ + "),HL";
                $code$$inline_285$$ = "this.writeMem(" + $operand$$inline_286$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_287$$ + 1) + ", this.h);";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 103:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RRD";
                $code$$inline_285$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 104:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN L,(C)";
                $code$$inline_285$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
                break;
              case 105:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),L";
                $code$$inline_285$$ = "this.port.out(this.c, this.l);";
                break;
              case 106:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "ADC HL,HL";
                $code$$inline_285$$ = "this.adc16(this.getHL());";
                break;
              case 107:
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$));
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD HL,(" + $operand$$inline_286$$ + ")";
                $code$$inline_285$$ = "this.setHL(this.readMemWord(" + $operand$$inline_286$$ + "));";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 111:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "RLD";
                $code$$inline_285$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 113:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),0";
                $code$$inline_285$$ = "this.port.out(this.c, 0);";
                break;
              case 114:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "SBC HL,SP";
                $code$$inline_285$$ = "this.sbc16(this.sp);";
                break;
              case 115:
                $location$$inline_287$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$);
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($location$$inline_287$$);
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD (" + $operand$$inline_286$$ + "),SP";
                $code$$inline_285$$ = "this.writeMem(" + $operand$$inline_286$$ + ", this.sp & 0xFF);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_287$$ + 1) + ", this.sp >> 8);";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 120:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IN A,(C)";
                $code$$inline_285$$ = "this.a = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 121:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUT (C),A";
                $code$$inline_285$$ = "this.port.out(this.c, this.a);";
                break;
              case 122:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "ADC HL,SP";
                $code$$inline_285$$ = "this.adc16(this.sp);";
                break;
              case 123:
                $operand$$inline_286$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_279_target$$inline_268$$));
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LD SP,(" + $operand$$inline_286$$ + ")";
                $code$$inline_285$$ = "this.sp = this.readMemWord(" + $operand$$inline_286$$ + ");";
                $address$$inline_279_target$$inline_268$$ += 2;
                break;
              case 160:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LDI";
                $code$$inline_285$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);";
                break;
              case 161:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "CPI";
                $code$$inline_285$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
                break;
              case 162:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "INI";
                $code$$inline_285$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 163:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUTI";
                $code$$inline_285$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LDD";
                break;
              case 169:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "CPD";
                break;
              case 170:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "IND";
                $code$$inline_285$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 171:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OUTD";
                $code$$inline_285$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 176:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LDIR";
                $code$$inline_285$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2;
                $code$$inline_285$$ += "if (this.getBC() != 0) {this.f |= F_PARITY;this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}";
                $code$$inline_285$$ += "if (!(this.getBC() != 0)) this.f &= ~ F_PARITY;this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "CPIR";
                $code$$inline_285$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2;
                $code$$inline_285$$ += "if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}";
                $code$$inline_285$$ += "this.f = (this.f & 0xF8) | temp;";
                break;
              case 178:
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2;
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "INIR";
                $code$$inline_285$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 179:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OTIR";
                $code$$inline_285$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();";
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2;
                $code$$inline_285$$ += "if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}";
                $code$$inline_285$$ += "if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "LDDR";
                break;
              case 185:
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "CPDR";
                break;
              case 186:
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2;
                $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "INDR";
                $code$$inline_285$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 187:
                $code$$inline_278_location$$inline_271_target$$inline_284$$ = $address$$inline_279_target$$inline_268$$ - 2, $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "OTDR", $code$$inline_285$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_278_location$$inline_271_target$$inline_284$$) + ";return;}if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;"
            }
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = {$opcode$:$address$$inline_263_address$$inline_273_opcode$$inline_280$$, $opcodes$:$inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$, $inst$:$code$$inline_269_inst$$inline_276_inst$$inline_282$$, code:$code$$inline_285$$, $address$:$_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$, $nextAddress$:$address$$inline_279_target$$inline_268$$, target:$code$$inline_278_location$$inline_271_target$$inline_284$$};
            $address$$inline_279_target$$inline_268$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.target;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$inst$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.code;
            $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.concat($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$opcodes$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$nextAddress$;
            break;
          case 238:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "XOR A," + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "];";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 239:
            $address$$inline_279_target$$inline_268$$ = 40;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 240:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET P";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "POP AF";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 243:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "DI";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 245:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "PUSH AF";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "OR " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + "];";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 247:
            $address$$inline_279_target$$inline_268$$ = 48;
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$);
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;";
            break;
          case 248:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RET M";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "LD SP,HL";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 251:
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "EI";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_279_target$$inline_268$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ")";
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + ";this.tstates -= 7;return;}";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ += 2;
            break;
          case 253:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, "IY", $address$$inline_263_address$$inline_273_opcode$$inline_280$$);
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$inst$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.code;
            $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.concat($_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$opcodes$);
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$ = $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$.$nextAddress$;
            break;
          case 254:
            $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$, $address$$inline_263_address$$inline_273_opcode$$inline_280$$));
            $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "CP " + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$;
            $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.cp_a(" + $_inst$$inline_272_currAddr$$inline_277_currAddr$$inline_283_operand$$inline_270$$ + ");";
            $address$$inline_263_address$$inline_273_opcode$$inline_280$$++;
            break;
          case 255:
            $address$$inline_279_target$$inline_268$$ = 56, $inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$), $code$$inline_269_inst$$inline_276_inst$$inline_282$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_263_address$$inline_273_opcode$$inline_280$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_279_target$$inline_268$$) + "; return;"
        }
        $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$ = {$opcode$:$instruction$$inline_240_opcode$$inline_264_options$$inline_288$$, $opcodes$:$defaultInstruction$$inline_289_opcodesArray$$inline_265$$, $inst$:$inst$$inline_266_opcodesArray$$inline_275_opcodesArray$$inline_281$$, code:$code$$inline_269_inst$$inline_276_inst$$inline_282$$, $address$:$currAddr$$inline_267_prop$$inline_290$$, $nextAddress$:$address$$inline_263_address$$inline_273_opcode$$inline_280$$, target:$address$$inline_279_target$$inline_268$$};
        $defaultInstruction$$inline_289_opcodesArray$$inline_265$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""};
        $currAddr$$inline_267_prop$$inline_290$$ = void 0;
        $JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$ = "";
        for($currAddr$$inline_267_prop$$inline_290$$ in $defaultInstruction$$inline_289_opcodesArray$$inline_265$$) {
          void 0 != $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$[$currAddr$$inline_267_prop$$inline_290$$] && ($defaultInstruction$$inline_289_opcodesArray$$inline_265$$[$currAddr$$inline_267_prop$$inline_290$$] = $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$[$currAddr$$inline_267_prop$$inline_290$$])
        }
        $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$address$);
        $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
        $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.label = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self$$inline_262_hexOpcodes$$inline_291_opcode$$inline_274$$ + $defaultInstruction$$inline_289_opcodesArray$$inline_265$$.$inst$;
        $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$ = $defaultInstruction$$inline_289_opcodesArray$$inline_265$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$currentAddress$$inline_241_fractional$$inline_18$$] = $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$;
        null != $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$.$nextAddress$ && $addresses$$inline_243$$.push($instruction$$inline_240_opcode$$inline_264_options$$inline_288$$.$nextAddress$);
        null != $instruction$$inline_240_opcode$$inline_264_options$$inline_288$$.target && $addresses$$inline_243$$.push($instruction$$inline_240_opcode$$inline_264_options$$inline_288$$.target)
      }
    }
  }
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[0].$isJumpTarget$ = !0;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[56].$isJumpTarget$ = !0;
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[102].$isJumpTarget$ = !0;$i$$inline_242$$ < $JSCompiler_StaticMethods_init$self$$inline_234_mode$$inline_14_romSize$$inline_239_v$$inline_17$$;$i$$inline_242$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$] && (null != $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].$nextAddress$ && $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].$nextAddress$] && 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].$nextAddress$].$jumpTargetNb$++, null != $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].target && ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].target] ? 
    ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].target].$jumpTargetNb$++) : 
    console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$u$[$i$$inline_242$$].target)))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_236$$.$A$.$b$.updateStatus("Instructions parsed");
  clearInterval(this.$g$)
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen), this.$h$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$g$ = setInterval(function() {
    var $now$$inline_25$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$b$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_25$$ - $self$$1$$.$h$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$h$ = $now$$inline_25$$
  }, 500));
  this.$b$.updateStatus("Running")
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  clearInterval(this.$g$);
  this.$isRunning$ = !1
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if(this.$isRunning$) {
    var $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$ = this.$a$;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$lineno$ = 0;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$n$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$A$.$cyclesPerLine$;
    for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$B$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$);;) {
      var $JSCompiler_StaticMethods_interpret$self$$inline_245$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$, $location$$inline_246$$ = 0, $temp$$inline_247$$ = 0, $opcode$$inline_248$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
      $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$I$ = !1;
      $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$n$ -= $OP_STATES$$[$opcode$$inline_248$$];
      switch($opcode$$inline_248$$) {
        case 1:
          var $JSCompiler_StaticMethods_setBC$self$$inline_429$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $value$$inline_430$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          $JSCompiler_StaticMethods_setBC$self$$inline_429$$.$g$ = $value$$inline_430$$ >> 8;
          $JSCompiler_StaticMethods_setBC$self$$inline_429$$.$f$ = $value$$inline_430$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++;
          break;
        case 2:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 3:
          var $JSCompiler_StaticMethods_incBC$self$$inline_293$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$;
          $JSCompiler_StaticMethods_incBC$self$$inline_293$$.$f$ = $JSCompiler_StaticMethods_incBC$self$$inline_293$$.$f$ + 1 & 255;
          0 == $JSCompiler_StaticMethods_incBC$self$$inline_293$$.$f$ && ($JSCompiler_StaticMethods_incBC$self$$inline_293$$.$g$ = $JSCompiler_StaticMethods_incBC$self$$inline_293$$.$g$ + 1 & 255);
          break;
        case 4:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 5:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 6:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 7:
          var $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $carry$$inline_296$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$.$a$ >> 7;
          $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$.$a$ << 1 & 255 | $carry$$inline_296$$;
          $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_295$$.$b$ & 236 | $carry$$inline_296$$;
          break;
        case 8:
          var $JSCompiler_StaticMethods_exAF$self$$inline_298$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $temp$$inline_299$$ = $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$a$;
          $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$Q$;
          $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$Q$ = $temp$$inline_299$$;
          $temp$$inline_299$$ = $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$b$;
          $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$V$;
          $JSCompiler_StaticMethods_exAF$self$$inline_298$$.$V$ = $temp$$inline_299$$;
          break;
        case 9:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 10:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 11:
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 12:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 13:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 14:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 15:
          var $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $carry$$inline_302$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$.$a$ & 1;
          $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$.$a$ >> 1 | $carry$$inline_302$$ << 7;
          $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_301$$.$b$ & 236 | $carry$$inline_302$$;
          break;
        case 16:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ - 1 & 255;
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 17:
          var $JSCompiler_StaticMethods_setDE$self$$inline_432$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $value$$inline_433$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          $JSCompiler_StaticMethods_setDE$self$$inline_432$$.$j$ = $value$$inline_433$$ >> 8;
          $JSCompiler_StaticMethods_setDE$self$$inline_432$$.$h$ = $value$$inline_433$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++;
          break;
        case 18:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 19:
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 20:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 21:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 22:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 23:
          var $JSCompiler_StaticMethods_rla_a$self$$inline_304$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $carry$$inline_305$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$a$ >> 7;
          $JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$b$ & 1) & 255;
          $JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$b$ = $JSCompiler_StaticMethods_rla_a$self$$inline_304$$.$b$ & 236 | $carry$$inline_305$$;
          break;
        case 24:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$) + 1);
          break;
        case 25:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 26:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 27:
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 28:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 29:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 30:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 31:
          var $JSCompiler_StaticMethods_rra_a$self$$inline_307$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $carry$$inline_308$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$a$ & 1;
          $JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$b$ & 1) << 7) & 255;
          $JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$b$ = $JSCompiler_StaticMethods_rra_a$self$$inline_307$$.$b$ & 236 | $carry$$inline_308$$;
          break;
        case 32:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 33:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++;
          break;
        case 34:
          $location$$inline_246$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($location$$inline_246$$++, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($location$$inline_246$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += 2;
          break;
        case 35:
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 39:
          var $JSCompiler_StaticMethods_daa$self$$inline_310$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $temp$$inline_311$$ = $JSCompiler_StaticMethods_daa$self$$inline_310$$.$Y$[$JSCompiler_StaticMethods_daa$self$$inline_310$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_310$$.$b$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_310$$.$b$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_310$$.$b$ & 16) << 6];
          $JSCompiler_StaticMethods_daa$self$$inline_310$$.$a$ = $temp$$inline_311$$ & 255;
          $JSCompiler_StaticMethods_daa$self$$inline_310$$.$b$ = $JSCompiler_StaticMethods_daa$self$$inline_310$$.$b$ & 2 | $temp$$inline_311$$ >> 8;
          break;
        case 40:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 41:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$)));
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += 2;
          break;
        case 43:
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 47:
          var $JSCompiler_StaticMethods_cpl_a$self$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$;
          $JSCompiler_StaticMethods_cpl_a$self$$inline_313$$.$a$ ^= 255;
          $JSCompiler_StaticMethods_cpl_a$self$$inline_313$$.$b$ |= 18;
          break;
        case 48:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 49:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += 2;
          break;
        case 50:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += 2;
          break;
        case 51:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$++;
          break;
        case 52:
          $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 53:
          $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 55:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ |= 1;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ &= -3;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ &= -17;
          break;
        case 56:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 57:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$));
          break;
        case 58:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$));
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ += 2;
          break;
        case 59:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$--;
          break;
        case 60:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 61:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 62:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          break;
        case 63:
          var $JSCompiler_StaticMethods_ccf$self$$inline_315$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$;
          0 != ($JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ &= -17);
          $JSCompiler_StaticMethods_ccf$self$$inline_315$$.$b$ &= -3;
          break;
        case 65:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 66:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 67:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 71:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 72:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 74:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 75:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 79:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 80:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 81:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 83:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 87:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 88:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 89:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 90:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 95:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 118:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$n$ = 0;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$H$ = !0;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$--;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 120:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$;
          break;
        case 121:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$;
          break;
        case 122:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          break;
        case 123:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$));
          break;
        case 128:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 129:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 130:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 131:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 135:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 136:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 137:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 138:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 139:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 143:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 144:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 145:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 146:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 147:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 151:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 152:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 153:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 154:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 155:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 159:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 160:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$] | 16;
          break;
        case 161:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$] | 16;
          break;
        case 162:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$] | 16;
          break;
        case 163:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$] | 16;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$))] | 16;
          break;
        case 167:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$] | 16;
          break;
        case 168:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$];
          break;
        case 169:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$];
          break;
        case 170:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$];
          break;
        case 171:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$];
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$))];
          break;
        case 175:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = 0];
          break;
        case 176:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$];
          break;
        case 177:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$];
          break;
        case 178:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$];
          break;
        case 179:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$];
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$))];
          break;
        case 183:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$];
          break;
        case 184:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$);
          break;
        case 185:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 186:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$);
          break;
        case 187:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$)));
          break;
        case 191:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 192:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 193:
          var $JSCompiler_StaticMethods_setBC$self$$inline_435$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $value$$inline_436$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$);
          $JSCompiler_StaticMethods_setBC$self$$inline_435$$.$g$ = $value$$inline_436$$ >> 8;
          $JSCompiler_StaticMethods_setBC$self$$inline_435$$.$f$ = $value$$inline_436$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ += 2;
          break;
        case 194:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 195:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          break;
        case 196:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 197:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$g$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$f$);
          break;
        case 198:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 199:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 0;
          break;
        case 200:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 201:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ += 2;
          break;
        case 202:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 203:
          var $JSCompiler_StaticMethods_doCB$self$$inline_317$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $opcode$$inline_318$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++);
          $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$n$ -= $OP_CB_STATES$$[$opcode$$inline_318$$];
          switch($opcode$$inline_318$$) {
            case 0:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 1:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 2:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 3:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 4:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 5:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 6:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 7:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 8:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 9:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 10:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 11:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 12:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 13:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 14:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 15:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 16:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 17:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 18:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 19:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 20:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 21:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 22:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 23:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 24:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 25:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 26:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 27:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 28:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 29:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 30:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 31:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 32:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 33:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 34:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 35:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 36:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 39:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 40:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 41:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 42:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 43:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 44:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 47:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 48:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 49:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 50:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 51:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 52:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 53:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 54:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 55:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 56:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$);
              break;
            case 57:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$);
              break;
            case 58:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$);
              break;
            case 59:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$);
              break;
            case 60:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$);
              break;
            case 61:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$);
              break;
            case 62:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$))));
              break;
            case 63:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$);
              break;
            case 64:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 1);
              break;
            case 65:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 1);
              break;
            case 66:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 1);
              break;
            case 67:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 1);
              break;
            case 68:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 1);
              break;
            case 69:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 1);
              break;
            case 70:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 1);
              break;
            case 71:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 1);
              break;
            case 72:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 2);
              break;
            case 73:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 2);
              break;
            case 74:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 2);
              break;
            case 75:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 2);
              break;
            case 76:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 2);
              break;
            case 77:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 2);
              break;
            case 78:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 2);
              break;
            case 79:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 2);
              break;
            case 80:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 4);
              break;
            case 81:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 4);
              break;
            case 82:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 4);
              break;
            case 83:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 4);
              break;
            case 84:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 4);
              break;
            case 85:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 4);
              break;
            case 86:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 4);
              break;
            case 87:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 4);
              break;
            case 88:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 8);
              break;
            case 89:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 8);
              break;
            case 90:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 8);
              break;
            case 91:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 8);
              break;
            case 92:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 8);
              break;
            case 93:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 8);
              break;
            case 94:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 8);
              break;
            case 95:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 8);
              break;
            case 96:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 16);
              break;
            case 97:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 16);
              break;
            case 98:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 16);
              break;
            case 99:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 16);
              break;
            case 100:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 16);
              break;
            case 101:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 16);
              break;
            case 102:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 16);
              break;
            case 103:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 16);
              break;
            case 104:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 32);
              break;
            case 105:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 32);
              break;
            case 106:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 32);
              break;
            case 107:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 32);
              break;
            case 108:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 32);
              break;
            case 109:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 32);
              break;
            case 110:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 32);
              break;
            case 111:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 32);
              break;
            case 112:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 64);
              break;
            case 113:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 64);
              break;
            case 114:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 64);
              break;
            case 115:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 64);
              break;
            case 116:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 64);
              break;
            case 117:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 64);
              break;
            case 118:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 64);
              break;
            case 119:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 64);
              break;
            case 120:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ & 128);
              break;
            case 121:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ & 128);
              break;
            case 122:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ & 128);
              break;
            case 123:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ & 128);
              break;
            case 124:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ & 128);
              break;
            case 125:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ & 128);
              break;
            case 126:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & 128);
              break;
            case 127:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$, $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ & 128);
              break;
            case 128:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -2;
              break;
            case 129:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -2;
              break;
            case 130:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -2;
              break;
            case 131:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -2;
              break;
            case 132:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -2;
              break;
            case 133:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -2;
              break;
            case 134:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -2);
              break;
            case 135:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -2;
              break;
            case 136:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -3;
              break;
            case 137:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -3;
              break;
            case 138:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -3;
              break;
            case 139:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -3;
              break;
            case 140:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -3;
              break;
            case 141:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -3;
              break;
            case 142:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -3);
              break;
            case 143:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -3;
              break;
            case 144:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -5;
              break;
            case 145:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -5;
              break;
            case 146:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -5;
              break;
            case 147:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -5;
              break;
            case 148:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -5;
              break;
            case 149:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -5;
              break;
            case 150:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -5);
              break;
            case 151:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -5;
              break;
            case 152:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -9;
              break;
            case 153:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -9;
              break;
            case 154:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -9;
              break;
            case 155:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -9;
              break;
            case 156:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -9;
              break;
            case 157:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -9;
              break;
            case 158:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -9);
              break;
            case 159:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -9;
              break;
            case 160:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -17;
              break;
            case 161:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -17;
              break;
            case 162:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -17;
              break;
            case 163:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -17;
              break;
            case 164:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -17;
              break;
            case 165:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -17;
              break;
            case 166:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -17);
              break;
            case 167:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -17;
              break;
            case 168:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -33;
              break;
            case 169:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -33;
              break;
            case 170:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -33;
              break;
            case 171:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -33;
              break;
            case 172:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -33;
              break;
            case 173:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -33;
              break;
            case 174:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -33);
              break;
            case 175:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -33;
              break;
            case 176:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -65;
              break;
            case 177:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -65;
              break;
            case 178:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -65;
              break;
            case 179:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -65;
              break;
            case 180:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -65;
              break;
            case 181:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -65;
              break;
            case 182:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -65);
              break;
            case 183:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -65;
              break;
            case 184:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ &= -129;
              break;
            case 185:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ &= -129;
              break;
            case 186:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ &= -129;
              break;
            case 187:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ &= -129;
              break;
            case 188:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ &= -129;
              break;
            case 189:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ &= -129;
              break;
            case 190:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) & -129);
              break;
            case 191:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ &= -129;
              break;
            case 192:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 1;
              break;
            case 193:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 1;
              break;
            case 194:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 1;
              break;
            case 195:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 1;
              break;
            case 196:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 1;
              break;
            case 197:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 1;
              break;
            case 198:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 1);
              break;
            case 199:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 1;
              break;
            case 200:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 2;
              break;
            case 201:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 2;
              break;
            case 202:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 2;
              break;
            case 203:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 2;
              break;
            case 204:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 2;
              break;
            case 205:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 2;
              break;
            case 206:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 2);
              break;
            case 207:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 2;
              break;
            case 208:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 4;
              break;
            case 209:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 4;
              break;
            case 210:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 4;
              break;
            case 211:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 4;
              break;
            case 212:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 4;
              break;
            case 213:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 4;
              break;
            case 214:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 4);
              break;
            case 215:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 4;
              break;
            case 216:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 8;
              break;
            case 217:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 8;
              break;
            case 218:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 8;
              break;
            case 219:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 8;
              break;
            case 220:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 8;
              break;
            case 221:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 8;
              break;
            case 222:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 8);
              break;
            case 223:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 8;
              break;
            case 224:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 16;
              break;
            case 225:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 16;
              break;
            case 226:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 16;
              break;
            case 227:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 16;
              break;
            case 228:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 16;
              break;
            case 229:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 16;
              break;
            case 230:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 16);
              break;
            case 231:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 16;
              break;
            case 232:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 32;
              break;
            case 233:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 32;
              break;
            case 234:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 32;
              break;
            case 235:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 32;
              break;
            case 236:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 32;
              break;
            case 237:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 32;
              break;
            case 238:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 32);
              break;
            case 239:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 32;
              break;
            case 240:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 64;
              break;
            case 241:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 64;
              break;
            case 242:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 64;
              break;
            case 243:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 64;
              break;
            case 244:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 64;
              break;
            case 245:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 64;
              break;
            case 246:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 64);
              break;
            case 247:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 64;
              break;
            case 248:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$g$ |= 128;
              break;
            case 249:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$f$ |= 128;
              break;
            case 250:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$j$ |= 128;
              break;
            case 251:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$h$ |= 128;
              break;
            case 252:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$k$ |= 128;
              break;
            case 253:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$i$ |= 128;
              break;
            case 254:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$), $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_317$$)) | 128);
              break;
            case 255:
              $JSCompiler_StaticMethods_doCB$self$$inline_317$$.$a$ |= 128;
              break;
            default:
              console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_318$$))
          }
          break;
        case 204:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 64));
          break;
        case 205:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ + 2);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          break;
        case 206:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 207:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 8;
          break;
        case 208:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 209:
          var $JSCompiler_StaticMethods_setDE$self$$inline_438$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $value$$inline_439$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$);
          $JSCompiler_StaticMethods_setDE$self$$inline_438$$.$j$ = $value$$inline_439$$ >> 8;
          $JSCompiler_StaticMethods_setDE$self$$inline_438$$.$h$ = $value$$inline_439$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ += 2;
          break;
        case 210:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 211:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$);
          break;
        case 212:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 213:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$);
          break;
        case 214:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 215:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 16;
          break;
        case 216:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 217:
          var $JSCompiler_StaticMethods_exBC$self$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $temp$$inline_321$$ = $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$g$;
          $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$g$ = $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$R$;
          $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$R$ = $temp$$inline_321$$;
          $temp$$inline_321$$ = $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$f$;
          $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$f$ = $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$S$;
          $JSCompiler_StaticMethods_exBC$self$$inline_320$$.$S$ = $temp$$inline_321$$;
          var $JSCompiler_StaticMethods_exDE$self$$inline_323$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $temp$$inline_324$$ = $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$j$;
          $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$T$;
          $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$T$ = $temp$$inline_324$$;
          $temp$$inline_324$$ = $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$h$;
          $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$U$;
          $JSCompiler_StaticMethods_exDE$self$$inline_323$$.$U$ = $temp$$inline_324$$;
          var $JSCompiler_StaticMethods_exHL$self$$inline_326$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $temp$$inline_327$$ = $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$k$;
          $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$k$ = $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$W$;
          $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$W$ = $temp$$inline_327$$;
          $temp$$inline_327$$ = $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$i$;
          $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$i$ = $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$X$;
          $JSCompiler_StaticMethods_exHL$self$$inline_326$$.$X$ = $temp$$inline_327$$;
          break;
        case 218:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 219:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 220:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 1));
          break;
        case 221:
          var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $opcode$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++), $location$$inline_331$$ = 0, $temp$$inline_332$$ = 0;
          $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$n$ -= $OP_DD_STATES$$[$opcode$$inline_330$$];
          switch($opcode$$inline_330$$) {
            case 9:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              break;
            case 25:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              break;
            case 33:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$ += 2;
              break;
            case 34:
              $location$$inline_331$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($location$$inline_331$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($location$$inline_331$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$ += 2;
              break;
            case 35:
              var $JSCompiler_StaticMethods_incIX$self$$inline_441$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$;
              $JSCompiler_StaticMethods_incIX$self$$inline_441$$.$p$ = $JSCompiler_StaticMethods_incIX$self$$inline_441$$.$p$ + 1 & 255;
              0 == $JSCompiler_StaticMethods_incIX$self$$inline_441$$.$p$ && ($JSCompiler_StaticMethods_incIX$self$$inline_441$$.$r$ = $JSCompiler_StaticMethods_incIX$self$$inline_441$$.$r$ + 1 & 255);
              break;
            case 36:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++);
              break;
            case 41:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              break;
            case 42:
              $location$$inline_331$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($location$$inline_331$$++);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($location$$inline_331$$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$ += 2;
              break;
            case 43:
              var $JSCompiler_StaticMethods_decIX$self$$inline_443$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$;
              $JSCompiler_StaticMethods_decIX$self$$inline_443$$.$p$ = $JSCompiler_StaticMethods_decIX$self$$inline_443$$.$p$ - 1 & 255;
              255 == $JSCompiler_StaticMethods_decIX$self$$inline_443$$.$p$ && ($JSCompiler_StaticMethods_decIX$self$$inline_443$$.$r$ = $JSCompiler_StaticMethods_decIX$self$$inline_443$$.$r$ - 1 & 255);
              break;
            case 44:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++);
              break;
            case 52:
              $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 53:
              $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 54:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 57:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$));
              break;
            case 68:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 69:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 70:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 76:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 77:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 78:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 84:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 85:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 86:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 92:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 93:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 94:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$;
              break;
            case 97:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$;
              break;
            case 98:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$;
              break;
            case 99:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$;
              break;
            case 100:
              break;
            case 101:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 102:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 103:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$;
              break;
            case 104:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$;
              break;
            case 105:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$;
              break;
            case 106:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$;
              break;
            case 107:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$;
              break;
            case 108:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 109:
              break;
            case 110:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 111:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$;
              break;
            case 112:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$g$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$f$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$j$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 115:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$h$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 116:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$k$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 117:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$i$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 119:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 124:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$;
              break;
            case 125:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$;
              break;
            case 126:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 132:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 133:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 134:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 140:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 141:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 142:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 148:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 149:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 150:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 156:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 157:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 158:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 164:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$] | 16;
              break;
            case 165:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$] | 16;
              break;
            case 166:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$))] | 16;
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 172:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$];
              break;
            case 173:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$];
              break;
            case 174:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$))];
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 180:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$];
              break;
            case 181:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$];
              break;
            case 182:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$))];
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 188:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$);
              break;
            case 189:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 190:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$++;
              break;
            case 203:
              $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$));
              break;
            case 225:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$ += 2;
              break;
            case 227:
              $temp$$inline_332$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$);
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$, $temp$$inline_332$$ & 255);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$ + 1, $temp$$inline_332$$ >> 8);
              break;
            case 229:
              $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$r$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$p$);
              break;
            case 233:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$);
              break;
            case 249:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$m$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$);
              break;
            default:
              console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_330$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_329$$.$c$--
          }
          break;
        case 222:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 223:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 24;
          break;
        case 224:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 225:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$));
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ += 2;
          break;
        case 226:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 227:
          $temp$$inline_247$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ + 1);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ + 1, $temp$$inline_247$$);
          $temp$$inline_247$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$, $temp$$inline_247$$);
          break;
        case 228:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 229:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$);
          break;
        case 230:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++)] | 16;
          break;
        case 231:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 32;
          break;
        case 232:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 234:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 235:
          $temp$$inline_247$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$k$ = $temp$$inline_247$$;
          $temp$$inline_247$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$i$ = $temp$$inline_247$$;
          break;
        case 236:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 4));
          break;
        case 237:
          var $JSCompiler_StaticMethods_doED$self$$inline_334$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $opcode$$inline_335$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$), $temp$$inline_336$$ = 0, $location$$inline_337$$ = 0;
          $JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= $OP_ED_STATES$$[$opcode$$inline_335$$];
          switch($opcode$$inline_335$$) {
            case 64:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 65:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 66:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 67:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$++, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
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
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = 0;
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
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
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$ += 2;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$C$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$D$;
              break;
            case 70:
            ;
            case 78:
            ;
            case 102:
            ;
            case 110:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$J$ = 0;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 71:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$N$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 72:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 73:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 74:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 75:
              var $JSCompiler_StaticMethods_setBC$self$$inline_445$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$, $value$$inline_446$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$));
              $JSCompiler_StaticMethods_setBC$self$$inline_445$$.$g$ = $value$$inline_446$$ >> 8;
              $JSCompiler_StaticMethods_setBC$self$$inline_445$$.$f$ = $value$$inline_446$$ & 255;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 79:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 80:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$j$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 81:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$j$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 82:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 83:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$++, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$h$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$j$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 86:
            ;
            case 118:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$J$ = 1;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 87:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$N$;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$P$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$D$ ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 88:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$h$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 89:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$h$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 90:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 91:
              var $JSCompiler_StaticMethods_setDE$self$$inline_448$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$, $value$$inline_449$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$));
              $JSCompiler_StaticMethods_setDE$self$$inline_448$$.$j$ = $value$$inline_449$$ >> 8;
              $JSCompiler_StaticMethods_setDE$self$$inline_448$$.$h$ = $value$$inline_449$$ & 255;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 95:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = Math.round(255 * Math.random());
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$P$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$D$ ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$k$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$k$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 97:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$k$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 98:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 99:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$++, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$k$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 103:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($location$$inline_337$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, $temp$$inline_336$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ & 15) << 4);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ & 240 | $temp$$inline_336$$ & 15;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 104:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 105:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 106:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 107:
              $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$)));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 111:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($location$$inline_337$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, ($temp$$inline_336$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ & 15);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ & 240 | $temp$$inline_336$$ >> 4;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, 0);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 115:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$++, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$ & 255);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($location$$inline_337$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$ >> 8);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 120:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_334$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 121:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$a$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 122:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 123:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$m$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$o$(++$JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$));
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$ += 2;
              break;
            case 160:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 161:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 0 : 4;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 248 | $temp$$inline_336$$;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 162:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 128 == ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 163:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $temp$$inline_336$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              255 < $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$ + $temp$$inline_336$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 128 == ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 168:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 169:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 0 : 4;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 248 | $temp$$inline_336$$;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 170:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 0 != ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 171:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $temp$$inline_336$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              255 < $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$ + $temp$$inline_336$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 128 == ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              break;
            case 176:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17;
              break;
            case 177:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 0 : 4;
              0 != ($temp$$inline_336$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 248 | $temp$$inline_336$$;
              break;
            case 178:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 128 == ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              break;
            case 179:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              255 < $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$ + $temp$$inline_336$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 0 != ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              break;
            case 184:
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -3;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17;
              break;
            case 185:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$)));
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              $temp$$inline_336$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_334$$) ? 0 : 4;
              0 != ($temp$$inline_336$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & 248 | $temp$$inline_336$$;
              break;
            case 186:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$), $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 0 != ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              break;
            case 187:
              $temp$$inline_336$$ = $JSCompiler_StaticMethods_doED$self$$inline_334$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_334$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$f$, $temp$$inline_336$$);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_334$$, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_334$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_334$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++;
              255 < $JSCompiler_StaticMethods_doED$self$$inline_334$$.$i$ + $temp$$inline_336$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ = 0 != ($temp$$inline_336$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_334$$.$b$ & -3;
              break;
            default:
              console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_335$$)), $JSCompiler_StaticMethods_doED$self$$inline_334$$.$c$++
          }
          break;
        case 238:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++)];
          break;
        case 239:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 40;
          break;
        case 240:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 241:
          var $JSCompiler_StaticMethods_setAF$self$$inline_339$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $value$$inline_340$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$);
          $JSCompiler_StaticMethods_setAF$self$$inline_339$$.$a$ = $value$$inline_340$$ >> 8;
          $JSCompiler_StaticMethods_setAF$self$$inline_339$$.$b$ = $value$$inline_340$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ += 2;
          break;
        case 242:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 243:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$C$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$D$ = !1;
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$I$ = !0;
          break;
        case 244:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 245:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$);
          break;
        case 246:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_245$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++)];
          break;
        case 247:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 48;
          break;
        case 248:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$m$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$);
          break;
        case 250:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 251:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$C$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$D$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$I$ = !0;
          break;
        case 252:
          $JSCompiler_StaticMethods_interpret$self$$inline_245$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$b$ & 128));
          break;
        case 253:
          var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$, $opcode$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++), $location$$inline_344$$ = void 0, $temp$$inline_345$$ = void 0;
          $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$n$ -= $OP_DD_STATES$$[$opcode$$inline_343$$];
          switch($opcode$$inline_343$$) {
            case 9:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              break;
            case 25:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              break;
            case 33:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$ += 2;
              break;
            case 34:
              $location$$inline_344$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($location$$inline_344$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($location$$inline_344$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$ += 2;
              break;
            case 35:
              var $JSCompiler_StaticMethods_incIY$self$$inline_451$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$;
              $JSCompiler_StaticMethods_incIY$self$$inline_451$$.$q$ = $JSCompiler_StaticMethods_incIY$self$$inline_451$$.$q$ + 1 & 255;
              0 == $JSCompiler_StaticMethods_incIY$self$$inline_451$$.$q$ && ($JSCompiler_StaticMethods_incIY$self$$inline_451$$.$s$ = $JSCompiler_StaticMethods_incIY$self$$inline_451$$.$s$ + 1 & 255);
              break;
            case 36:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++);
              break;
            case 41:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              break;
            case 42:
              $location$$inline_344$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($location$$inline_344$$++);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($location$$inline_344$$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$ += 2;
              break;
            case 43:
              var $JSCompiler_StaticMethods_decIY$self$$inline_453$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$;
              $JSCompiler_StaticMethods_decIY$self$$inline_453$$.$q$ = $JSCompiler_StaticMethods_decIY$self$$inline_453$$.$q$ - 1 & 255;
              255 == $JSCompiler_StaticMethods_decIY$self$$inline_453$$.$q$ && ($JSCompiler_StaticMethods_decIY$self$$inline_453$$.$s$ = $JSCompiler_StaticMethods_decIY$self$$inline_453$$.$s$ - 1 & 255);
              break;
            case 44:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++);
              break;
            case 52:
              $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 53:
              $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 54:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 57:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$));
              break;
            case 68:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 69:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 70:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 76:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 77:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 78:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 84:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 85:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 86:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 92:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 93:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 94:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$;
              break;
            case 97:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$;
              break;
            case 98:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$;
              break;
            case 99:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$;
              break;
            case 100:
              break;
            case 101:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 102:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 103:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$;
              break;
            case 104:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$;
              break;
            case 105:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$;
              break;
            case 106:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$;
              break;
            case 107:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$;
              break;
            case 108:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 109:
              break;
            case 110:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 111:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$;
              break;
            case 112:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$g$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$f$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$j$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 115:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$h$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 116:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$k$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 117:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$i$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 119:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 124:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$;
              break;
            case 125:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$;
              break;
            case 126:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 132:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 133:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 134:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 140:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 141:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 142:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 148:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 149:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 150:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 156:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 157:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 158:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 164:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$] | 16;
              break;
            case 165:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$] | 16;
              break;
            case 166:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$))] | 16;
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 172:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$];
              break;
            case 173:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$];
              break;
            case 174:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$))];
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 180:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$];
              break;
            case 181:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$];
              break;
            case 182:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$))];
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 188:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$);
              break;
            case 189:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 190:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$++;
              break;
            case 203:
              $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$));
              break;
            case 225:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$ += 2;
              break;
            case 227:
              $temp$$inline_345$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$);
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$, $temp$$inline_345$$ & 255);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$ + 1, $temp$$inline_345$$ >> 8);
              break;
            case 229:
              $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$s$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$q$);
              break;
            case 233:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$);
              break;
            case 249:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$m$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$);
              break;
            default:
              console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_343$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_342$$.$c$--
          }
          break;
        case 254:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$++));
          break;
        case 255:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_245$$.$c$ = 56
      }
      var $JSCompiler_temp$$230$$;
      if($JSCompiler_temp$$230$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$n$) {
        var $JSCompiler_StaticMethods_eol$self$$inline_250$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$;
        if($JSCompiler_StaticMethods_eol$self$$inline_250$$.$A$.$soundEnabled$) {
          var $JSCompiler_StaticMethods_updateSound$self$$inline_347$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$A$, $line$$inline_348$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$;
          0 == $line$$inline_348$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$audioBufferOffset$ = 0);
          for(var $samplesToGenerate$$inline_349$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$samplesPerLine$[$line$$inline_348$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$d$, $offset$$inline_351$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$audioBufferOffset$, $buffer$$inline_352$$ = [], $sample$$inline_353$$ = 0, $i$$inline_354$$ = 0;$sample$$inline_353$$ < $samplesToGenerate$$inline_349$$;$sample$$inline_353$$++) {
            for($i$$inline_354$$ = 0;3 > $i$$inline_354$$;$i$$inline_354$$++) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[$i$$inline_354$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$g$[$i$$inline_354$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$b$[($i$$inline_354$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$g$[$i$$inline_354$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$b$[($i$$inline_354$$ << 
              1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[$i$$inline_354$$]
            }
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ & 1) << 1;
            var $output$$inline_355$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$i$[3];
            127 < $output$$inline_355$$ ? $output$$inline_355$$ = 127 : -128 > $output$$inline_355$$ && ($output$$inline_355$$ = -128);
            $buffer$$inline_352$$[$offset$$inline_351$$ + $sample$$inline_353$$] = $output$$inline_355$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$e$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$j$;
            var $clockCycles$$inline_356$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$e$ >> 8, $clockCyclesScaled$$inline_357$$ = $clockCycles$$inline_356$$ << 8;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$e$ -= $clockCyclesScaled$$inline_357$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[0] -= $clockCycles$$inline_356$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[1] -= $clockCycles$$inline_356$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[2] -= $clockCycles$$inline_356$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$h$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[3] - $clockCycles$$inline_356$$;
            for($i$$inline_354$$ = 0;3 > $i$$inline_354$$;$i$$inline_354$$++) {
              var $counter$$inline_358$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[$i$$inline_354$$];
              if(0 >= $counter$$inline_358$$) {
                var $tone$$inline_359$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$b$[$i$$inline_354$$ << 1];
                6 < $tone$$inline_359$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$g$[$i$$inline_354$$] = ($clockCyclesScaled$$inline_357$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$e$ + 512 * $counter$$inline_358$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[$i$$inline_354$$] / ($clockCyclesScaled$$inline_357$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$e$), 
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[$i$$inline_354$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[$i$$inline_354$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[$i$$inline_354$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$g$[$i$$inline_354$$] = $NO_ANTIALIAS$$);
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[$i$$inline_354$$] += $tone$$inline_359$$ * ($clockCycles$$inline_356$$ / $tone$$inline_359$$ + 1)
              }else {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$g$[$i$$inline_354$$] = $NO_ANTIALIAS$$
              }
            }
            if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$h$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$h$ * 
            ($clockCycles$$inline_356$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$h$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$d$[3])) {
              var $feedback$$inline_360$$ = 0, $feedback$$inline_360$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ & 1;
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_350$$.$f$ >> 1 | $feedback$$inline_360$$ << 15
            }
          }
          $JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$audioBuffer$ = $buffer$$inline_352$$;
          $JSCompiler_StaticMethods_updateSound$self$$inline_347$$.$audioBufferOffset$ += $samplesToGenerate$$inline_349$$
        }
        $JSCompiler_StaticMethods_eol$self$$inline_250$$.$O$.$l$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$;
        if(192 > $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$) {
          var $JSCompiler_StaticMethods_drawLine$self$$inline_362$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$O$, $lineno$$inline_363$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$, $i$$inline_364$$ = 0, $temp$$inline_365$$ = 0, $temp2$$inline_366$$ = 0;
          if(!$JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$h$.$is_gg$ || !(24 > $lineno$$inline_363$$ || 168 <= $lineno$$inline_363$$)) {
            if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[1] & 64)) {
              if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$m$) {
                console.log("[" + $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$l$ + "] min dirty:" + $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$o$ + " max: " + $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$m$);
                for(var $i$$inline_367$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$o$;$i$$inline_367$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$m$;$i$$inline_367$$++) {
                  if($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$v$[$i$$inline_367$$]) {
                    $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$v$[$i$$inline_367$$] = !1;
                    console.log("tile " + $i$$inline_367$$ + " is dirty");
                    for(var $tile$$inline_368$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$t$[$i$$inline_367$$], $pixel_index$$inline_369$$ = 0, $address$$inline_370$$ = $i$$inline_367$$ << 5, $y$$inline_371$$ = 0;8 > $y$$inline_371$$;$y$$inline_371$$++) {
                      for(var $address0$$inline_372$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_370$$++], $address1$$inline_373$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_370$$++], $address2$$inline_374$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_370$$++], $address3$$inline_375$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_370$$++], $bit$$inline_376$$ = 128;0 != 
                      $bit$$inline_376$$;$bit$$inline_376$$ >>= 1) {
                        var $colour$$inline_377$$ = 0;
                        0 != ($address0$$inline_372$$ & $bit$$inline_376$$) && ($colour$$inline_377$$ |= 1);
                        0 != ($address1$$inline_373$$ & $bit$$inline_376$$) && ($colour$$inline_377$$ |= 2);
                        0 != ($address2$$inline_374$$ & $bit$$inline_376$$) && ($colour$$inline_377$$ |= 4);
                        0 != ($address3$$inline_375$$ & $bit$$inline_376$$) && ($colour$$inline_377$$ |= 8);
                        $tile$$inline_368$$[$pixel_index$$inline_369$$++] = $colour$$inline_377$$
                      }
                    }
                  }
                }
                $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$o$ = 512;
                $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$m$ = -1
              }
              var $pixX$$inline_378$$ = 0, $colour$$inline_379$$ = 0, $temp$$inline_380$$ = 0, $temp2$$inline_381$$ = 0, $hscroll$$inline_382$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[8], $vscroll$$inline_383$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[9];
              16 > $lineno$$inline_363$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[0] & 64) && ($hscroll$$inline_382$$ = 0);
              var $lock$$inline_384$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[0] & 128, $tile_column$$inline_385$$ = 32 - ($hscroll$$inline_382$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$s$, $tile_row$$inline_386$$ = $lineno$$inline_363$$ + $vscroll$$inline_383$$ >> 3;
              27 < $tile_row$$inline_386$$ && ($tile_row$$inline_386$$ -= 28);
              for(var $tile_y$$inline_387$$ = ($lineno$$inline_363$$ + ($vscroll$$inline_383$$ & 7) & 7) << 3, $row_precal$$inline_388$$ = $lineno$$inline_363$$ << 8, $tx$$inline_389$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$s$;$tx$$inline_389$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$u$;$tx$$inline_389$$++) {
                var $tile_props$$inline_390$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$F$ + (($tile_column$$inline_385$$ & 31) << 1) + ($tile_row$$inline_386$$ << 6), $secondbyte$$inline_391$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$tile_props$$inline_390$$ + 1], $pal$$inline_392$$ = ($secondbyte$$inline_391$$ & 8) << 1, $sx$$inline_393$$ = ($tx$$inline_389$$ << 3) + ($hscroll$$inline_382$$ & 7), $pixY$$inline_394$$ = 0 == ($secondbyte$$inline_391$$ & 4) ? $tile_y$$inline_387$$ : 
                56 - $tile_y$$inline_387$$, $tile$$inline_395$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$t$[($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$tile_props$$inline_390$$] & 255) + (($secondbyte$$inline_391$$ & 1) << 8)];
                if(0 == ($secondbyte$$inline_391$$ & 2)) {
                  for($pixX$$inline_378$$ = 0;8 > $pixX$$inline_378$$ && 256 > $sx$$inline_393$$;$pixX$$inline_378$$++, $sx$$inline_393$$++) {
                    $colour$$inline_379$$ = $tile$$inline_395$$[$pixX$$inline_378$$ + $pixY$$inline_394$$], $temp$$inline_380$$ = 4 * ($sx$$inline_393$$ + $row_precal$$inline_388$$), $temp2$$inline_381$$ = 3 * ($colour$$inline_379$$ + $pal$$inline_392$$), $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$p$[$sx$$inline_393$$] = 0 != ($secondbyte$$inline_391$$ & 16) && 0 != $colour$$inline_379$$, $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$], 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$ + 2]
                  }
                }else {
                  for($pixX$$inline_378$$ = 7;0 <= $pixX$$inline_378$$ && 256 > $sx$$inline_393$$;$pixX$$inline_378$$--, $sx$$inline_393$$++) {
                    $colour$$inline_379$$ = $tile$$inline_395$$[$pixX$$inline_378$$ + $pixY$$inline_394$$], $temp$$inline_380$$ = 4 * ($sx$$inline_393$$ + $row_precal$$inline_388$$), $temp2$$inline_381$$ = 3 * ($colour$$inline_379$$ + $pal$$inline_392$$), $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$p$[$sx$$inline_393$$] = 0 != ($secondbyte$$inline_391$$ & 16) && 0 != $colour$$inline_379$$, $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$], 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_380$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_381$$ + 2]
                  }
                }
                $tile_column$$inline_385$$++;
                0 != $lock$$inline_384$$ && 23 == $tx$$inline_389$$ && ($tile_row$$inline_386$$ = $lineno$$inline_363$$ >> 3, $tile_y$$inline_387$$ = ($lineno$$inline_363$$ & 7) << 3)
              }
              if($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$k$) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$k$ = !1;
                for(var $i$$inline_396$$ = 0;$i$$inline_396$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$n$.length;$i$$inline_396$$++) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$n$[$i$$inline_396$$][0] = 0
                }
                var $height$$inline_397$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[1] & 2) ? 8 : 16;
                1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[1] & 1) && ($height$$inline_397$$ <<= 1);
                for(var $spriteno$$inline_398$$ = 0;64 > $spriteno$$inline_398$$;$spriteno$$inline_398$$++) {
                  var $y$$inline_399$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$g$ + $spriteno$$inline_398$$] & 255;
                  if(208 == $y$$inline_399$$) {
                    break
                  }
                  $y$$inline_399$$++;
                  240 < $y$$inline_399$$ && ($y$$inline_399$$ -= 256);
                  for(var $lineno$$inline_400$$ = $y$$inline_399$$;192 > $lineno$$inline_400$$;$lineno$$inline_400$$++) {
                    if($lineno$$inline_400$$ - $y$$inline_399$$ < $height$$inline_397$$) {
                      var $sprites$$inline_401$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$n$[$lineno$$inline_400$$];
                      if(!$sprites$$inline_401$$ || 8 <= $sprites$$inline_401$$[0]) {
                        break
                      }
                      var $off$$inline_402$$ = 3 * $sprites$$inline_401$$[0] + 1, $address$$inline_403$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$g$ + ($spriteno$$inline_398$$ << 1) + 128;
                      $sprites$$inline_401$$[$off$$inline_402$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_403$$++] & 255;
                      $sprites$$inline_401$$[$off$$inline_402$$++] = $y$$inline_399$$;
                      $sprites$$inline_401$$[$off$$inline_402$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$d$[$address$$inline_403$$] & 255;
                      $sprites$$inline_401$$[0]++
                    }
                  }
                }
              }
              if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$n$[$lineno$$inline_363$$][0]) {
                for(var $colour$$inline_404$$ = 0, $temp$$inline_405$$ = 0, $temp2$$inline_406$$ = 0, $i$$inline_407$$ = 0, $sprites$$inline_408$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$n$[$lineno$$inline_363$$], $count$$inline_409$$ = Math.min(8, $sprites$$inline_408$$[0]), $zoomed$$inline_410$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[1] & 1, $row_precal$$inline_411$$ = $lineno$$inline_363$$ << 8, $off$$inline_412$$ = 3 * $count$$inline_409$$;$i$$inline_407$$ < 
                $count$$inline_409$$;$i$$inline_407$$++) {
                  var $n$$inline_413$$ = $sprites$$inline_408$$[$off$$inline_412$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[6] & 4) << 6, $y$$inline_414$$ = $sprites$$inline_408$$[$off$$inline_412$$--], $x$$inline_415$$ = $sprites$$inline_408$$[$off$$inline_412$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[0] & 8), $tileRow$$inline_416$$ = $lineno$$inline_363$$ - $y$$inline_414$$ >> $zoomed$$inline_410$$;
                  0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[1] & 2) && ($n$$inline_413$$ &= -2);
                  var $tile$$inline_417$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$t$[$n$$inline_413$$ + (($tileRow$$inline_416$$ & 8) >> 3)], $pix$$inline_418$$ = 0;
                  0 > $x$$inline_415$$ && ($pix$$inline_418$$ = -$x$$inline_415$$, $x$$inline_415$$ = 0);
                  var $offset$$inline_419$$ = $pix$$inline_418$$ + (($tileRow$$inline_416$$ & 7) << 3);
                  if(0 == $zoomed$$inline_410$$) {
                    for(;8 > $pix$$inline_418$$ && 256 > $x$$inline_415$$;$pix$$inline_418$$++, $x$$inline_415$$++) {
                      $colour$$inline_404$$ = $tile$$inline_417$$[$offset$$inline_419$$++], 0 == $colour$$inline_404$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$p$[$x$$inline_415$$] || ($temp$$inline_405$$ = 4 * ($x$$inline_415$$ + $row_precal$$inline_411$$), $temp2$$inline_406$$ = 3 * ($colour$$inline_404$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 
                      1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 2])
                    }
                  }else {
                    for(;8 > $pix$$inline_418$$ && 256 > $x$$inline_415$$;$pix$$inline_418$$++, $x$$inline_415$$ += 2) {
                      $colour$$inline_404$$ = $tile$$inline_417$$[$offset$$inline_419$$++], 0 == $colour$$inline_404$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$p$[$x$$inline_415$$] || ($temp$$inline_405$$ = 4 * ($x$$inline_415$$ + $row_precal$$inline_411$$), $temp2$$inline_406$$ = 3 * ($colour$$inline_404$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 
                      1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 2]), 0 == $colour$$inline_404$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$p$[$x$$inline_415$$ + 1] || ($temp$$inline_405$$ = 4 * ($x$$inline_415$$ + $row_precal$$inline_411$$ + 1), $temp2$$inline_406$$ = 3 * 
                      ($colour$$inline_404$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_405$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_406$$ + 
                      2])
                    }
                  }
                }
                8 <= $sprites$$inline_408$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$f$ |= 64)
              }
              if($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$h$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[0] & 32)) {
                for($temp$$inline_365$$ = 4 * ($lineno$$inline_363$$ << 8), $temp2$$inline_366$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[7] & 15) + 16), $i$$inline_364$$ = 0;8 > $i$$inline_364$$;$i$$inline_364$$++) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_365$$ + $i$$inline_364$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_366$$], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_365$$ + $i$$inline_364$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_366$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$temp$$inline_365$$ + $i$$inline_364$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp2$$inline_366$$ + 
                  2]
                }
              }
            }else {
              for(var $row_precal$$inline_420$$ = $lineno$$inline_363$$ << 8, $length$$inline_421$$ = 4 * ($row_precal$$inline_420$$ + 1024), $temp$$inline_422$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$c$[7] & 15) + 16), $row_precal$$inline_420$$ = 4 * $row_precal$$inline_420$$;$row_precal$$inline_420$$ < $length$$inline_421$$;$row_precal$$inline_420$$ += 4) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$row_precal$$inline_420$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp$$inline_422$$], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$row_precal$$inline_420$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp$$inline_422$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$b$[$row_precal$$inline_420$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_362$$.$a$[$temp$$inline_422$$ + 
                2]
              }
            }
          }
        }
        var $JSCompiler_StaticMethods_interrupts$self$$inline_424$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$O$, $lineno$$inline_425$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$;
        192 >= $lineno$$inline_425$$ ? (0 == $JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$q$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$f$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$q$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$f$ & 4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$c$[0] & 
        16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$h$.$a$.$B$ = !0)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$f$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$c$[1] & 32) && 224 > $lineno$$inline_425$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_424$$.$h$.$a$.$B$ = !0));
        $JSCompiler_StaticMethods_eol$self$$inline_250$$.$B$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eol$self$$inline_250$$);
        $JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$++;
        if($JSCompiler_StaticMethods_eol$self$$inline_250$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_250$$.$A$.$no_of_scanlines$) {
          var $JSCompiler_StaticMethods_eof$self$$inline_427$$ = $JSCompiler_StaticMethods_eol$self$$inline_250$$;
          $JSCompiler_StaticMethods_eof$self$$inline_427$$.$A$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_427$$.$D$ = $JSCompiler_StaticMethods_eof$self$$inline_427$$.$C$, $JSCompiler_StaticMethods_eof$self$$inline_427$$.$C$ = !1, $JSCompiler_StaticMethods_eof$self$$inline_427$$.$H$ && ($JSCompiler_StaticMethods_eof$self$$inline_427$$.$c$++, $JSCompiler_StaticMethods_eof$self$$inline_427$$.$H$ = !1), $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_eof$self$$inline_427$$, 
          $JSCompiler_StaticMethods_eof$self$$inline_427$$.$c$), $JSCompiler_StaticMethods_eof$self$$inline_427$$.$c$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_427$$.$n$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_427$$.$A$.$pause_button$ = !1);
          $JSCompiler_temp$$230$$ = !0
        }else {
          $JSCompiler_StaticMethods_eol$self$$inline_250$$.$n$ += $JSCompiler_StaticMethods_eol$self$$inline_250$$.$A$.$cyclesPerLine$, $JSCompiler_temp$$230$$ = !1
        }
      }
      if($JSCompiler_temp$$230$$) {
        break
      }
    }
    this.$fpsFrameCount$++;
    this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen)
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$21$$, $fileName$$) {
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1, $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ = $data$$21$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ ? (this.$is_sms$ = !0, this.$is_gg$ = !1, this.$c$.$s$ = 0, this.$c$.$u$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ && (this.$is_gg$ = !0, this.$is_sms$ = !1, this.$c$.$s$ = 5, this.$c$.$u$ = 27);
  if(16384 >= $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$) {
    return!1
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = $data$$21$$;
  0 != $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.substr(512), $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ -= 512);
  var $i$$inline_35$$, $j$$inline_36$$, $number_of_pages$$inline_37$$ = Math.round($i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ / 16384), $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ = Array($number_of_pages$$inline_37$$);
  for($i$$inline_35$$ = 0;$i$$inline_35$$ < $number_of_pages$$inline_37$$;$i$$inline_35$$++) {
    if($i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$[$i$$inline_35$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$[$i$$inline_35$$].setUint8($j$$inline_36$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.charCodeAt(16384 * $i$$inline_35$$ + $j$$inline_36$$))
      }
    }else {
      for($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$[$i$$inline_35$$][$j$$inline_36$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.charCodeAt(16384 * $i$$inline_35$$ + $j$$inline_36$$) & 255
      }
    }
  }
  if(null == $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$) {
    return!1
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = this.$a$;
  $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$ = $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$L$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$L$ - 1;
    for($i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ = 0;3 > $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$;$i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$frameReg$[$i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$] = $i$$inline_42_pages$$inline_38_size$$11_size$$inline_34$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$L$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$L$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$romPageMask$ = 0
  }
  return!0
}};
var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
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
  this.$A$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
  this.$O$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$c$;
  this.$t$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$f$;
  this.$J$ = this.$m$ = this.$c$ = 0;
  this.$B$ = this.$I$ = this.$H$ = this.$D$ = this.$C$ = !1;
  this.$n$ = this.$V$ = this.$b$ = this.$N$ = this.$s$ = this.$q$ = this.$r$ = this.$p$ = this.$X$ = this.$W$ = this.$i$ = this.$k$ = this.$U$ = this.$T$ = this.$h$ = this.$j$ = this.$S$ = this.$R$ = this.$f$ = this.$g$ = this.$Q$ = this.$a$ = this.$K$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$L$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$Y$ = Array(2048);
  this.$P$ = Array(256);
  this.$l$ = Array(256);
  this.$G$ = Array(256);
  this.$F$ = Array(256);
  this.$w$ = Array(131072);
  this.$v$ = Array(131072);
  this.$M$ = Array(256);
  var $c$$inline_74_padc$$inline_65_sf$$inline_59$$, $h$$inline_75_psub$$inline_66_zf$$inline_60$$, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$, $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$, $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$, $flags$$inline_254_newval$$inline_70$$;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;256 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0 != ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128) ? 128 : 0, $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 64 : 0, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 32, $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 
    8, $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$) ? 4 : 0, this.$P$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$, this.$l$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ | $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$, this.$G$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$, 
    this.$G$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 128 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$G$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 0 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | 
    $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ | 2, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 127 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 15 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$M$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 
    $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128 : 68, this.$M$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ | 16
  }
  $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;
  $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 65536;
  $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;
  $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 65536;
  for($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ = 0;256 > $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$;$JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$++) {
    for($flags$$inline_254_newval$$inline_70$$ = 0;256 > $flags$$inline_254_newval$$inline_70$$;$flags$$inline_254_newval$$inline_70$$++) {
      $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = $flags$$inline_254_newval$$inline_70$$ - $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$, this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $flags$$inline_254_newval$$inline_70$$ ? 0 != ($flags$$inline_254_newval$$inline_70$$ & 128) ? 128 : 0 : 64, this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $flags$$inline_254_newval$$inline_70$$ & 40, ($flags$$inline_254_newval$$inline_70$$ & 
      15) < ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 16), $flags$$inline_254_newval$$inline_70$$ < $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ 
      $flags$$inline_254_newval$$inline_70$$) & 128) && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 4), $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++, $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = $flags$$inline_254_newval$$inline_70$$ - $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ - 1, this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] = 0 != $flags$$inline_254_newval$$inline_70$$ ? 0 != ($flags$$inline_254_newval$$inline_70$$ & 
      128) ? 128 : 0 : 64, this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= $flags$$inline_254_newval$$inline_70$$ & 40, ($flags$$inline_254_newval$$inline_70$$ & 15) <= ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 16), $flags$$inline_254_newval$$inline_70$$ <= $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 1), 0 != (($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ 
      $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ $flags$$inline_254_newval$$inline_70$$) & 128) && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 4), $c$$inline_74_padc$$inline_65_sf$$inline_59$$++, $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ - $flags$$inline_254_newval$$inline_70$$, this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] = 
      0 != $flags$$inline_254_newval$$inline_70$$ ? 0 != ($flags$$inline_254_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= $flags$$inline_254_newval$$inline_70$$ & 40, ($flags$$inline_254_newval$$inline_70$$ & 15) > ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 16), $flags$$inline_254_newval$$inline_70$$ > $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ && 
      (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 1), 0 != (($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_254_newval$$inline_70$$) & 128) && (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 4), $h$$inline_75_psub$$inline_66_zf$$inline_60$$++, $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ - 
      $flags$$inline_254_newval$$inline_70$$ - 1, this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] = 0 != $flags$$inline_254_newval$$inline_70$$ ? 0 != ($flags$$inline_254_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= $flags$$inline_254_newval$$inline_70$$ & 40, ($flags$$inline_254_newval$$inline_70$$ & 15) >= ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 
      16), $flags$$inline_254_newval$$inline_70$$ >= $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 1), 0 != (($JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_254_newval$$inline_70$$) & 128) && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 4), $n$$inline_76_psbc$$inline_67_yf$$inline_61$$++
    }
  }
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 256;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$--;) {
    for($c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0;1 >= $c$$inline_74_padc$$inline_65_sf$$inline_59$$;$c$$inline_74_padc$$inline_65_sf$$inline_59$$++) {
      for($h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;1 >= $h$$inline_75_psub$$inline_66_zf$$inline_60$$;$h$$inline_75_psub$$inline_66_zf$$inline_60$$++) {
        for($n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 0;1 >= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$;$n$$inline_76_psbc$$inline_67_yf$$inline_61$$++) {
          $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$ = this.$Y$;
          $JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ << 8 | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 9 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 10 | $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          $flags$$inline_254_newval$$inline_70$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 1 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 4;
          this.$a$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          this.$b$ = $flags$$inline_254_newval$$inline_70$$;
          var $a_copy$$inline_255$$ = this.$a$, $correction$$inline_256$$ = 0, $carry$$inline_257$$ = $flags$$inline_254_newval$$inline_70$$ & 1, $carry_copy$$inline_258$$ = $carry$$inline_257$$;
          if(0 != ($flags$$inline_254_newval$$inline_70$$ & 16) || 9 < ($a_copy$$inline_255$$ & 15)) {
            $correction$$inline_256$$ |= 6
          }
          if(1 == $carry$$inline_257$$ || 159 < $a_copy$$inline_255$$ || 143 < $a_copy$$inline_255$$ && 9 < ($a_copy$$inline_255$$ & 15)) {
            $correction$$inline_256$$ |= 96, $carry_copy$$inline_258$$ = 1
          }
          153 < $a_copy$$inline_255$$ && ($carry_copy$$inline_258$$ = 1);
          0 != ($flags$$inline_254_newval$$inline_70$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_256$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_256$$);
          $flags$$inline_254_newval$$inline_70$$ = this.$b$ & 254 | $carry_copy$$inline_258$$;
          $flags$$inline_254_newval$$inline_70$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_254_newval$$inline_70$$ & 251 | 4 : $flags$$inline_254_newval$$inline_70$$ & 251;
          $JSCompiler_temp_const$$232_val$$inline_68_xf$$inline_62$$[$JSCompiler_temp_const$$231_oldval$$inline_69_pf$$inline_63$$] = this.$a$ | $flags$$inline_254_newval$$inline_70$$ << 8
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
  this.$L$ = 2;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;4 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    this.$frameReg$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ % 3
  }
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$c$ = this.$V$ = this.$b$ = this.$N$ = this.$q$ = this.$s$ = this.$p$ = this.$r$ = this.$k$ = this.$i$ = this.$W$ = this.$X$ = this.$j$ = this.$h$ = this.$T$ = this.$U$ = this.$g$ = this.$f$ = this.$R$ = this.$S$ = this.$a$ = this.$Q$ = 0;
  this.$m$ = 57328;
  this.$J$ = this.$n$ = 0;
  this.$I$ = this.$D$ = this.$C$ = !1;
  this.$K$ = 0;
  this.$H$ = !1
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$c$ + 2), this.$c$ = this.$o$(this.$c$), this.$n$ -= 7) : this.$c$ += 2
}, $e$:$SUPPORT_DATAVIEW$$ ? function($address$$, $value$$65$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setInt8($address$$ & 8191, $value$$65$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$65$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$65$$ & this.$romPageMask$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$65$$ & this.$romPageMask$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$65$$ & this.$romPageMask$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$), $JSSMS$Utils$toHex$$($address$$ & 8191));
    debugger
  }
} : function($address$$1$$, $value$$66$$) {
  if(65535 >= $address$$1$$) {
    this.$memWriteMap$[$address$$1$$ & 8191] = $value$$66$$, 65532 == $address$$1$$ ? this.$frameReg$[3] = $value$$66$$ : 65533 == $address$$1$$ ? this.$frameReg$[0] = $value$$66$$ & this.$romPageMask$ : 65534 == $address$$1$$ ? this.$frameReg$[1] = $value$$66$$ & this.$romPageMask$ : 65535 == $address$$1$$ && (this.$frameReg$[2] = $value$$66$$ & this.$romPageMask$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$1$$), $JSSMS$Utils$toHex$$($address$$1$$ & 8191));
    debugger
  }
}, $d$:$SUPPORT_DATAVIEW$$ ? function($address$$2$$) {
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
}, $o$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
  if(1024 > $address$$4$$) {
    return this.$rom$[0].getUint16($address$$4$$, !0)
  }
  if(16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0]].getUint16($address$$4$$, !0)
  }
  if(32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1]].getUint16($address$$4$$ - 16384, !0)
  }
  if(49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$4$$ - 32768, !0)
  }
  if(57344 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 49152, !0)
  }
  if(65532 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 57344, !0)
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
  return $JSCompiler_StaticMethods_d_$self$$.$d$($JSCompiler_StaticMethods_d_$self$$.$c$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$64$$) {
  var $parity$$ = !0, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$64$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$63$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$63$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$b$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$63$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$63$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$k$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$i$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$62$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$62$$ + ($JSCompiler_StaticMethods_adc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$b$ = ($hl$$ ^ $result$$1$$ ^ $value$$62$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$62$$ ^ $hl$$ ^ 32768) & ($value$$62$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$k$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$i$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$61$$) {
  var $result$$ = $reg$$ + $value$$61$$;
  $JSCompiler_StaticMethods_add16$self$$.$b$ = $JSCompiler_StaticMethods_add16$self$$.$b$ & 196 | ($reg$$ ^ $result$$ ^ $value$$61$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$60$$) {
  $value$$60$$ = $value$$60$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$b$ = $JSCompiler_StaticMethods_dec8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$F$[$value$$60$$];
  return $value$$60$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$59$$) {
  $value$$59$$ = $value$$59$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$b$ = $JSCompiler_StaticMethods_inc8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$G$[$value$$59$$];
  return $value$$59$$
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
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$58$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$s$ = $value$$58$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$q$ = $value$$58$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$57$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$r$ = $value$$57$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$p$ = $value$$57$$ & 255
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
  $JSCompiler_StaticMethods_bit$self$$.$b$ = $JSCompiler_StaticMethods_bit$self$$.$b$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$M$[$mask$$5$$]
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
  $JSCompiler_StaticMethods_interrupt$self$$.$C$ && !$JSCompiler_StaticMethods_interrupt$self$$.$I$ && ($JSCompiler_StaticMethods_interrupt$self$$.$H$ && ($JSCompiler_StaticMethods_interrupt$self$$.$c$++, $JSCompiler_StaticMethods_interrupt$self$$.$H$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$C$ = $JSCompiler_StaticMethods_interrupt$self$$.$D$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$B$ = !1, $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$, $JSCompiler_StaticMethods_interrupt$self$$.$c$), 
  0 == $JSCompiler_StaticMethods_interrupt$self$$.$J$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$.$K$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$.$K$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$K$, $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$.$J$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.$o$(($JSCompiler_StaticMethods_interrupt$self$$.$N$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$K$), $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 19))
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$u$:[]};
function $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_peepholePortIn$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_peepholePortIn$self$$.$A$.$is_gg$ && 7 > $port$$1$$) {
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
  if($JSCompiler_StaticMethods_peepholePortOut$self$$.$A$.$is_gg$ && 7 > $port$$) {
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
      if($JSCompiler_StaticMethods_peepholePortOut$self$$.$A$.$soundEnabled$) {
        return"this.psg.write(this.a);"
      }
  }
  return""
}
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$12$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$12$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint16($address$$12$$ & 16383, !0) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14][$address$$12$$ & 16383] & 
  255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14][$address$$12$$ & 16383] & 255) << 8
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$11$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14].getUint8($address$$11$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14][$address$$11$$ & 16383] & 255
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self$$, $index$$45$$, $address$$9_address$$inline_85$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_86$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_85$$, $code$$6_code$$inline_90_offset$$16$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcodesArray$$inline_87_operand$$2$$ = "", $inst$$inline_88_location$$28$$ = 0;
  $address$$9_address$$inline_85$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + ",BC";
      $code$$6_code$$inline_90_offset$$16$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + ",DE";
      $code$$6_code$$inline_90_offset$$16$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.set" + $index$$45$$ + "(" + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 34:
      $inst$$inline_88_location$$28$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($inst$$inline_88_location$$28$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $opcodesArray$$inline_87_operand$$2$$ + ")," + $index$$45$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(" + $opcodesArray$$inline_87_operand$$2$$ + ", this." + $index$$45$$.toLowerCase() + "L);this.writeMem(" + $JSSMS$Utils$toHex$$($inst$$inline_88_location$$28$$ + 1) + ", this." + $index$$45$$.toLowerCase() + "H);";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$45$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.inc" + $index$$45$$ + "();";
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
      $inst$$inline_88_location$$28$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + " (" + $JSSMS$Utils$toHex$$($inst$$inline_88_location$$28$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.ixL = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_88_location$$28$$) + ");this.ixH = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_88_location$$28$$ + 1) + ");";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$45$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.dec" + $index$$45$$ + "();";
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
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "INC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.incMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 53:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "DEC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.decMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 54:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$ + 1));
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", " + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 57:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + " SP";
      $code$$6_code$$inline_90_offset$$16$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$45$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$45$$ + "L *";
      break;
    case 70:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD B,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.b = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$45$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$45$$ + "L *";
      break;
    case 78:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD C,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.c = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$45$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$45$$ + "L *";
      break;
    case 86:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD D,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.d = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$45$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$45$$ + "L *";
      break;
    case 94:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD E,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.e = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
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
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD H,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.h = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
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
      $code$$6_code$$inline_90_offset$$16$$ = "";
      break;
    case 110:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD L,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.l = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,A *";
      $code$$6_code$$inline_90_offset$$16$$ = "this." + $index$$45$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),B";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.b);";
      $address$$9_address$$inline_85$$++;
      break;
    case 113:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),C";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.c);";
      $address$$9_address$$inline_85$$++;
      break;
    case 114:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),D";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.d);";
      $address$$9_address$$inline_85$$++;
      break;
    case 115:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),E";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.e);";
      $address$$9_address$$inline_85$$++;
      break;
    case 116:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),H";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.h);";
      $address$$9_address$$inline_85$$++;
      break;
    case 117:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),L";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.l);";
      $address$$9_address$$inline_85$$++;
      break;
    case 119:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "),A";
      $code$$6_code$$inline_90_offset$$16$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ", this.a);";
      $address$$9_address$$inline_85$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$45$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$45$$ + "L *";
      break;
    case 126:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.a = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$45$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$45$$ + "L *";
      break;
    case 134:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.add_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$45$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$45$$ + "L *";
      break;
    case 142:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.adc_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$45$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$45$$ + "L *";
      break;
    case 150:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SUB A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.sub_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$45$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$45$$ + "L *";
      break;
    case 158:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SBC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.sbc_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$45$$ + "H *";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$45$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$45$$ + "L *";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$45$$.toLowerCase() + "L];";
      break;
    case 166:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "AND A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")] | F_HALFCARRY;";
      $address$$9_address$$inline_85$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$45$$ + "H*";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$45$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$45$$ + "L*";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$45$$.toLowerCase() + "L];";
      break;
    case 174:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "XOR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$45$$ + "H*";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$45$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$45$$ + "L*";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$45$$.toLowerCase() + "L];";
      break;
    case 182:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "OR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$45$$ + "H *";
      $code$$6_code$$inline_90_offset$$16$$ = "this.cp_a(this." + $index$$45$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$45$$ + "L *";
      $code$$6_code$$inline_90_offset$$16$$ = "this.cp_a(this." + $index$$45$$.toLowerCase() + "L);";
      break;
    case 190:
      $code$$6_code$$inline_90_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "CP (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "))";
      $code$$6_code$$inline_90_offset$$16$$ = "this.cp_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($code$$6_code$$inline_90_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 203:
      $inst$$3_opcode$$inline_86$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = [$inst$$3_opcode$$inline_86$$];
      $inst$$inline_88_location$$28$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$6_code$$inline_90_offset$$16$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_85$$++;
      switch($inst$$3_opcode$$inline_86$$) {
        case 0:
          $inst$$inline_88_location$$28$$ = "LD B,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_88_location$$28$$ = "LD C,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_88_location$$28$$ = "LD D,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_88_location$$28$$ = "LD E,RLC (" + $index$$45$$ + ")";
          break;
        case 4:
          $inst$$inline_88_location$$28$$ = "LD H,RLC (" + $index$$45$$ + ")";
          break;
        case 5:
          $inst$$inline_88_location$$28$$ = "LD L,RLC (" + $index$$45$$ + ")";
          break;
        case 6:
          $inst$$inline_88_location$$28$$ = "RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_88_location$$28$$ = "LD A,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_88_location$$28$$ = "LD B,RRC (" + $index$$45$$ + ")";
          break;
        case 9:
          $inst$$inline_88_location$$28$$ = "LD C,RRC (" + $index$$45$$ + ")";
          break;
        case 10:
          $inst$$inline_88_location$$28$$ = "LD D,RRC (" + $index$$45$$ + ")";
          break;
        case 11:
          $inst$$inline_88_location$$28$$ = "LD E,RRC (" + $index$$45$$ + ")";
          break;
        case 12:
          $inst$$inline_88_location$$28$$ = "LD H,RRC (" + $index$$45$$ + ")";
          break;
        case 13:
          $inst$$inline_88_location$$28$$ = "LD L,RRC (" + $index$$45$$ + ")";
          break;
        case 14:
          $inst$$inline_88_location$$28$$ = "RRC (" + $index$$45$$ + ")";
          break;
        case 15:
          $inst$$inline_88_location$$28$$ = "LD A,RRC (" + $index$$45$$ + ")";
          break;
        case 16:
          $inst$$inline_88_location$$28$$ = "LD B,RL (" + $index$$45$$ + ")";
          break;
        case 17:
          $inst$$inline_88_location$$28$$ = "LD C,RL (" + $index$$45$$ + ")";
          break;
        case 18:
          $inst$$inline_88_location$$28$$ = "LD D,RL (" + $index$$45$$ + ")";
          break;
        case 19:
          $inst$$inline_88_location$$28$$ = "LD E,RL (" + $index$$45$$ + ")";
          break;
        case 20:
          $inst$$inline_88_location$$28$$ = "LD H,RL (" + $index$$45$$ + ")";
          break;
        case 21:
          $inst$$inline_88_location$$28$$ = "LD L,RL (" + $index$$45$$ + ")";
          break;
        case 22:
          $inst$$inline_88_location$$28$$ = "RL (" + $index$$45$$ + ")";
          break;
        case 23:
          $inst$$inline_88_location$$28$$ = "LD A,RL (" + $index$$45$$ + ")";
          break;
        case 24:
          $inst$$inline_88_location$$28$$ = "LD B,RR (" + $index$$45$$ + ")";
          break;
        case 25:
          $inst$$inline_88_location$$28$$ = "LD C,RR (" + $index$$45$$ + ")";
          break;
        case 26:
          $inst$$inline_88_location$$28$$ = "LD D,RR (" + $index$$45$$ + ")";
          break;
        case 27:
          $inst$$inline_88_location$$28$$ = "LD E,RR (" + $index$$45$$ + ")";
          break;
        case 28:
          $inst$$inline_88_location$$28$$ = "LD H,RR (" + $index$$45$$ + ")";
          break;
        case 29:
          $inst$$inline_88_location$$28$$ = "LD L,RR (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90_offset$$16$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_88_location$$28$$ = "RR (" + $index$$45$$ + ")";
          break;
        case 31:
          $inst$$inline_88_location$$28$$ = "LD A,RR (" + $index$$45$$ + ")";
          break;
        case 32:
          $inst$$inline_88_location$$28$$ = "LD B,SLA (" + $index$$45$$ + ")";
          break;
        case 33:
          $inst$$inline_88_location$$28$$ = "LD C,SLA (" + $index$$45$$ + ")";
          break;
        case 34:
          $inst$$inline_88_location$$28$$ = "LD D,SLA (" + $index$$45$$ + ")";
          break;
        case 35:
          $inst$$inline_88_location$$28$$ = "LD E,SLA (" + $index$$45$$ + ")";
          break;
        case 36:
          $inst$$inline_88_location$$28$$ = "LD H,SLA (" + $index$$45$$ + ")";
          break;
        case 37:
          $inst$$inline_88_location$$28$$ = "LD L,SLA (" + $index$$45$$ + ")";
          break;
        case 38:
          $inst$$inline_88_location$$28$$ = "SLA (" + $index$$45$$ + ")";
          break;
        case 39:
          $inst$$inline_88_location$$28$$ = "LD A,SLA (" + $index$$45$$ + ")";
          break;
        case 40:
          $inst$$inline_88_location$$28$$ = "LD B,SRA (" + $index$$45$$ + ")";
          break;
        case 41:
          $inst$$inline_88_location$$28$$ = "LD C,SRA (" + $index$$45$$ + ")";
          break;
        case 42:
          $inst$$inline_88_location$$28$$ = "LD D,SRA (" + $index$$45$$ + ")";
          break;
        case 43:
          $inst$$inline_88_location$$28$$ = "LD E,SRA (" + $index$$45$$ + ")";
          break;
        case 44:
          $inst$$inline_88_location$$28$$ = "LD H,SRA (" + $index$$45$$ + ")";
          break;
        case 45:
          $inst$$inline_88_location$$28$$ = "LD L,SRA (" + $index$$45$$ + ")";
          break;
        case 46:
          $inst$$inline_88_location$$28$$ = "SRA (" + $index$$45$$ + ")";
          break;
        case 47:
          $inst$$inline_88_location$$28$$ = "LD A,SRA (" + $index$$45$$ + ")";
          break;
        case 48:
          $inst$$inline_88_location$$28$$ = "LD B,SLL (" + $index$$45$$ + ")";
          break;
        case 49:
          $inst$$inline_88_location$$28$$ = "LD C,SLL (" + $index$$45$$ + ")";
          break;
        case 50:
          $inst$$inline_88_location$$28$$ = "LD D,SLL (" + $index$$45$$ + ")";
          break;
        case 51:
          $inst$$inline_88_location$$28$$ = "LD E,SLL (" + $index$$45$$ + ")";
          break;
        case 52:
          $inst$$inline_88_location$$28$$ = "LD H,SLL (" + $index$$45$$ + ")";
          break;
        case 53:
          $inst$$inline_88_location$$28$$ = "LD L,SLL (" + $index$$45$$ + ")";
          break;
        case 54:
          $inst$$inline_88_location$$28$$ = "SLL (" + $index$$45$$ + ") *";
          break;
        case 55:
          $inst$$inline_88_location$$28$$ = "LD A,SLL (" + $index$$45$$ + ")";
          break;
        case 56:
          $inst$$inline_88_location$$28$$ = "LD B,SRL (" + $index$$45$$ + ")";
          break;
        case 57:
          $inst$$inline_88_location$$28$$ = "LD C,SRL (" + $index$$45$$ + ")";
          break;
        case 58:
          $inst$$inline_88_location$$28$$ = "LD D,SRL (" + $index$$45$$ + ")";
          break;
        case 59:
          $inst$$inline_88_location$$28$$ = "LD E,SRL (" + $index$$45$$ + ")";
          break;
        case 60:
          $inst$$inline_88_location$$28$$ = "LD H,SRL (" + $index$$45$$ + ")";
          break;
        case 61:
          $inst$$inline_88_location$$28$$ = "LD L,SRL (" + $index$$45$$ + ")";
          break;
        case 62:
          $inst$$inline_88_location$$28$$ = "SRL (" + $index$$45$$ + ")";
          break;
        case 63:
          $inst$$inline_88_location$$28$$ = "LD A,SRL (" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "BIT 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "RES 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_location$$28$$ = "SET 7,(" + $index$$45$$ + ")"
      }
      $inst$$3_opcode$$inline_86$$ = $inst$$inline_88_location$$28$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($opcodesArray$$inline_87_operand$$2$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_86$$ = "POP " + $index$$45$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.set" + $index$$45$$ + "(this.readMemWord(this.sp)); this.sp += 2;";
      break;
    case 227:
      $inst$$3_opcode$$inline_86$$ = "EX SP,(" + $index$$45$$ + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "temp = this.get" + $index$$45$$ + "();this.set" + $index$$45$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_opcode$$inline_86$$ = "PUSH " + $index$$45$$;
      $code$$6_code$$inline_90_offset$$16$$ = "this.push2(this." + $index$$45$$.toLowerCase() + "H, this." + $index$$45$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_opcode$$inline_86$$ = "JP (" + $index$$45$$ + ")";
      $code$$6_code$$inline_90_offset$$16$$ = "this.pc = this.get" + $index$$45$$ + "();";
      $address$$9_address$$inline_85$$ = null;
      break;
    case 249:
      $inst$$3_opcode$$inline_86$$ = "LD SP," + $index$$45$$, $code$$6_code$$inline_90_offset$$16$$ = "this.sp = this.get" + $index$$45$$ + "();"
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_86$$, code:$code$$6_code$$inline_90_offset$$16$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_85$$}
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
  for(var $tstates$$ = 0, $prevAddress$$ = 0, $prevNextAddress$$ = 0, $breakNeeded$$ = !1, $pageBreakPoint$$ = 1024, $pageNumber$$ = 0, $i$$10$$ = 0, $length$$17$$ = 0, $code$$2$$ = ['"": {', '"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$10$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$10$$ < $length$$17$$;$i$$10$$++) {
    if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$]) {
      $prevAddress$$ <= $pageBreakPoint$$ && $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$ > $pageBreakPoint$$ && ($code$$2$$.push("this.pc = " + $JSSMS$Utils$toHex$$($prevAddress$$) + ";"), $code$$2$$.push("}"), $code$$2$$.push("},"), $code$$2$$.push("" + $pageNumber$$ + ": {"), $code$$2$$.push('"": function() {'), $code$$2$$.push('throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'), $breakNeeded$$ = !0, $pageNumber$$++, $pageBreakPoint$$ = 
      16384 * $pageNumber$$);
      if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$isJumpTarget$ || $prevNextAddress$$ != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevNextAddress$$ && !$breakNeeded$$ && $code$$2$$.push("this.pc = " + $JSSMS$Utils$toHex$$($prevNextAddress$$) + ";"), $code$$2$$.push("},"), $code$$2$$.push("" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$) + ": function(temp) {"), $code$$2$$.push("// Nb of instructions jumping here: " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$jumpTargetNb$)
      }
      $code$$2$$.push("// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].label);
      $breakNeeded$$ = "return;" == $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code.substr(-7);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$opcodes$);
      (/return;/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code) || /this\.tstates/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code)) && $insertTStates$$();
      "" != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code && $code$$2$$.push($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code);
      $prevAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$;
      $prevNextAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$nextAddress$
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
  this.$pause_button$ = !1
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
function $JSSMS$Vdp$$($i$$inline_119_i$$inline_122_sms$$3$$) {
  this.$h$ = $i$$inline_119_i$$inline_122_sms$$3$$;
  var $i$$13_r$$inline_123$$ = 0;
  this.$A$ = 0;
  this.$d$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_123$$ = 0;96 > $i$$13_r$$inline_123$$;$i$$13_r$$inline_123$$++) {
    this.$a$[$i$$13_r$$inline_123$$] = 255
  }
  this.$c$ = Array(16);
  this.$f$ = 0;
  this.$j$ = !1;
  this.$q$ = this.$l$ = this.$w$ = this.$r$ = this.$e$ = this.$i$ = 0;
  this.$p$ = Array(256);
  this.$F$ = 0;
  this.$b$ = $i$$inline_119_i$$inline_122_sms$$3$$.$b$.$canvasImageData$.data;
  this.$I$ = Array(64);
  this.$H$ = Array(64);
  this.$G$ = Array(64);
  this.$D$ = Array(256);
  this.$C$ = Array(256);
  this.$B$ = Array(16);
  this.$g$ = this.$u$ = this.$s$ = 0;
  this.$k$ = !1;
  this.$n$ = Array(192);
  for($i$$13_r$$inline_123$$ = 0;192 > $i$$13_r$$inline_123$$;$i$$13_r$$inline_123$$++) {
    this.$n$[$i$$13_r$$inline_123$$] = Array(25)
  }
  this.$t$ = Array(512);
  this.$v$ = Array(512);
  for($i$$inline_119_i$$inline_122_sms$$3$$ = this.$m$ = this.$o$ = 0;512 > $i$$inline_119_i$$inline_122_sms$$3$$;$i$$inline_119_i$$inline_122_sms$$3$$++) {
    this.$t$[$i$$inline_119_i$$inline_122_sms$$3$$] = Array(64)
  }
  var $g$$inline_124$$, $b$$inline_125$$;
  for($i$$inline_119_i$$inline_122_sms$$3$$ = 0;64 > $i$$inline_119_i$$inline_122_sms$$3$$;$i$$inline_119_i$$inline_122_sms$$3$$++) {
    $i$$13_r$$inline_123$$ = $i$$inline_119_i$$inline_122_sms$$3$$ & 3, $g$$inline_124$$ = $i$$inline_119_i$$inline_122_sms$$3$$ >> 2 & 3, $b$$inline_125$$ = $i$$inline_119_i$$inline_122_sms$$3$$ >> 4 & 3, this.$I$[$i$$inline_119_i$$inline_122_sms$$3$$] = 85 * $i$$13_r$$inline_123$$ & 255, this.$H$[$i$$inline_119_i$$inline_122_sms$$3$$] = 85 * $g$$inline_124$$ & 255, this.$G$[$i$$inline_119_i$$inline_122_sms$$3$$] = 85 * $b$$inline_125$$ & 255
  }
  for($i$$inline_119_i$$inline_122_sms$$3$$ = 0;256 > $i$$inline_119_i$$inline_122_sms$$3$$;$i$$inline_119_i$$inline_122_sms$$3$$++) {
    $g$$inline_124$$ = $i$$inline_119_i$$inline_122_sms$$3$$ & 15, $b$$inline_125$$ = $i$$inline_119_i$$inline_122_sms$$3$$ >> 4 & 15, this.$D$[$i$$inline_119_i$$inline_122_sms$$3$$] = ($g$$inline_124$$ << 4 | $g$$inline_124$$) & 255, this.$C$[$i$$inline_119_i$$inline_122_sms$$3$$] = ($b$$inline_125$$ << 4 | $b$$inline_125$$) & 255
  }
  for($i$$inline_119_i$$inline_122_sms$$3$$ = 0;16 > $i$$inline_119_i$$inline_122_sms$$3$$;$i$$inline_119_i$$inline_122_sms$$3$$++) {
    this.$B$[$i$$inline_119_i$$inline_122_sms$$3$$] = ($i$$inline_119_i$$inline_122_sms$$3$$ << 4 | $i$$inline_119_i$$inline_122_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14$$;
  this.$j$ = !0;
  for($i$$14$$ = this.$r$ = this.$f$ = this.$q$ = this.$e$ = 0;16 > $i$$14$$;$i$$14$$++) {
    this.$c$[$i$$14$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$h$.$a$.$B$ = !1;
  this.$k$ = !0;
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
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$ = this.$a$.$a$;
  console.time("DOT generation");
  for(var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$.$u$, $content$$inline_198$$ = ["digraph G {"], $i$$inline_199$$ = 0, $length$$inline_200$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$.length;$i$$inline_199$$ < $length$$inline_200$$;$i$$inline_199$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$] && ($content$$inline_198$$.push(" " + $i$$inline_199$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$].label + '"];'), null != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$].target && $content$$inline_198$$.push(" " + $i$$inline_199$$ + 
    " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$].target + ";"), null != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$].$nextAddress$ && $content$$inline_198$$.push(" " + $i$$inline_199$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_196_tree$$inline_197$$[$i$$inline_199$$].$nextAddress$ + ";"))
  }
  $content$$inline_198$$.push("}");
  $content$$inline_198$$ = $content$$inline_198$$.join("\n");
  $content$$inline_198$$ = $content$$inline_198$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  console.timeEnd("DOT generation");
  return $content$$inline_198$$
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$A$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$l$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$l$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$l$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$j$ = !0;
      var $statuscopy$$inline_208_value$$inline_205$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$w$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$w$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$d$[$JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$e$++ & 
      16383] & 255;
      return $statuscopy$$inline_208_value$$inline_205$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$j$ = !0, $statuscopy$$inline_208_value$$inline_205$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$f$, 
      $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$f$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_207_JSCompiler_StaticMethods_dataRead$self$$inline_204_JSCompiler_StaticMethods_getVCount$self$$inline_202_JSCompiler_inline_result$$5$$.$h$.$a$.$B$ = !1, $statuscopy$$inline_208_value$$inline_205$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$b$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$b$[0] | $JSCompiler_StaticMethods_in_$self$$.$b$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$, $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$, $reg$$inline_218_value$$71$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$d$.$is_gg$ && 7 > $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$)) {
    switch($address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[0] = ($reg$$inline_218_value$$71$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[1] = $reg$$inline_218_value$$71$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$;
        $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$j$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$r$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ & 16383;
            if($reg$$inline_218_value$$71$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$] & 255)) {
              if($address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ && $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$k$ = !0
              }else {
                if($address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ + 128 && $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$k$ = !0
                }else {
                  var $tileIndex$$inline_214$$ = $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$v$[$tileIndex$$inline_214$$] = !0;
                  $tileIndex$$inline_214$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_214$$);
                  $tileIndex$$inline_214$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$m$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$m$ = $tileIndex$$inline_214$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$] = $reg$$inline_218_value$$71$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$h$.$is_sms$ ? ($address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$I$[$reg$$inline_218_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_218_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$G$[$reg$$inline_218_value$$71$$]) : 
            ($address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$D$[$reg$$inline_218_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$C$[$reg$$inline_218_value$$71$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$B$[$reg$$inline_218_value$$71$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$a$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$j$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$j$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ = $reg$$inline_218_value$$71$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ & 16128 | $reg$$inline_218_value$$71$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$j$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$r$ = $reg$$inline_218_value$$71$$ >> 6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ | $reg$$inline_218_value$$71$$ << 8, 0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$r$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$w$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$d$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$r$) {
              $reg$$inline_218_value$$71$$ &= 15;
              switch($reg$$inline_218_value$$71$$) {
                case 0:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$f$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$B$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ & 
                  16));
                  break;
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$f$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$B$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_218_value$$71$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$k$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$F$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$ & -130) << 7, $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$k$ = !0, console.log("New address written to SAT: " + $address$$inline_213_old$$inline_219_port$$2_temp$$inline_212$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$g$))
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_218_value$$71$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$i$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$d$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$e$, 0 != ($reg$$inline_218_value$$71$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_218_value$$71$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_218_value$$71$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_218_value$$71$$ & 63) << 4 : 
          $reg$$inline_218_value$$71$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$h$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_221_JSCompiler_StaticMethods_controlWrite$self$$inline_216_JSCompiler_StaticMethods_dataWrite$self$$inline_210_JSCompiler_StaticMethods_out$self$$.$f$ = 
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
