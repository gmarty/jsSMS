/**
 * jsSMS - A Sega Master System/GameGear emulator in JavaScript
 * Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
 * Based on JavaGear Copyright (c) 2002-2008 Chris White
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';



/**
 * A class extending JSSMS.Z80 to debug the internal cpu logic.
 *
 * @constructor
 * @extends {JSSMS.Z80}
 */
JSSMS.Debugger = function() {
};

JSSMS.Debugger.prototype = {
  // Hold the ROM instructions parsed.
  instructions: [],


  /**
   * Reset the properties to their default values.
   * Called whenever a rom is loaded.
   */
  resetDebug: function() {
    this.instructions = [];
  },


  /**
   * Parse the rom instructions.
   */
  parseInstructions: function() {
    var toHex = JSSMS.Utils.toHex;
    var romSize = Setup.PAGE_SIZE * this.rom.length;
    var instruction;
    var currentAddress;
    var addresses = [];
    var branch;
    var i = 0;
    var length = 0;

    addresses.push(0x00); // Add program entry point to the list of addresses to visit.
    /*addresses.push(0x08); // And below: set by RST.
     addresses.push(0x10);
     addresses.push(0x18);
     addresses.push(0x20);
     addresses.push(0x28);
     addresses.push(0x30);*/
    addresses.push(0x38); // RST 38h and Interrupt.
    addresses.push(0x66); // Set by NMI.

    console.time('Instructions parsing');

    while (addresses.length) {
      currentAddress = addresses.shift();

      if (this.instructions[currentAddress]) {
        continue;
      }

      if (currentAddress >= romSize || (currentAddress >> 10) >= this.memReadMap.length) {
        console.log('Invalid address', currentAddress);

        continue;
      }

      // @todo Move to a separate function to allow adding code entry points later.
      instruction = this.disassemble(currentAddress);
      branch = Instruction(currentAddress);
      branch.label = toHex(instruction.address) + ' ' + instruction.opcode + ' ' + instruction.inst;
      branch.nextAddress = instruction.nextAddress;
      branch.opcode = instruction.opcode;
      branch.inst = instruction.inst;
      branch.target = instruction.target;
      this.instructions[currentAddress] = branch;

      if (instruction.nextAddress != null) {
        addresses.push(instruction.nextAddress);
      }

      if (instruction.target != null) {
        addresses.push(instruction.target);
      }
    }

    console.timeEnd('Instructions parsing');

    // Flag any instructions that are jump targets.
    for (length = this.instructions.length; i < length; i++) {
      if (this.instructions[i] && this.instructions[i].target != null) {
        if (this.instructions[this.instructions[i].target]) {
          this.instructions[this.instructions[i].target].isJumpTarget = true;
        } else {
          console.log('Invalid target address', this.instructions[i].target);
        }
      }
    }
  },


  /**
   * Write a dot file representation of parsed instructions to the console.
   */
  writeGraphViz: function() {
    var tree = this.instructions;

    console.time('DOT generation');

    var dotFile = 'digraph G {\n';
    for (var i = 0, length = tree.length; i < length; i++) {
      if (tree[i]) {
        dotFile += ' ' + i + ' [label="' + tree[i].label + '"];\n';
        if (tree[i].nextAddress != null)
          dotFile += ' ' + i + ' -> ' + tree[i].nextAddress + ';\n';
        if (tree[i].target != null)
          dotFile += ' ' + i + ' -> ' + tree[i].target + ';\n';
      }
    }
    dotFile += '}';

    // Inject entry point styling.
    dotFile = dotFile.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');

    console.timeEnd('DOT generation');

    console.log(dotFile);
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * @param {number} address
   * @return {Object}
   */
  disassemble: function(address) {
    var toHex = JSSMS.Utils.toHex;
    var opcode = this.readMem(address);
    var opcode_ = toHex(opcode);
    var inst = 'Unknown Opcode';
    var currAddr = address;
    var target = null;
    address++;

    switch (opcode) {
      case 0x00:
        inst = 'NOP';
        break;
      case 0x01:
        inst = 'LD BC,' + toHex(this.readMemWord(address));
        address += 2;
        break;
      case 0x02:
        inst = 'LD (BC),A';
        break;
      case 0x03:
        inst = 'INC BC';
        break;
      case 0x04:
        inst = 'INC B';
        break;
      case 0x05:
        inst = 'DEC B';
        break;
      case 0x06:
        inst = 'LD B,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x07:
        inst = 'RLCA';
        break;
      case 0x08:
        inst = 'EX AF AF\'';
        break;
      case 0x09:
        inst = 'ADD HL,BC';
        break;
      case 0x0A:
        inst = 'LD A,(BC)';
        break;
      case 0x0B:
        inst = 'DEC BC';
        break;
      case 0x0C:
        inst = 'INC C';
        break;
      case 0x0D:
        inst = 'DEC C';
        break;
      case 0x0E:
        inst = 'LD C,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x0F:
        inst = 'RRCA';
        break;
      case 0x10:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'DJNZ (' + toHex(target) + ')';
        address++;
        break;
      case 0x11:
        inst = 'LD DE,' + toHex(this.readMemWord(address));
        address += 2;
        break;
      case 0x12:
        inst = 'LD (DE),A';
        break;
      case 0x13:
        inst = 'INC DE';
        break;
      case 0x14:
        inst = 'INC D';
        break;
      case 0x15:
        inst = 'DEC D';
        break;
      case 0x16:
        inst = 'LD D,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x17:
        inst = 'RLA';
        break;
      case 0x18:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'JR (' + toHex(target) + ')';
        address = null;
        break;
      case 0x19:
        inst = 'ADD HL,DE';
        break;
      case 0x1A:
        inst = 'LD A,(DE)';
        break;
      case 0x1B:
        inst = 'DEC DE';
        break;
      case 0x1C:
        inst = 'INC E';
        break;
      case 0x1D:
        inst = 'DEC E';
        break;
      case 0x1E:
        inst = 'LD E,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x1F:
        inst = 'RRA';
        break;
      case 0x20:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'JR NZ,(' + toHex(target) + ')';
        address++;
        break;
      case 0x21:
        inst = 'LD HL,' + toHex(this.readMemWord(address));
        address += 2;
        break;
      case 0x22:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),HL';
        address += 2;
        break;
      case 0x23:
        inst = 'INC HL';
        break;
      case 0x24:
        inst = 'INC H';
        break;
      case 0x25:
        inst = 'DEC H';
        break;
      case 0x26:
        inst = 'LD H,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x27:
        inst = 'DAA';
        break;
      case 0x28:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'JR Z,(' + toHex(target) + ')';
        address++;
        break;
      case 0x29:
        inst = 'ADD HL,HL';
        break;
      case 0x2A:
        inst = 'LD HL,(' + toHex(this.readMemWord(address)) + ')';
        address += 2;
        break;
      case 0x2B:
        inst = 'DEC HL';
        break;
      case 0x2C:
        inst = 'INC L';
        break;
      case 0x2D:
        inst = 'DEC L';
        break;
      case 0x2E:
        inst = 'LD L,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x2F:
        inst = 'CPL';
        break;
      case 0x30:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'JR NC,(' + toHex(target) + ')';
        address++;
        break;
      case 0x31:
        inst = 'LD SP,' + toHex(this.readMemWord(address));
        address += 2;
        break;
      case 0x32:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),A';
        address += 2;
        break;
      case 0x33:
        inst = 'INC SP';
        break;
      case 0x34:
        inst = 'INC (HL)';
        break;
      case 0x35:
        inst = 'DEC (HL)';
        break;
      case 0x36:
        inst = 'LD (HL),' + toHex(this.readMem(address));
        address++;
        break;
      case 0x37:
        inst = 'SCF';
        break;
      case 0x38:
        target = address + this.signExtend(this.readMem(address)) + 1;
        inst = 'JR C,(' + toHex(target) + ')';
        address++;
        break;
      case 0x39:
        inst = 'ADD HL,SP';
        break;
      case 0x3A:
        inst = 'LD A,(' + toHex(this.readMemWord(address)) + ')';
        address += 2;
        break;
      case 0x3B:
        inst = 'DEC SP';
        break;
      case 0x3C:
        inst = 'INC A';
        break;
      case 0x3D:
        inst = 'DEC A';
        break;
      case 0x3E:
        inst = 'LD A,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x3F:
        inst = 'CCF';
        break;
      case 0x40:
        inst = 'LD B,B';
        break;
      case 0x41:
        inst = 'LD B,C';
        break;
      case 0x42:
        inst = 'LD B,D';
        break;
      case 0x43:
        inst = 'LD B,E';
        break;
      case 0x44:
        inst = 'LD B,H';
        break;
      case 0x45:
        inst = 'LD B,L';
        break;
      case 0x46:
        inst = 'LD B,(HL)';
        break;
      case 0x47:
        inst = 'LD B,A';
        break;
      case 0x48:
        inst = 'LD C,B';
        break;
      case 0x49:
        inst = 'LD C,C';
        break;
      case 0x4A:
        inst = 'LD C,D';
        break;
      case 0x4B:
        inst = 'LD C,E';
        break;
      case 0x4C:
        inst = 'LD C,H';
        break;
      case 0x4D:
        inst = 'LD C,L';
        break;
      case 0x4E:
        inst = 'LD C,(HL)';
        break;
      case 0x4F:
        inst = 'LD C,A';
        break;
      case 0x50:
        inst = 'LD D,B';
        break;
      case 0x51:
        inst = 'LD D,C';
        break;
      case 0x52:
        inst = 'LD D,D';
        break;
      case 0x53:
        inst = 'LD D,E';
        break;
      case 0x54:
        inst = 'LD D,H';
        break;
      case 0x55:
        inst = 'LD D,L';
        break;
      case 0x56:
        inst = 'LD D,(HL)';
        break;
      case 0x57:
        inst = 'LD D,A';
        break;
      case 0x58:
        inst = 'LD E,B';
        break;
      case 0x59:
        inst = 'LD E,C';
        break;
      case 0x5A:
        inst = 'LD E,D';
        break;
      case 0x5B:
        inst = 'LD E,E';
        break;
      case 0x5C:
        inst = 'LD E,H';
        break;
      case 0x5D:
        inst = 'LD E,L';
        break;
      case 0x5E:
        inst = 'LD E,(HL)';
        break;
      case 0x5F:
        inst = 'LD E,A';
        break;
      case 0x60:
        inst = 'LD H,B';
        break;
      case 0x61:
        inst = 'LD H,C';
        break;
      case 0x62:
        inst = 'LD H,D';
        break;
      case 0x63:
        inst = 'LD H,E';
        break;
      case 0x64:
        inst = 'LD H,H';
        break;
      case 0x65:
        inst = 'LD H,L';
        break;
      case 0x66:
        inst = 'LD H,(HL)';
        break;
      case 0x67:
        inst = 'LD H,A';
        break;
      case 0x68:
        inst = 'LD L,B';
        break;
      case 0x69:
        inst = 'LD L,C';
        break;
      case 0x6A:
        inst = 'LD L,D';
        break;
      case 0x6B:
        inst = 'LD L,E';
        break;
      case 0x6C:
        inst = 'LD L,H';
        break;
      case 0x6D:
        inst = 'LD L,L';
        break;
      case 0x6E:
        inst = 'LD L,(HL)';
        break;
      case 0x6F:
        inst = 'LD L,A';
        break;
      case 0x70:
        inst = 'LD (HL),B';
        break;
      case 0x71:
        inst = 'LD (HL),C';
        break;
      case 0x72:
        inst = 'LD (HL),D';
        break;
      case 0x73:
        inst = 'LD (HL),E';
        break;
      case 0x74:
        inst = 'LD (HL),H';
        break;
      case 0x75:
        inst = 'LD (HL),L';
        break;
      case 0x76:
        inst = 'HALT';
        break;
      case 0x77:
        inst = 'LD (HL),A';
        break;
      case 0x78:
        inst = 'LD A,B';
        break;
      case 0x79:
        inst = 'LD A,C';
        break;
      case 0x7A:
        inst = 'LD A,D';
        break;
      case 0x7B:
        inst = 'LD A,E';
        break;
      case 0x7C:
        inst = 'LD A,H';
        break;
      case 0x7D:
        inst = 'LD A,L';
        break;
      case 0x7E:
        inst = 'LD A,(HL)';
        break;
      case 0x7F:
        inst = 'LD A,A';
        break;
      case 0x80:
        inst = 'ADD A,B';
        break;
      case 0x81:
        inst = 'ADD A,C';
        break;
      case 0x82:
        inst = 'ADD A,D';
        break;
      case 0x83:
        inst = 'ADD A,E';
        break;
      case 0x84:
        inst = 'ADD A,H';
        break;
      case 0x85:
        inst = 'ADD A,L';
        break;
      case 0x86:
        inst = 'ADD A,(HL)';
        break;
      case 0x87:
        inst = 'ADD A,A';
        break;
      case 0x88:
        inst = 'ADC A,B';
        break;
      case 0x89:
        inst = 'ADC A,C';
        break;
      case 0x8A:
        inst = 'ADC A,D';
        break;
      case 0x8B:
        inst = 'ADC A,E';
        break;
      case 0x8C:
        inst = 'ADC A,H';
        break;
      case 0x8D:
        inst = 'ADC A,L';
        break;
      case 0x8E:
        inst = 'ADC A,(HL)';
        break;
      case 0x8F:
        inst = 'ADC A,A';
        break;
      case 0x90:
        inst = 'SUB A,B';
        break;
      case 0x91:
        inst = 'SUB A,C';
        break;
      case 0x92:
        inst = 'SUB A,D';
        break;
      case 0x93:
        inst = 'SUB A,E';
        break;
      case 0x94:
        inst = 'SUB A,H';
        break;
      case 0x95:
        inst = 'SUB A,L';
        break;
      case 0x96:
        inst = 'SUB A,(HL)';
        break;
      case 0x97:
        inst = 'SUB A,A';
        break;
      case 0x98:
        inst = 'SBC A,B';
        break;
      case 0x99:
        inst = 'SBC A,C';
        break;
      case 0x9A:
        inst = 'SBC A,D';
        break;
      case 0x9B:
        inst = 'SBC A,E';
        break;
      case 0x9C:
        inst = 'SBC A,H';
        break;
      case 0x9D:
        inst = 'SBC A,L';
        break;
      case 0x9E:
        inst = 'SBC A,(HL)';
        break;
      case 0x9F:
        inst = 'SBC A,A';
        break;
      case 0xA0:
        inst = 'AND A,B';
        break;
      case 0xA1:
        inst = 'AND A,C';
        break;
      case 0xA2:
        inst = 'AND A,D';
        break;
      case 0xA3:
        inst = 'AND A,E';
        break;
      case 0xA4:
        inst = 'AND A,H';
        break;
      case 0xA5:
        inst = 'AND A,L';
        break;
      case 0xA6:
        inst = 'AND A,(HL)';
        break;
      case 0xA7:
        inst = 'AND A,A';
        break;
      case 0xA8:
        inst = 'XOR A,B';
        break;
      case 0xA9:
        inst = 'XOR A,C';
        break;
      case 0xAA:
        inst = 'XOR A,D';
        break;
      case 0xAB:
        inst = 'XOR A,E';
        break;
      case 0xAC:
        inst = 'XOR A,H';
        break;
      case 0xAD:
        inst = 'XOR A,L';
        break;
      case 0xAE:
        inst = 'XOR A,(HL)';
        break;
      case 0xAF:
        inst = 'XOR A,A'; // =0
        break;
      case 0xB0:
        inst = 'OR A,B';
        break;
      case 0xB1:
        inst = 'OR A,C';
        break;
      case 0xB2:
        inst = 'OR A,D';
        break;
      case 0xB3:
        inst = 'OR A,E';
        break;
      case 0xB4:
        inst = 'OR A,H';
        break;
      case 0xB5:
        inst = 'OR A,L';
        break;
      case 0xB6:
        inst = 'OR A,(HL)';
        break;
      case 0xB7:
        inst = 'OR A,A';
        break;
      case 0xB8:
        inst = 'CP A,B';
        break;
      case 0xB9:
        inst = 'CP A,C';
        break;
      case 0xBA:
        inst = 'CP A,D';
        break;
      case 0xBB:
        inst = 'CP A,E';
        break;
      case 0xBC:
        inst = 'CP A,H';
        break;
      case 0xBD:
        inst = 'CP A,L';
        break;
      case 0xBE:
        inst = 'CP A,(HL)';
        break;
      case 0xBF:
        inst = 'CP A,A';
        break;
      case 0xC0:
        inst = 'RET NZ';
        break;
      case 0xC1:
        inst = 'POP BC';
        break;
      case 0xC2:
        target = this.readMemWord(address);
        inst = 'JP NZ,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xC3:
        target = this.readMemWord(address);
        inst = 'JP (' + toHex(target) + ')';
        address = null;
        break;
      case 0xC4:
        target = this.readMemWord(address);
        inst = 'CALL NZ (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xC5:
        inst = 'PUSH BC';
        break;
      case 0xC6:
        inst = 'ADD A,' + toHex(this.readMem(address));
        address++;
        break;
      case 0xC7:
        target = 0x00;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xC8:
        inst = 'RET Z';
        break;
      case 0xC9:
        inst = 'RET';
        address = null;
        break;
      case 0xCA:
        target = this.readMemWord(address);
        inst = 'JP Z,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xCB:
        var _inst = this.getCB(address);
        inst = _inst.inst;
        opcode_ += ' ' + _inst.opcode;
        address = _inst.nextAddress;
        // @todo
        break;
      case 0xCC:
        target = this.readMemWord(address);
        inst = 'CALL Z (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xCD:
        target = this.readMemWord(address);
        inst = 'CALL (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xCE:
        inst = 'ADC ,' + toHex(this.readMem(address));
        address++;
        break;
      case 0xCF:
        target = 0x08;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xD0:
        inst = 'RET NC';
        break;
      case 0xD1:
        inst = 'POP DE';
        break;
      case 0xD2:
        target = this.readMemWord(address);
        inst = 'JP NC,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xD3:
        inst = 'OUT (' + toHex(this.readMem(address)) + '),A';
        address++;
        break;
      case 0xD4:
        target = this.readMemWord(address);
        inst = 'CALL NC (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xD5:
        inst = 'PUSH DE';
        break;
      case 0xD6:
        inst = 'SUB ' + toHex(this.readMem(address));
        break;
      case 0xD7:
        target = 0x10;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xD8:
        inst = 'RET C';
        break;
      case 0xD9:
        inst = 'EXX';
        break;
      case 0xDA:
        target = this.readMemWord(address);
        inst = 'JP C,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xDB:
        inst = 'IN A,(' + toHex(this.readMem(address)) + ')';
        address++;
        break;
      case 0xDC:
        target = this.readMemWord(address);
        inst = 'CALL C (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xDD:
        var _inst = this.getIndexOpIX(address);
        inst = _inst.inst;
        opcode_ += ' ' + _inst.opcode;
        address = _inst.nextAddress;
        // @todo
        break;
      case 0xDE:
        inst = 'SBC A,' + toHex(this.readMem(address));
        address++;
        break;
      case 0xDF:
        target = 0x18;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xE0:
        inst = 'RET PO';
        break;
      case 0xE1:
        inst = 'POP HL';
        break;
      case 0xE2:
        target = this.readMemWord(address);
        inst = 'JP PO,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xE3:
        inst = 'EX (SP),HL';
        break;
      case 0xE4:
        target = this.readMemWord(address);
        inst = 'CALL PO (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xE5:
        inst = 'PUSH HL';
        break;
      case 0xE6:
        inst = 'AND (' + toHex(this.readMem(address)) + ')';
        address++;
        break;
      case 0xE7:
        target = 0x20;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xE8:
        inst = 'RET PE';
        break;
      case 0xE9:
        // This target can't be determined using static analysis.
        inst = 'JP (HL)';
        address = null;
        break;
      case 0xEA:
        target = this.readMemWord(address);
        inst = 'JP PE,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xEB:
        inst = 'EX DE,HL';
        break;
      case 0xEC:
        target = this.readMemWord(address);
        inst = 'CALL PE (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xED:
        var _inst = this.getED(address);
        inst = _inst.inst;
        opcode_ += ' ' + _inst.opcode;
        address = _inst.nextAddress;
        // @todo
        break;
      case 0xEE:
        inst = 'XOR A,' + toHex(this.readMem(address));
        address++;
        break;
      case 0xEF:
        target = 0x28;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xF0:
        inst = 'RET P';
        break;
      case 0xF1:
        inst = 'POP AF';
        break;
      case 0xF2:
        target = this.readMemWord(address);
        inst = 'JP P,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xF3:
        inst = 'DI';
        break;
      case 0xF4:
        target = this.readMemWord(address);
        inst = 'CALL P (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xF5:
        inst = 'PUSH AF';
        break;
      case 0xF6:
        inst = 'OR ' + toHex(this.readMem(address));
        address++;
        break;
      case 0xF7:
        target = 0x30;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
      case 0xF8:
        inst = 'RET M';
        break;
      case 0xF9:
        inst = 'LD SP,HL';
        break;
      case 0xFA:
        target = this.readMemWord(address);
        inst = 'JP M,(' + toHex(target) + ')';
        address += 2;
        break;
      case 0xFB:
        inst = 'EI';
        break;
      case 0xFC:
        target = this.readMemWord(address);
        inst = 'CALL M (' + toHex(target) + ')';
        address += 2;
        break;
      case 0xFD:
        var _inst = this.getIndexOpIY(address);
        inst = _inst.inst;
        opcode_ += ' ' + _inst.opcode;
        address = _inst.nextAddress;
        // @todo
        break;
      case 0xFE:
        inst = 'CP ' + toHex(this.readMem(address));
        address++;
        break;
      case 0xFF:
        target = 0x38;
        inst = 'RST ' + toHex(target);
        address = null;
        break;
    }

    return {
      opcode: opcode_,
      inst: inst,
      address: currAddr,
      nextAddress: address,
      target: target
    };
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * @param {number} address
   * @return {Object}
   */
  getCB: function(address) {
    var toHex = JSSMS.Utils.toHex;
    var opcode = this.readMem(address);
    var inst = 'Unimplemented CB Opcode';
    var currAddr = address;
    address++;

    switch (opcode) {
      case 0x00:
        inst = 'RLC B';
        break;
      case 0x01:
        inst = 'RLC C';
        break;
      case 0x02:
        inst = 'RLC D';
        break;
      case 0x03:
        inst = 'RLC E';
        break;
      case 0x04:
        inst = 'RLC H';
        break;
      case 0x05:
        inst = 'RLC L';
        break;
      case 0x06:
        inst = 'RLC (HL)';
        break;
      case 0x07:
        inst = 'RLC A';
        break;
      case 0x08:
        inst = 'RRC B';
        break;
      case 0x09:
        inst = 'RRC C';
        break;
      case 0x0A:
        inst = 'RRC D';
        break;
      case 0x0B:
        inst = 'RRC E';
        break;
      case 0x0C:
        inst = 'RRC H';
        break;
      case 0x0D:
        inst = 'RRC L';
        break;
      case 0x0E:
        inst = 'RRC (HL)';
        break;
      case 0x0F:
        inst = 'RRC A';
        break;
      case 0x10:
        inst = 'RL B';
        break;
      case 0x11:
        inst = 'RL C';
        break;
      case 0x12:
        inst = 'RL D';
        break;
      case 0x13:
        inst = 'RL E';
        break;
      case 0x14:
        inst = 'RL H';
        break;
      case 0x15:
        inst = 'RL L';
        break;
      case 0x16:
        inst = 'RL (HL)';
        break;
      case 0x17:
        inst = 'RL A';
        break;
      case 0x18:
        inst = 'RR B';
        break;
      case 0x19:
        inst = 'RR C';
        break;
      case 0x1A:
        inst = 'RR D';
        break;
      case 0x1B:
        inst = 'RR E';
        break;
      case 0x1C:
        inst = 'RR H';
        break;
      case 0x1D:
        inst = 'RR L';
        break;
      case 0x1E:
        inst = 'RR (HL)';
        break;
      case 0x1F:
        inst = 'RR A';
        break;
      case 0x20:
        inst = 'SLA B';
        break;
      case 0x21:
        inst = 'SLA C';
        break;
      case 0x22:
        inst = 'SLA D';
        break;
      case 0x23:
        inst = 'SLA E';
        break;
      case 0x24:
        inst = 'SLA H';
        break;
      case 0x25:
        inst = 'SLA L';
        break;
      case 0x26:
        inst = 'SLA (HL)';
        break;
      case 0x27:
        inst = 'SLA A';
        break;
      case 0x28:
        inst = 'SRA B';
        break;
      case 0x29:
        inst = 'SRA C';
        break;
      case 0x2A:
        inst = 'SRA D';
        break;
      case 0x2B:
        inst = 'SRA E';
        break;
      case 0x2C:
        inst = 'SRA H';
        break;
      case 0x2D:
        inst = 'SRA L';
        break;
      case 0x2E:
        inst = 'SRA (HL)';
        break;
      case 0x2F:
        inst = 'SRA A';
        break;
      case 0x30:
        inst = 'SLL B';
        break;
      case 0x31:
        inst = 'SLL C';
        break;
      case 0x32:
        inst = 'SLL D';
        break;
      case 0x33:
        inst = 'SLL E';
        break;
      case 0x34:
        inst = 'SLL H';
        break;
      case 0x35:
        inst = 'SLL L';
        break;
      case 0x36:
        inst = 'SLL (HL)';
        break;
      case 0x37:
        inst = 'SLL A';
        break;
      case 0x38:
        inst = 'SRL B';
        break;
      case 0x39:
        inst = 'SRL C';
        break;
      case 0x3A:
        inst = 'SRL D';
        break;
      case 0x3B:
        inst = 'SRL E';
        break;
      case 0x3C:
        inst = 'SRL H';
        break;
      case 0x3D:
        inst = 'SRL L';
        break;
      case 0x3E:
        inst = 'SRL (HL)';
        break;
      case 0x3F:
        inst = 'SRL A';
        break;
      case 0x40:
        inst = 'BIT 0,B';
        break;
      case 0x41:
        inst = 'BIT 0,C';
        break;
      case 0x42:
        inst = 'BIT 0,D';
        break;
      case 0x43:
        inst = 'BIT 0,E';
        break;
      case 0x44:
        inst = 'BIT 0,H';
        break;
      case 0x45:
        inst = 'BIT 0,L';
        break;
      case 0x46:
        inst = 'BIT 0,(HL)';
        break;
      case 0x47:
        inst = 'BIT 0,A';
        break;
      case 0x48:
        inst = 'BIT 1,B';
        break;
      case 0x49:
        inst = 'BIT 1,C';
        break;
      case 0x4A:
        inst = 'BIT 1,D';
        break;
      case 0x4B:
        inst = 'BIT 1,E';
        break;
      case 0x4C:
        inst = 'BIT 1,H';
        break;
      case 0x4D:
        inst = 'BIT 1,L';
        break;
      case 0x4E:
        inst = 'BIT 1,(HL)';
        break;
      case 0x4F:
        inst = 'BIT 1,A';
        break;
      case 0x50:
        inst = 'BIT 2,B';
        break;
      case 0x51:
        inst = 'BIT 2,C';
        break;
      case 0x52:
        inst = 'BIT 2,D';
        break;
      case 0x53:
        inst = 'BIT 2,E';
        break;
      case 0x54:
        inst = 'BIT 2,H';
        break;
      case 0x55:
        inst = 'BIT 2,L';
        break;
      case 0x56:
        inst = 'BIT 2,(HL)';
        break;
      case 0x57:
        inst = 'BIT 2,A';
        break;
      case 0x58:
        inst = 'BIT 3,B';
        break;
      case 0x59:
        inst = 'BIT 3,C';
        break;
      case 0x5A:
        inst = 'BIT 3,D';
        break;
      case 0x5B:
        inst = 'BIT 3,E';
        break;
      case 0x5C:
        inst = 'BIT 3,H';
        break;
      case 0x5D:
        inst = 'BIT 3,L';
        break;
      case 0x5E:
        inst = 'BIT 3,(HL)';
        break;
      case 0x5F:
        inst = 'BIT 3,A';
        break;
      case 0x60:
        inst = 'BIT 4,B';
        break;
      case 0x61:
        inst = 'BIT 4,C';
        break;
      case 0x62:
        inst = 'BIT 4,D';
        break;
      case 0x63:
        inst = 'BIT 4,E';
        break;
      case 0x64:
        inst = 'BIT 4,H';
        break;
      case 0x65:
        inst = 'BIT 4,L';
        break;
      case 0x66:
        inst = 'BIT 4,(HL)';
        break;
      case 0x67:
        inst = 'BIT 4,A';
        break;
      case 0x68:
        inst = 'BIT 5,B';
        break;
      case 0x69:
        inst = 'BIT 5,C';
        break;
      case 0x6A:
        inst = 'BIT 5,D';
        break;
      case 0x6B:
        inst = 'BIT 5,E';
        break;
      case 0x6C:
        inst = 'BIT 5,H';
        break;
      case 0x6D:
        inst = 'BIT 5,L';
        break;
      case 0x6E:
        inst = 'BIT 5,(HL)';
        break;
      case 0x6F:
        inst = 'BIT 5,A';
        break;
      case 0x70:
        inst = 'BIT 6,B';
        break;
      case 0x71:
        inst = 'BIT 6,C';
        break;
      case 0x72:
        inst = 'BIT 6,D';
        break;
      case 0x73:
        inst = 'BIT 6,E';
        break;
      case 0x74:
        inst = 'BIT 6,H';
        break;
      case 0x75:
        inst = 'BIT 6,L';
        break;
      case 0x76:
        inst = 'BIT 6,(HL)';
        break;
      case 0x77:
        inst = 'BIT 6,A';
        break;
      case 0x78:
        inst = 'BIT 7,B';
        break;
      case 0x79:
        inst = 'BIT 7,C';
        break;
      case 0x7A:
        inst = 'BIT 7,D';
        break;
      case 0x7B:
        inst = 'BIT 7,E';
        break;
      case 0x7C:
        inst = 'BIT 7,H';
        break;
      case 0x7D:
        inst = 'BIT 7,L';
        break;
      case 0x7E:
        inst = 'BIT 7,(HL)';
        break;
      case 0x7F:
        inst = 'BIT 7,A';
        break;
      case 0x80:
        inst = 'RES 0,B';
        break;
      case 0x81:
        inst = 'RES 0,C';
        break;
      case 0x82:
        inst = 'RES 0,D';
        break;
      case 0x83:
        inst = 'RES 0,E';
        break;
      case 0x84:
        inst = 'RES 0,H';
        break;
      case 0x85:
        inst = 'RES 0,L';
        break;
      case 0x86:
        inst = 'RES 0,(HL)';
        break;
      case 0x87:
        inst = 'RES 0,A';
        break;
      case 0x88:
        inst = 'RES 1,B';
        break;
      case 0x89:
        inst = 'RES 1,C';
        break;
      case 0x8A:
        inst = 'RES 1,D';
        break;
      case 0x8B:
        inst = 'RES 1,E';
        break;
      case 0x8C:
        inst = 'RES 1,H';
        break;
      case 0x8D:
        inst = 'RES 1,L';
        break;
      case 0x8E:
        inst = 'RES 1,(HL)';
        break;
      case 0x8F:
        inst = 'RES 1,A';
        break;
      case 0x90:
        inst = 'RES 2,B';
        break;
      case 0x91:
        inst = 'RES 2,C';
        break;
      case 0x92:
        inst = 'RES 2,D';
        break;
      case 0x93:
        inst = 'RES 2,E';
        break;
      case 0x94:
        inst = 'RES 2,H';
        break;
      case 0x95:
        inst = 'RES 2,L';
        break;
      case 0x96:
        inst = 'RES 2,(HL)';
        break;
      case 0x97:
        inst = 'RES 2,A';
        break;
      case 0x98:
        inst = 'RES 3,B';
        break;
      case 0x99:
        inst = 'RES 3,C';
        break;
      case 0x9A:
        inst = 'RES 3,D';
        break;
      case 0x9B:
        inst = 'RES 3,E';
        break;
      case 0x9C:
        inst = 'RES 3,H';
        break;
      case 0x9D:
        inst = 'RES 3,L';
        break;
      case 0x9E:
        inst = 'RES 3,(HL)';
        break;
      case 0x9F:
        inst = 'RES 3,A';
        break;
      case 0xA0:
        inst = 'RES 4,B';
        break;
      case 0xA1:
        inst = 'RES 4,C';
        break;
      case 0xA2:
        inst = 'RES 4,D';
        break;
      case 0xA3:
        inst = 'RES 4,E';
        break;
      case 0xA4:
        inst = 'RES 4,H';
        break;
      case 0xA5:
        inst = 'RES 4,L';
        break;
      case 0xA6:
        inst = 'RES 4,(HL)';
        break;
      case 0xA7:
        inst = 'RES 4,A';
        break;
      case 0xA8:
        inst = 'RES 5,B';
        break;
      case 0xA9:
        inst = 'RES 5,C';
        break;
      case 0xAA:
        inst = 'RES 5,D';
        break;
      case 0xAB:
        inst = 'RES 5,E';
        break;
      case 0xAC:
        inst = 'RES 5,H';
        break;
      case 0xAD:
        inst = 'RES 5,L';
        break;
      case 0xAE:
        inst = 'RES 5,(HL)';
        break;
      case 0xAF:
        inst = 'RES 5,A';
        break;
      case 0xB0:
        inst = 'RES 6,B';
        break;
      case 0xB1:
        inst = 'RES 6,C';
        break;
      case 0xB2:
        inst = 'RES 6,D';
        break;
      case 0xB3:
        inst = 'RES 6,E';
        break;
      case 0xB4:
        inst = 'RES 6,H';
        break;
      case 0xB5:
        inst = 'RES 6,L';
        break;
      case 0xB6:
        inst = 'RES 6,(HL)';
        break;
      case 0xB7:
        inst = 'RES 6,A';
        break;
      case 0xB8:
        inst = 'RES 7,B';
        break;
      case 0xB9:
        inst = 'RES 7,C';
        break;
      case 0xBA:
        inst = 'RES 7,D';
        break;
      case 0xBB:
        inst = 'RES 7,E';
        break;
      case 0xBC:
        inst = 'RES 7,H';
        break;
      case 0xBD:
        inst = 'RES 7,L';
        break;
      case 0xBE:
        inst = 'RES 7,(HL)';
        break;
      case 0xBF:
        inst = 'RES 7,A';
        break;
      case 0xC0:
        inst = 'SET 0,B';
        break;
      case 0xC1:
        inst = 'SET 0,C';
        break;
      case 0xC2:
        inst = 'SET 0,D';
        break;
      case 0xC3:
        inst = 'SET 0,E';
        break;
      case 0xC4:
        inst = 'SET 0,H';
        break;
      case 0xC5:
        inst = 'SET 0,L';
        break;
      case 0xC6:
        inst = 'SET 0,(HL)';
        break;
      case 0xC7:
        inst = 'SET 0,A';
        break;
      case 0xC8:
        inst = 'SET 1,B';
        break;
      case 0xC9:
        inst = 'SET 1,C';
        break;
      case 0xCA:
        inst = 'SET 1,D';
        break;
      case 0xCB:
        inst = 'SET 1,E';
        break;
      case 0xCC:
        inst = 'SET 1,H';
        break;
      case 0xCD:
        inst = 'SET 1,L';
        break;
      case 0xCE:
        inst = 'SET 1,(HL)';
        break;
      case 0xCF:
        inst = 'SET 1,A';
        break;
      case 0xD0:
        inst = 'SET 2,B';
        break;
      case 0xD1:
        inst = 'SET 2,C';
        break;
      case 0xD2:
        inst = 'SET 2,D';
        break;
      case 0xD3:
        inst = 'SET 2,E';
        break;
      case 0xD4:
        inst = 'SET 2,H';
        break;
      case 0xD5:
        inst = 'SET 2,L';
        break;
      case 0xD6:
        inst = 'SET 2,(HL)';
        break;
      case 0xD7:
        inst = 'SET 2,A';
        break;
      case 0xD8:
        inst = 'SET 3,B';
        break;
      case 0xD9:
        inst = 'SET 3,C';
        break;
      case 0xDA:
        inst = 'SET 3,D';
        break;
      case 0xDB:
        inst = 'SET 3,E';
        break;
      case 0xDC:
        inst = 'SET 3,H';
        break;
      case 0xDD:
        inst = 'SET 3,L';
        break;
      case 0xDE:
        inst = 'SET 3,(HL)';
        break;
      case 0xDF:
        inst = 'SET 3,A';
        break;
      case 0xE0:
        inst = 'SET 4,B';
        break;
      case 0xE1:
        inst = 'SET 4,C';
        break;
      case 0xE2:
        inst = 'SET 4,D';
        break;
      case 0xE3:
        inst = 'SET 4,E';
        break;
      case 0xE4:
        inst = 'SET 4,H';
        break;
      case 0xE5:
        inst = 'SET 4,L';
        break;
      case 0xE6:
        inst = 'SET 4,(HL)';
        break;
      case 0xE7:
        inst = 'SET 4,A';
        break;
      case 0xE8:
        inst = 'SET 5,B';
        break;
      case 0xE9:
        inst = 'SET 5,C';
        break;
      case 0xEA:
        inst = 'SET 5,D';
        break;
      case 0xEB:
        inst = 'SET 5,E';
        break;
      case 0xEC:
        inst = 'SET 5,H';
        break;
      case 0xED:
        inst = 'SET 5,L';
        break;
      case 0xEE:
        inst = 'SET 5,(HL)';
        break;
      case 0xEF:
        inst = 'SET 5,A';
        break;
      case 0xF0:
        inst = 'SET 6,B';
        break;
      case 0xF1:
        inst = 'SET 6,C';
        break;
      case 0xF2:
        inst = 'SET 6,D';
        break;
      case 0xF3:
        inst = 'SET 6,E';
        break;
      case 0xF4:
        inst = 'SET 6,H';
        break;
      case 0xF5:
        inst = 'SET 6,L';
        break;
      case 0xF6:
        inst = 'SET 6,(HL)';
        break;
      case 0xF7:
        inst = 'SET 6,A';
        break;
      case 0xF8:
        inst = 'SET 7,B';
        break;
      case 0xF9:
        inst = 'SET 7,C';
        break;
      case 0xFA:
        inst = 'SET 7,D';
        break;
      case 0xFB:
        inst = 'SET 7,E';
        break;
      case 0xFC:
        inst = 'SET 7,H';
        break;
      case 0xFD:
        inst = 'SET 7,L';
        break;
      case 0xFE:
        inst = 'SET 7,(HL)';
        break;
      case 0xFF:
        inst = 'SET 7,A';
        break;
    }

    return {
      opcode: toHex(opcode),
      inst: inst,
      address: currAddr,
      nextAddress: address
    };
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * @param {number} address
   * @return {Object}
   */
  getED: function(address) {
    var toHex = JSSMS.Utils.toHex;
    var opcode = this.readMem(address);
    var inst = 'Unimplemented ED Opcode';
    var currAddr = address;
    address++;

    switch (opcode) {
      case 0x40:
        inst = 'IN B,(C)';
        break;
      case 0x41:
        inst = 'OUT (C),B';
        break;
      case 0x42:
        inst = 'SBC HL,BC';
        break;
      case 0x43:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),BC';
        address = address + 2;
        break;
      case 0x44:
      case 0x4C:
      case 0x54:
      case 0x5C:
      case 0x64:
      case 0x6C:
      case 0x74:
      case 0x7C:
        inst = 'NEG';
        break;
      case 0x45:
      case 0x4D:
      case 0x55:
      case 0x5D:
      case 0x65:
      case 0x6D:
      case 0x75:
      case 0x7D:
        inst = 'RETN / RETI';
        address = null;
        break;
      case 0x46:
      case 0x4E:
      case 0x66:
      case 0x6E:
        inst = 'IM 0';
        break;
      case 0x47:
        inst = 'LD I,A';
        break;
      case 0x48:
        inst = 'IN C,(C)';
        break;
      case 0x49:
        inst = 'OUT (C),C';
        break;
      case 0x4A:
        inst = 'ADC HL,BC';
        break;
      case 0x4B:
        inst = 'LD BC,(' + toHex(this.readMemWord(address)) + ')';
        address = address + 2;
        break;
      case 0x4F:
        inst = 'LD R,A';
        break;
      case 0x50:
        inst = 'IN D,(C)';
        break;
      case 0x51:
        inst = 'OUT (C),D';
        break;
      case 0x52:
        inst = 'SBC HL,DE';
        break;
      case 0x53:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),DE';
        address = address + 2;
        break;
      case 0x56:
      case 0x76:
        inst = 'IM 1';
        break;
      case 0x57:
        inst = 'LD A,I';
        break;
      case 0x58:
        inst = 'IN E,(C)';
        break;
      case 0x59:
        inst = 'OUT (C),E';
        break;
      case 0x5A:
        inst = 'ADC HL,DE';
        break;
      case 0x5B:
        inst = 'LD DE,(' + toHex(this.readMemWord(address)) + ')';
        address = address + 2;
        break;
      case 0x5F:
        inst = 'LD A,R';
        break;
      case 0x60:
        inst = 'IN H,(C)';
        break;
      case 0x61:
        inst = 'OUT (C),H';
        break;
      case 0x62:
        inst = 'SBC HL,HL';
        break;
      case 0x63:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),HL';
        address = address + 2;
        break;
      case 0x67:
        inst = 'RRD';
        break;
      case 0x68:
        inst = 'IN L,(C)';
        break;
      case 0x69:
        inst = 'OUT (C),L';
        break;
      case 0x6A:
        inst = 'ADC HL,HL';
        break;
      case 0x6B:
        inst = 'LD HL,(' + toHex(this.readMemWord(address)) + ')';
        address = address + 2;
        break;
      case 0x6F:
        inst = 'RLD';
        break;
      case 0x71:
        inst = 'OUT (C),0';
        break;
      case 0x72:
        inst = 'SBC HL,SP';
        break;
      case 0x73:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),SP';
        address = address + 2;
        break;
      case 0x78:
        inst = 'IN A,(C)';
        break;
      case 0x79:
        inst = 'OUT (C),A';
        break;
      case 0x7A:
        inst = 'ADC HL,SP';
        break;
      case 0x7B:
        inst = 'LD SP,(' + toHex(this.readMemWord(address)) + ')';
        address = address + 2;
        break;
      case 0xA0:
        inst = 'LDI';
        break;
      case 0xA1:
        inst = 'CPI';
        break;
      case 0xA2:
        inst = 'INI';
        break;
      case 0xA3:
        inst = 'OUTI';
        break;
      case 0xA8:
        inst = 'LDD';
        break;
      case 0xA9:
        inst = 'CPD';
        break;
      case 0xAA:
        inst = 'IND';
        break;
      case 0xAB:
        inst = 'OUTD';
        break;
      case 0xB0:
        inst = 'LDIR';
        break;
      case 0xB1:
        inst = 'CPIR';
        break;
      case 0xB2:
        inst = 'INIR';
        break;
      case 0xB3:
        inst = 'OTIR';
        break;
      case 0xB8:
        inst = 'LDDR';
        break;
      case 0xB9:
        inst = 'CPDR';
        break;
      case 0xBA:
        inst = 'INDR';
        break;
      case 0xBB:
        inst = 'OTDR';
        break;
    }

    return {
      opcode: toHex(opcode),
      inst: inst,
      address: currAddr,
      nextAddress: address
    };
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * @param {string} index
   * @param {number} address
   * @return {Object}
   */
  getIndex: function(index, address) {
    var toHex = JSSMS.Utils.toHex;
    var opcode = this.readMem(address);
    var opcode_ = toHex(opcode);
    var inst = 'Unimplemented DD/FD Opcode';
    var currAddr = address;
    address++;

    switch (opcode) {
      case 0x09:
        inst = 'ADD ' + index + ',BC';
        break;
      case 0x19:
        inst = 'ADD ' + index + ',DE';
        break;
      case 0x21:
        inst = 'LD ' + index + ',' + toHex(this.readMemWord(address));
        address = address + 2;
        break;
      case 0x22:
        inst = 'LD (' + toHex(this.readMemWord(address)) + '),' + index;
        address = address + 2;
        break;
      case 0x23:
        inst = 'INC ' + index;
        break;
      case 0x24:
        inst = 'INC ' + index + 'H *';
        break;
      case 0x25:
        inst = 'DEC ' + index + 'H *';
        break;
      case 0x26:
        inst = 'LD ' + index + 'H,' + toHex(this.readMem(address)) + ' *';
        address++;
        break;
      case 0x29:
        inst = 'ADD ' + index + '  ' + index;
        break;
      case 0x2A:
        inst = 'LD ' + index + ' (' + toHex(this.readMemWord(address)) + ')';
        address = address + 2;
        break;
      case 0x2B:
        inst = 'DEC ' + index;
        break;
      case 0x2C:
        inst = 'INC ' + index + 'L *';
        break;
      case 0x2D:
        inst = 'DEC ' + index + 'L *';
        break;
      case 0x2E:
        inst = 'LD ' + index + 'L,' + toHex(this.readMem(address));
        address++;
        break;
      case 0x34:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'INC (' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x35:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'DEC (' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x36:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),' + toHex(this.readMem(address));
        address++;
        break;
      case 0x39:
        inst = 'ADD ' + index + ' SP';
        break;
      case 0x44:
        inst = 'LD B,' + index + 'H *';
        break;
      case 0x45:
        inst = 'LD B,' + index + 'L *';
        break;
      case 0x46:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD B,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x4C:
        inst = 'LD C,' + index + 'H *';
        break;
      case 0x4D:
        inst = 'LD C,' + index + 'L *';
        break;
      case 0x4E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD C,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x54:
        inst = 'LD D,' + index + 'H *';
        break;
      case 0x55:
        inst = 'LD D,' + index + 'L *';
        break;
      case 0x56:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD D,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x5C:
        inst = 'LD E,' + index + 'H *';
        break;
      case 0x5D:
        inst = 'LD E,' + index + 'L *';
        break;
      case 0x5E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD E,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x60:
        inst = 'LD ' + index + 'H,B *';
        break;
      case 0x61:
        inst = 'LD ' + index + 'H,C *';
        break;
      case 0x62:
        inst = 'LD ' + index + 'H,D *';
        break;
      case 0x63:
        inst = 'LD ' + index + 'H,E *';
        break;
      case 0x64:
        inst = 'LD ' + index + 'H,' + index + 'H*';
        break;
      case 0x65:
        inst = 'LD ' + index + 'H,' + index + 'L *';
        break;
      case 0x66:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD H,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x67:
        inst = 'LD ' + index + 'H,A *';
        break;
      case 0x68:
        inst = 'LD ' + index + 'L,B *';
        break;
      case 0x69:
        inst = 'LD ' + index + 'L,C *';
        break;
      case 0x6A:
        inst = 'LD ' + index + 'L,D *';
        break;
      case 0x6B:
        inst = 'LD ' + index + 'L,E *';
        break;
      case 0x6C:
        inst = 'LD ' + index + 'L,' + index + 'H *';
        break;
      case 0x6D:
        inst = 'LD ' + index + 'L,' + index + 'L *';
        break;
      case 0x6E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD L,(' + index + sign + toHex(offset) + ')';
        address++;
        break;
      case 0x6F:
        inst = 'LD ' + index + 'L,A *';
        break;
      case 0x70:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),B';
        address++;
        break;
      case 0x71:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),C';
        address++;
        break;
      case 0x72:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),D';
        address++;
        break;
      case 0x73:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),E';
        address++;
        break;
      case 0x74:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),H';
        address++;
        break;
      case 0x75:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),L';
        address++;
        break;
      case 0x77:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD (' + index + sign + toHex(offset) + '),A';
        address++;
        break;
      case 0x7C:
        inst = 'LD A,' + index + 'H *';
        break;
      case 0x7D:
        inst = 'LD A,' + index + 'L *';
        break;
      case 0x7E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'LD A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0x84:
        inst = 'ADD A,' + index + 'H *';
        break;
      case 0x85:
        inst = 'ADD A,' + index + 'L *';
        break;
      case 0x86:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'ADD A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0x8C:
        inst = 'ADC A,' + index + 'H *';
        break;
      case 0x8D:
        inst = 'ADC A,' + index + 'L *';
        break;
      case 0x8E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'ADC A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0x94:
        inst = 'SUB ' + index + 'H *';
        break;
      case 0x95:
        inst = 'SUB ' + index + 'L *';
        break;
      case 0x96:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'SUB A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0x9C:
        inst = 'SBC A,' + index + 'H *';
        break;
      case 0x9D:
        inst = 'SBC A,' + index + 'L *';
        break;
      case 0x9E:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'SBC A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0xA4:
        inst = 'AND ' + index + 'H *';
        break;
      case 0xA5:
        inst = 'AND ' + index + 'L *';
        break;
      case 0xA6:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'AND A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0xAC:
        inst = 'XOR A ' + index + 'H*';
        break;
      case 0xAD:
        inst = 'XOR A ' + index + 'L*';
        break;
      case 0xAE:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'XOR A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0xB4:
        inst = 'OR A ' + index + 'H*';
        break;
      case 0xB5:
        inst = 'OR A ' + index + 'L*';
        break;
      case 0xB6:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'OR A,(' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0xBC:
        inst = 'CP ' + index + 'H *';
        break;
      case 0xBD:
        inst = 'CP ' + index + 'L *';
        break;
      case 0xBE:
        var offset = this.signExtend(this.readMem(address));
        var sign = offset > 0 ? '+' : '-';
        inst = 'CP (' + index + sign + toHex(offset) + '))';
        address++;
        break;
      case 0xCB:
        var _inst = this.getIndexCB(index, address);
        inst = _inst.inst;
        opcode_ += ' ' + _inst.opcode;
        address = _inst.nextAddress;
        // @todo
        break;
      case 0xE1:
        inst = 'POP ' + index;
        break;
      case 0xE3:
        inst = 'EX SP,(' + index + ')';
        break;
      case 0xE5:
        inst = 'PUSH ' + index;
        break;
      case 0xE9:
        inst = 'JP (' + index + ')';
        address = null;
        break;
      case 0xF9:
        inst = 'LD SP,' + index;
        break;
    }

    return {
      opcode: opcode_,
      inst: inst,
      address: currAddr,
      nextAddress: address
    };
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * @param {string} index
   * @param {number} address
   * @return {Object}
   */
  getIndexCB: function(index, address) {
    var toHex = JSSMS.Utils.toHex;
    var opcode = this.readMem(address);
    var inst = 'Unimplemented DDCB or FDCB Opcode';
    var currAddr = address;
    address++;

    switch (opcode) {
      case 0x00:
        inst = 'LD B,RLC (' + index + ')';
        break;
      case 0x01:
        inst = 'LD C,RLC (' + index + ')';
        break;
      case 0x02:
        inst = 'LD D,RLC (' + index + ')';
        break;
      case 0x03:
        inst = 'LD E,RLC (' + index + ')';
        break;
      case 0x04:
        inst = 'LD H,RLC (' + index + ')';
        break;
      case 0x05:
        inst = 'LD L,RLC (' + index + ')';
        break;
      case 0x06:
        inst = 'RLC (' + index + ')';
        break;
      case 0x07:
        inst = 'LD A,RLC (' + index + ')';
        break;
      case 0x08:
        inst = 'LD B,RRC (' + index + ')';
        break;
      case 0x09:
        inst = 'LD C,RRC (' + index + ')';
        break;
      case 0x0A:
        inst = 'LD D,RRC (' + index + ')';
        break;
      case 0x0B:
        inst = 'LD E,RRC (' + index + ')';
        break;
      case 0x0C:
        inst = 'LD H,RRC (' + index + ')';
        break;
      case 0x0D:
        inst = 'LD L,RRC (' + index + ')';
        break;
      case 0x0E:
        inst = 'RRC (' + index + ')';
        break;
      case 0x0F:
        inst = 'LD A,RRC (' + index + ')';
        break;
      case 0x10:
        inst = 'LD B,RL (' + index + ')';
        break;
      case 0x11:
        inst = 'LD C,RL (' + index + ')';
        break;
      case 0x12:
        inst = 'LD D,RL (' + index + ')';
        break;
      case 0x13:
        inst = 'LD E,RL (' + index + ')';
        break;
      case 0x14:
        inst = 'LD H,RL (' + index + ')';
        break;
      case 0x15:
        inst = 'LD L,RL (' + index + ')';
        break;
      case 0x16:
        inst = 'RL (' + index + ')';
        break;
      case 0x17:
        inst = 'LD A,RL (' + index + ')';
        break;
      case 0x18:
        inst = 'LD B,RR (' + index + ')';
        break;
      case 0x19:
        inst = 'LD C,RR (' + index + ')';
        break;
      case 0x1A:
        inst = 'LD D,RR (' + index + ')';
        break;
      case 0x1B:
        inst = 'LD E,RR (' + index + ')';
        break;
      case 0x1C:
        inst = 'LD H,RR (' + index + ')';
        break;
      case 0x1D:
        inst = 'LD L,RR (' + index + ')';
        break;
      case 0x1E:
        inst = 'RR (' + index + ')';
        break;
      case 0x1F:
        inst = 'LD A,RR (' + index + ')';
        break;
      case 0x20:
        inst = 'LD B,SLA (' + index + ')';
        break;
      case 0x21:
        inst = 'LD C,SLA (' + index + ')';
        break;
      case 0x22:
        inst = 'LD D,SLA (' + index + ')';
        break;
      case 0x23:
        inst = 'LD E,SLA (' + index + ')';
        break;
      case 0x24:
        inst = 'LD H,SLA (' + index + ')';
        break;
      case 0x25:
        inst = 'LD L,SLA (' + index + ')';
        break;
      case 0x26:
        inst = 'SLA (' + index + ')';
        break;
      case 0x27:
        inst = 'LD A,SLA (' + index + ')';
        break;
      case 0x28:
        inst = 'LD B,SRA (' + index + ')';
        break;
      case 0x29:
        inst = 'LD C,SRA (' + index + ')';
        break;
      case 0x2A:
        inst = 'LD D,SRA (' + index + ')';
        break;
      case 0x2B:
        inst = 'LD E,SRA (' + index + ')';
        break;
      case 0x2C:
        inst = 'LD H,SRA (' + index + ')';
        break;
      case 0x2D:
        inst = 'LD L,SRA (' + index + ')';
        break;
      case 0x2E:
        inst = 'SRA (' + index + ')';
        break;
      case 0x2F:
        inst = 'LD A,SRA (' + index + ')';
        break;
      case 0x30:
        inst = 'LD B,SLL (' + index + ')';
        break;
      case 0x31:
        inst = 'LD C,SLL (' + index + ')';
        break;
      case 0x32:
        inst = 'LD D,SLL (' + index + ')';
        break;
      case 0x33:
        inst = 'LD E,SLL (' + index + ')';
        break;
      case 0x34:
        inst = 'LD H,SLL (' + index + ')';
        break;
      case 0x35:
        inst = 'LD L,SLL (' + index + ')';
        break;
      case 0x36:
        inst = 'SLL (' + index + ') *';
        break;
      case 0x37:
        inst = 'LD A,SLL (' + index + ')';
        break;
      case 0x38:
        inst = 'LD B,SRL (' + index + ')';
        break;
      case 0x39:
        inst = 'LD C,SRL (' + index + ')';
        break;
      case 0x3A:
        inst = 'LD D,SRL (' + index + ')';
        break;
      case 0x3B:
        inst = 'LD E,SRL (' + index + ')';
        break;
      case 0x3C:
        inst = 'LD H,SRL (' + index + ')';
        break;
      case 0x3D:
        inst = 'LD L,SRL (' + index + ')';
        break;
      case 0x3E:
        inst = 'SRL (' + index + ')';
        break;
      case 0x3F:
        inst = 'LD A,SRL (' + index + ')';
        break;
      case 0x40:
      case 0x41:
      case 0x42:
      case 0x43:
      case 0x44:
      case 0x45:
      case 0x46:
      case 0x47:
        inst = 'BIT 0,(' + index + ')';
        break;
      case 0x48:
      case 0x49:
      case 0x4A:
      case 0x4B:
      case 0x4C:
      case 0x4D:
      case 0x4E:
      case 0x4F:
        inst = 'BIT 1,(' + index + ')';
        break;
      case 0x50:
      case 0x51:
      case 0x52:
      case 0x53:
      case 0x54:
      case 0x55:
      case 0x56:
      case 0x57:
        inst = 'BIT 2,(' + index + ')';
        break;
      case 0x58:
      case 0x59:
      case 0x5A:
      case 0x5B:
      case 0x5C:
      case 0x5D:
      case 0x5E:
      case 0x5F:
        inst = 'BIT 3,(' + index + ')';
        break;
      case 0x60:
      case 0x61:
      case 0x62:
      case 0x63:
      case 0x64:
      case 0x65:
      case 0x66:
      case 0x67:
        inst = 'BIT 4,(' + index + ')';
        break;
      case 0x68:
      case 0x69:
      case 0x6A:
      case 0x6B:
      case 0x6C:
      case 0x6D:
      case 0x6E:
      case 0x6F:
        inst = 'BIT 5,(' + index + ')';
        break;
      case 0x70:
      case 0x71:
      case 0x72:
      case 0x73:
      case 0x74:
      case 0x75:
      case 0x76:
      case 0x77:
        inst = 'BIT 6,(' + index + ')';
        break;
      case 0x78:
      case 0x79:
      case 0x7A:
      case 0x7B:
      case 0x7C:
      case 0x7D:
      case 0x7E:
      case 0x7F:
        inst = 'BIT 7,(' + index + ')';
        break;
      case 0x80:
      case 0x81:
      case 0x82:
      case 0x83:
      case 0x84:
      case 0x85:
      case 0x86:
      case 0x87:
        inst = 'RES 0,(' + index + ')';
        break;
      case 0x88:
      case 0x89:
      case 0x8A:
      case 0x8B:
      case 0x8C:
      case 0x8D:
      case 0x8E:
      case 0x8F:
        inst = 'RES 1,(' + index + ')';
        break;
      case 0x90:
      case 0x91:
      case 0x92:
      case 0x93:
      case 0x94:
      case 0x95:
      case 0x96:
      case 0x97:
        inst = 'RES 2,(' + index + ')';
        break;
      case 0x98:
      case 0x99:
      case 0x9A:
      case 0x9B:
      case 0x9C:
      case 0x9D:
      case 0x9E:
      case 0x9F:
        inst = 'RES 3,(' + index + ')';
        break;
      case 0xA0:
      case 0xA1:
      case 0xA2:
      case 0xA3:
      case 0xA4:
      case 0xA5:
      case 0xA6:
      case 0xA7:
        inst = 'RES 4,(' + index + ')';
        break;
      case 0xA8:
      case 0xA9:
      case 0xAA:
      case 0xAB:
      case 0xAC:
      case 0xAD:
      case 0xAE:
      case 0xAF:
        inst = 'RES 5,(' + index + ')';
        break;
      case 0xB0:
      case 0xB1:
      case 0xB2:
      case 0xB3:
      case 0xB4:
      case 0xB5:
      case 0xB6:
      case 0xB7:
        inst = 'RES 6,(' + index + ')';
        break;
      case 0xB8:
      case 0xB9:
      case 0xBA:
      case 0xBB:
      case 0xBC:
      case 0xBD:
      case 0xBE:
      case 0xBF:
        inst = 'RES 7,(' + index + ')';
        break;
      case 0xC0:
      case 0xC1:
      case 0xC2:
      case 0xC3:
      case 0xC4:
      case 0xC5:
      case 0xC6:
      case 0xC7:
        inst = 'SET 0,(' + index + ')';
        break;
      case 0xC8:
      case 0xC9:
      case 0xCA:
      case 0xCB:
      case 0xCC:
      case 0xCD:
      case 0xCE:
      case 0xCF:
        inst = 'SET 1,(' + index + ')';
        break;
      case 0xD0:
      case 0xD1:
      case 0xD2:
      case 0xD3:
      case 0xD4:
      case 0xD5:
      case 0xD6:
      case 0xD7:
        inst = 'SET 2,(' + index + ')';
        break;
      case 0xD8:
      case 0xD9:
      case 0xDA:
      case 0xDB:
      case 0xDC:
      case 0xDD:
      case 0xDE:
      case 0xDF:
        inst = 'SET 3,(' + index + ')';
        break;
      case 0xE0:
      case 0xE1:
      case 0xE2:
      case 0xE3:
      case 0xE4:
      case 0xE5:
      case 0xE6:
      case 0xE7:
        inst = 'SET 4,(' + index + ')';
        break;
      case 0xE8:
      case 0xE9:
      case 0xEA:
      case 0xEB:
      case 0xEC:
      case 0xED:
      case 0xEE:
      case 0xEF:
        inst = 'SET 5,(' + index + ')';
        break;
      case 0xF0:
      case 0xF1:
      case 0xF2:
      case 0xF3:
      case 0xF4:
      case 0xF5:
      case 0xF6:
      case 0xF7:
        inst = 'SET 6,(' + index + ')';
        break;
      case 0xF8:
      case 0xF9:
      case 0xFA:
      case 0xFB:
      case 0xFC:
      case 0xFD:
      case 0xFE:
      case 0xFF:
        inst = 'SET 7,(' + index + ')';
        break;
    }

    return {
      opcode: toHex(opcode),
      inst: inst,
      address: currAddr,
      nextAddress: address
    };
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * \@todo Use currying here.
   * @param {number} opcode
   * @return {Object}
   */
  getIndexOpIX: function(opcode) {
    return this.getIndex('IX', opcode);
  },


  /**
   * Returns the instruction associated to an opcode for debugging purposes
   *
   * \@todo Use currying here.
   * @param {number} opcode
   * @return {Object}
   */
  getIndexOpIY: function(opcode) {
    return this.getIndex('IY', opcode);
  },


  /**
   * @param {number} d
   * @return {number}
   */
  signExtend: function(d) {
    if (d >= 128) {
      d = d - 256;
    }
    return d;
  }
};


/**
 * \@todo Move elsewhere.
 * @param {number} address
 */
function Instruction(address) {
  return {
    address: address,
    opcode: '',
    inst: '',
    hexAddress: JSSMS.Utils.toHex(address),
    nextAddress: 0,
    target: 0,
    isJumpTarget: false
    // Memory can be registry or offset, read or write mode, 8 or 16 bit.
    /*memory: null,

     srcRegs: {},
     dstRegs: {}*/
  };
}
