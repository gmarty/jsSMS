/**
 * jsSMS - A Sega Master System/Game Gear emulator in JavaScript
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
 * @todo Keep a track of memory locations parsed.
 */
var Parser = (function() {
  /** @const */ var ACCURATE_INTERRUPT_EMULATION = true;
  var toHex = JSSMS.Utils.toHex;

  /**
   * @param {Array.<Array|DataView>} rom
   * @param {Array.<number>} frameReg
   * @constructor
   */
  var parser = function(rom, frameReg) {
    this.stream = new RomStream(rom);
    this.frameReg = frameReg;

    this.addresses = Array(rom.length);
    this.entryPoints = [];
    this.bytecodes = Array(rom.length);

    for (var i = 0; i < rom.length; i++) {
      this.addresses[i] = [];
      this.bytecodes[i] = [];
    }
  };

  parser.prototype = {
    /**
     * Add an address to the queue.
     * @param {Object} obj
     */
    addEntryPoint: function(obj) {
      this.entryPoints.push(obj);
      this.addAddress(obj.address);
    },


    /**
     * Parse the bytecodes in the ROM.
     *
     * @param {number} page
     */
    parse: function(page) {
      JSSMS.Utils.console.time('Parsing');

      var currentPage;
      var pageStart;
      var pageEnd;

      if (page === undefined) {
        pageStart = 0x0000;
        pageEnd = this.stream.length - 1;
      } else {
        pageStart = 0x0000;
        pageEnd = 0x4000 - 1;
      }

      for (currentPage = 0; currentPage < this.addresses.length; currentPage++) {
        while (this.addresses[currentPage].length) {
          var currentObj = this.addresses[currentPage].shift();
          var currentAddress = currentObj.address % 0x4000;

          if (currentAddress < pageStart || currentAddress > pageEnd) {
            JSSMS.Utils.console.error('Address out of bound', toHex(currentAddress));
            continue;
          }

          // Make sure bytecodes are only parsed once.
          if (this.bytecodes[currentPage][currentAddress]) {
            continue;
          }

          var bytecode = new Bytecode(currentAddress, currentPage);
          this.bytecodes[currentPage][currentAddress] = disassemble(bytecode, this.stream);

          if (this.bytecodes[currentPage][currentAddress].nextAddress !== null &&
              this.bytecodes[currentPage][currentAddress].nextAddress >= pageStart &&
              this.bytecodes[currentPage][currentAddress].nextAddress <= pageEnd) {
            this.addAddress(this.bytecodes[currentPage][currentAddress].nextAddress);
          }
          if (this.bytecodes[currentPage][currentAddress].target !== null &&
              this.bytecodes[currentPage][currentAddress].target >= pageStart &&
              this.bytecodes[currentPage][currentAddress].target <= pageEnd) {
            this.addAddress(this.bytecodes[currentPage][currentAddress].target);
          }
        }
      }

      // We consider the first 0x0400 bytes as an independent memory page.
      if (this.bytecodes[0][0x03FF]) {
        this.bytecodes[0][0x03FF].isFunctionEnder = true;
      } else if (this.bytecodes[0][0x03FE]) {
        this.bytecodes[0][0x03FE].isFunctionEnder = true;
      }

      var i = 0;
      var length = 0;

      // Flag entry points as jump target.
      for (i = 0, length = this.entryPoints.length; i < length; i++) {
        var entryPoint = this.entryPoints[i].address;
        var romPage = this.entryPoints[i].romPage;

        this.bytecodes[romPage][entryPoint].isJumpTarget = true;
        this.bytecodes[romPage][entryPoint].jumpTargetNb++;
      }

      // Mark all jump target bytecodes.
      for (currentPage = 0; currentPage < this.bytecodes.length; currentPage++) {
        for (i = 0, length = this.bytecodes[currentPage].length; i < length; i++) {
          if (!this.bytecodes[currentPage][i]) {
            continue;
          }
          // Comparing with null is important here as `0` is a valid address (0x00).
          if (this.bytecodes[currentPage][i].nextAddress !== null &&
              this.bytecodes[currentPage][this.bytecodes[currentPage][i].nextAddress]) {
            this.bytecodes[currentPage][this.bytecodes[currentPage][i].nextAddress].jumpTargetNb++;
          }
          if (this.bytecodes[currentPage][i].target !== null) {
            var targetPage = ~~(this.bytecodes[currentPage][i].target / 0x4000);
            var targetAddress = this.bytecodes[currentPage][i].target % 0x4000;
            if (this.bytecodes[targetPage] && this.bytecodes[targetPage][targetAddress]) {
              this.bytecodes[targetPage][targetAddress].isJumpTarget = true;
              this.bytecodes[targetPage][targetAddress].jumpTargetNb++;
            } else {
              JSSMS.Utils.console.log('Invalid target address', toHex(this.bytecodes[currentPage][i].target));
            }
          }
        }
      }

      JSSMS.Utils.console.timeEnd('Parsing');
    },


    /**
     * This method only parsed a single function. The result of the parsing is added to the parsed
     * bytecodes array, but returns only the bytecodes newly parsed.
     *
     * @param {Object} obj
     * @return {Array}
     */
    parseFromAddress: function(obj) {
      var address = obj.address % 0x4000;
      var romPage = obj.romPage;

      var pageStart = romPage * 0x4000;
      var pageEnd = (romPage + 1) * 0x4000;
      var branch = [];
      var bytecode;

      var startingBytecode = true;
      var absoluteAddress = 0;

      // We consider the first 0x0400 bytes as an independent memory page.
      if (address < 0x0400 && romPage === 0) {
        pageStart = 0;
        pageEnd = 0x0400;
      }

      do {
        if (this.bytecodes[romPage][address]) {
          bytecode = this.bytecodes[romPage][address];
        } else {
          bytecode = new Bytecode(address, romPage);
          this.bytecodes[romPage][address] = disassemble(bytecode, this.stream);
        }

        if (bytecode.canEnd && !startingBytecode) {
          // Because canEnd tagged bytecodes are jump targets. This method doesn't tag jump
          // targets as opposed to a full parse().
          break;
        }

        address = bytecode.nextAddress % 0x4000;
        branch.push(bytecode);
        startingBytecode = false;
        absoluteAddress = address + (romPage * 0x4000);
      } while (address !== null && absoluteAddress >= pageStart && absoluteAddress < pageEnd && !bytecode.isFunctionEnder);

      return branch;
    },


    /**
     * Return a dot file representation of parsed bytecodes.
     *
     * @return {string} The content of a Dot file.
     */
    writeGraphViz: function() {
      JSSMS.Utils.console.time('DOT generation');

      var tree = this.bytecodes;
      var INDENT = ' ';

      var content = ['digraph G {'];

      for (var i = 0, length = tree.length; i < length; i++) {
        if (!tree[i]) {
          continue;
        }

        content.push(INDENT + i + ' [label="' + tree[i].label + '"];');

        if (tree[i].target !== null) {
          content.push(INDENT + i + ' -> ' + tree[i].target + ';');
        }

        if (tree[i].nextAddress !== null) {
          content.push(INDENT + i + ' -> ' + tree[i].nextAddress + ';');
        }
      }

      content.push('}');
      content = content.join('\n');

      // Inject entry point styling.
      content = content.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');

      JSSMS.Utils.console.timeEnd('DOT generation');

      return content;
    },


    /**
     * Add an address to the queue.
     * @param {number} address
     */
    addAddress: function(address) {
      var memPage = ~~(address / 0x4000);
      var romPage = this.frameReg[memPage];
      address = address % 0x4000;

      this.addresses[romPage].push({
        address: address,
        romPage: romPage,
        memPage: memPage
      });
    }
  };


  /**
   * Returns the bytecode associated to an opcode.
   *
   * @param {Bytecode} bytecode
   * @param {RomStream} stream
   * @return {Bytecode}
   */
  function disassemble(bytecode, stream) {
    stream.page = bytecode.page;
    stream.seek(bytecode.address + (stream.page * 0x4000));
    var opcode = stream.getUint8();

    var operand = null;
    var target = null;
    var isFunctionEnder = false;
    var canEnd = false;

    bytecode.opcode.push(opcode);

    switch (opcode) {
      case 0x00:
        break;
      case 0x01:
        operand = stream.getUint16();
        break;
      case 0x02:
        break;
      case 0x03:
        break;
      case 0x04:
        break;
      case 0x05:
        break;
      case 0x06:
        operand = stream.getUint8();
        break;
      case 0x07:
        break;
      case 0x08:
        break;
      case 0x09:
        break;
      case 0x0A:
        break;
      case 0x0B:
        break;
      case 0x0C:
        break;
      case 0x0D:
        break;
      case 0x0E:
        operand = stream.getUint8();
        break;
      case 0x0F:
        break;
      case 0x10:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 0x11:
        operand = stream.getUint16();
        break;
      case 0x12:
        break;
      case 0x13:
        break;
      case 0x14:
        break;
      case 0x15:
        break;
      case 0x16:
        operand = stream.getUint8();
        break;
      case 0x17:
        break;
      case 0x18:
        target = stream.position + stream.getInt8();
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0x19:
        break;
      case 0x1A:
        break;
      case 0x1B:
        break;
      case 0x1C:
        break;
      case 0x1D:
        break;
      case 0x1E:
        operand = stream.getUint8();
        break;
      case 0x1F:
        break;
      case 0x20:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 0x21:
        operand = stream.getUint16();
        break;
      case 0x22:
        operand = stream.getUint16();
        break;
      case 0x23:
        break;
      case 0x24:
        break;
      case 0x25:
        break;
      case 0x26:
        operand = stream.getUint8();
        break;
      case 0x27:
        break;
      case 0x28:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 0x29:
        break;
      case 0x2A:
        operand = stream.getUint16();
        break;
      case 0x2B:
        break;
      case 0x2C:
        break;
      case 0x2D:
        break;
      case 0x2E:
        operand = stream.getUint8();
        break;
      case 0x2F:
        break;
      case 0x30:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 0x31:
        operand = stream.getUint16();
        break;
      case 0x32:
        operand = stream.getUint16();
        break;
      case 0x33:
        break;
      case 0x34:
        break;
      case 0x35:
        break;
      case 0x36:
        operand = stream.getUint8();
        break;
      case 0x37:
        break;
      case 0x38:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 0x39:
        break;
      case 0x3A:
        operand = stream.getUint16();
        break;
      case 0x3B:
        break;
      case 0x3C:
        break;
      case 0x3D:
        break;
      case 0x3E:
        operand = stream.getUint8();
        break;
      case 0x3F:
        break;
      case 0x40:
        break;
      case 0x41:
        break;
      case 0x42:
        break;
      case 0x43:
        break;
      case 0x44:
        break;
      case 0x45:
        break;
      case 0x46:
        break;
      case 0x47:
        break;
      case 0x48:
        break;
      case 0x49:
        break;
      case 0x4A:
        break;
      case 0x4B:
        break;
      case 0x4C:
        break;
      case 0x4D:
        break;
      case 0x4E:
        break;
      case 0x4F:
        break;
      case 0x50:
        break;
      case 0x51:
        break;
      case 0x52:
        break;
      case 0x53:
        break;
      case 0x54:
        break;
      case 0x55:
        break;
      case 0x56:
        break;
      case 0x57:
        break;
      case 0x58:
        break;
      case 0x59:
        break;
      case 0x5A:
        break;
      case 0x5B:
        break;
      case 0x5C:
        break;
      case 0x5D:
        break;
      case 0x5E:
        break;
      case 0x5F:
        break;
      case 0x60:
        break;
      case 0x61:
        break;
      case 0x62:
        break;
      case 0x63:
        break;
      case 0x64:
        break;
      case 0x65:
        break;
      case 0x66:
        break;
      case 0x67:
        break;
      case 0x68:
        break;
      case 0x69:
        break;
      case 0x6A:
        break;
      case 0x6B:
        break;
      case 0x6C:
        break;
      case 0x6D:
        break;
      case 0x6E:
        break;
      case 0x6F:
        break;
      case 0x70:
        break;
      case 0x71:
        break;
      case 0x72:
        break;
      case 0x73:
        break;
      case 0x74:
        break;
      case 0x75:
        break;
      case 0x76:
        // `HALT` ends a function unless we find a better way.
        isFunctionEnder = true;
        break;
      case 0x77:
        break;
      case 0x78:
        break;
      case 0x79:
        break;
      case 0x7A:
        break;
      case 0x7B:
        break;
      case 0x7C:
        break;
      case 0x7D:
        break;
      case 0x7E:
        break;
      case 0x7F:
        break;
      case 0x80:
        break;
      case 0x81:
        break;
      case 0x82:
        break;
      case 0x83:
        break;
      case 0x84:
        break;
      case 0x85:
        break;
      case 0x86:
        break;
      case 0x87:
        break;
      case 0x88:
        break;
      case 0x89:
        break;
      case 0x8A:
        break;
      case 0x8B:
        break;
      case 0x8C:
        break;
      case 0x8D:
        break;
      case 0x8E:
        break;
      case 0x8F:
        break;
      case 0x90:
        break;
      case 0x91:
        break;
      case 0x92:
        break;
      case 0x93:
        break;
      case 0x94:
        break;
      case 0x95:
        break;
      case 0x96:
        break;
      case 0x97:
        break;
      case 0x98:
        break;
      case 0x99:
        break;
      case 0x9A:
        break;
      case 0x9B:
        break;
      case 0x9C:
        break;
      case 0x9D:
        break;
      case 0x9E:
        break;
      case 0x9F:
        break;
      case 0xA0:
        break;
      case 0xA1:
        break;
      case 0xA2:
        break;
      case 0xA3:
        break;
      case 0xA4:
        break;
      case 0xA5:
        break;
      case 0xA6:
        break;
      case 0xA7:
        break;
      case 0xA8:
        break;
      case 0xA9:
        break;
      case 0xAA:
        break;
      case 0xAB:
        break;
      case 0xAC:
        break;
      case 0xAD:
        break;
      case 0xAE:
        break;
      case 0xAF:
        break;
      case 0xB0:
        break;
      case 0xB1:
        break;
      case 0xB2:
        break;
      case 0xB3:
        break;
      case 0xB4:
        break;
      case 0xB5:
        break;
      case 0xB6:
        break;
      case 0xB7:
        break;
      case 0xB8:
        break;
      case 0xB9:
        break;
      case 0xBA:
        break;
      case 0xBB:
        break;
      case 0xBC:
        break;
      case 0xBD:
        break;
      case 0xBE:
        break;
      case 0xBF:
        break;
      case 0xC0:
        canEnd = true;
        break;
      case 0xC1:
        break;
      case 0xC2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xC3:
        target = stream.getUint16();
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xC4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xC5:
        break;
      case 0xC6:
        operand = stream.getUint8();
        break;
      case 0xC7:
        target = 0x00;
        isFunctionEnder = true;
        break;
      case 0xC8:
        canEnd = true;
        break;
      case 0xC9:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xCA:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xCB:
        return getCB(bytecode, stream);
      case 0xCC:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xCD:
        target = stream.getUint16();
        isFunctionEnder = true;
        break;
      case 0xCE:
        operand = stream.getUint8();
        break;
      case 0xCF:
        target = 0x08;
        isFunctionEnder = true;
        break;
      case 0xD0:
        canEnd = true;
        break;
      case 0xD1:
        break;
      case 0xD2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xD3:
        operand = stream.getUint8();
        break;
      case 0xD4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xD5:
        break;
      case 0xD6:
        operand = stream.getUint8();
        break;
      case 0xD7:
        target = 0x10;
        isFunctionEnder = true;
        break;
      case 0xD8:
        canEnd = true;
        break;
      case 0xD9:
        break;
      case 0xDA:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xDB:
        operand = stream.getUint8();
        break;
      case 0xDC:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xDD:
        return getIndex(bytecode, stream);
      case 0xDE:
        operand = stream.getUint8();
        break;
      case 0xDF:
        target = 0x18;
        isFunctionEnder = true;
        break;
      case 0xE0:
        canEnd = true;
        break;
      case 0xE1:
        break;
      case 0xE2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xE3:
        break;
      case 0xE4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xE5:
        break;
      case 0xE6:
        operand = stream.getUint8();
        break;
      case 0xE7:
        target = 0x20;
        isFunctionEnder = true;
        break;
      case 0xE8:
        canEnd = true;
        break;
      case 0xE9:
        // This target can't be determined using static analysis.
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xEA:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xEB:
        break;
      case 0xEC:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xED:
        return getED(bytecode, stream);
      case 0xEE:
        operand = stream.getUint8();
        break;
      case 0xEF:
        target = 0x28;
        isFunctionEnder = true;
        break;
      case 0xF0:
        canEnd = true;
        break;
      case 0xF1:
        break;
      case 0xF2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xF3:
        break;
      case 0xF4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xF5:
        break;
      case 0xF6:
        operand = stream.getUint8();
        break;
      case 0xF7:
        target = 0x30;
        isFunctionEnder = true;
        break;
      case 0xF8:
        canEnd = true;
        break;
      case 0xF9:
        break;
      case 0xFA:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xFB:
        break;
      case 0xFC:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xFD:
        return getIndex(bytecode, stream);
      case 0xFE:
        operand = stream.getUint8();
        break;
      case 0xFF:
        target = 0x38;
        isFunctionEnder = true;
        break;
      default:
        JSSMS.Utils.console.error('Unexpected opcode', toHex(opcode));
    }

    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.target = target;
    bytecode.isFunctionEnder = isFunctionEnder;
    bytecode.canEnd = canEnd;

    return bytecode;
  }


  /**
   * Returns the bytecode associated to an opcode.
   *
   * @param {Bytecode} bytecode
   * @param {RomStream} stream
   * @return {Bytecode}
   */
  function getCB(bytecode, stream) {
    var opcode = stream.getUint8();

    bytecode.opcode.push(opcode);
    bytecode.nextAddress = stream.position;

    return bytecode;
  }


  /**
   * Returns the bytecode associated to an opcode.
   *
   * @param {Bytecode} bytecode
   * @param {RomStream} stream
   * @return {Bytecode}
   */
  function getED(bytecode, stream) {
    var opcode = stream.getUint8();

    var operand = null;
    var target = null;
    var isFunctionEnder = false;
    var canEnd = false;

    bytecode.opcode.push(opcode);

    switch (opcode) {
      case 0x40:
        break;
      case 0x41:
        break;
      case 0x42:
        break;
      case 0x43:
        operand = stream.getUint16();
        break;
      case 0x44:
      case 0x4C:
      case 0x54:
      case 0x5C:
      case 0x64:
      case 0x6C:
      case 0x74:
      case 0x7C:
        break;
      case 0x45:
      case 0x4D:
      case 0x55:
      case 0x5D:
      case 0x65:
      case 0x6D:
      case 0x75:
      case 0x7D:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0x46:
      case 0x4E:
      case 0x66:
      case 0x6E:
        break;
      case 0x47:
        break;
      case 0x48:
        break;
      case 0x49:
        break;
      case 0x4A:
        break;
      case 0x4B:
        operand = stream.getUint16();
        break;
      case 0x4F:
        break;
      case 0x50:
        break;
      case 0x51:
        break;
      case 0x52:
        break;
      case 0x53:
        operand = stream.getUint16();
        break;
      case 0x56:
      case 0x76:
        break;
      case 0x57:
        break;
      case 0x58:
        break;
      case 0x59:
        break;
      case 0x5A:
        break;
      case 0x5B:
        operand = stream.getUint16();
        break;
      case 0x5F:
        break;
      case 0x60:
        break;
      case 0x61:
        break;
      case 0x62:
        break;
      case 0x63:
        operand = stream.getUint16();
        break;
      case 0x67:
        break;
      case 0x68:
        break;
      case 0x69:
        break;
      case 0x6A:
        break;
      case 0x6B:
        operand = stream.getUint16();
        break;
      case 0x6F:
        break;
      case 0x71:
        break;
      case 0x72:
        break;
      case 0x73:
        operand = stream.getUint16();
        break;
      case 0x78:
        break;
      case 0x79:
        break;
      case 0x7A:
        break;
      case 0x7B:
        operand = stream.getUint16();
        break;
      case 0xA0:
        break;
      case 0xA1:
        break;
      case 0xA2:
        break;
      case 0xA3:
        break;
      case 0xA8:
        break;
      case 0xA9:
        break;
      case 0xAA:
        break;
      case 0xAB:
        break;
      case 0xB0:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xB1:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xB2:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xB3:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xB8:
        break;
      case 0xB9:
        break;
      case 0xBA:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xBB:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      default:
        JSSMS.Utils.console.error('Unexpected opcode', '0xED ' + toHex(opcode));
    }

    if (bytecode.address >= 0x3FFF) {
      isFunctionEnder = true;
      bytecode.changePage = true;
    }

    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.target = target;
    bytecode.isFunctionEnder = isFunctionEnder;
    bytecode.canEnd = canEnd;

    return bytecode;
  }


  /**
   * Returns the bytecode associated to an opcode.
   *
   * @param {Bytecode} bytecode
   * @param {RomStream} stream
   * @return {Bytecode}
   */
  function getIndex(bytecode, stream) {
    var opcode = stream.getUint8();

    var operand = null;
    var isFunctionEnder = false;

    bytecode.opcode.push(opcode);

    switch (opcode) {
      case 0x09:
        break;
      case 0x19:
        break;
      case 0x21:
        operand = stream.getUint16();
        break;
      case 0x22:
        operand = stream.getUint16();
        break;
      case 0x23:
        break;
      case 0x24:
        break;
      case 0x25:
        break;
      case 0x26:
        operand = stream.getUint8();
        break;
      case 0x29:
        break;
      case 0x2A:
        operand = stream.getUint16();
        break;
      case 0x2B:
        break;
      case 0x2C:
        break;
      case 0x2D:
        break;
      case 0x2E:
        operand = stream.getUint8();
        break;
      case 0x34:
        operand = stream.getUint8();
        break;
      case 0x35:
        operand = stream.getUint8();
        break;
      case 0x36:
        // Actually 2 bytes (offset + value).
        operand = stream.getUint16();
        break;
      case 0x39:
        break;
      case 0x44:
        break;
      case 0x45:
        break;
      case 0x46:
        operand = stream.getUint8();
        break;
      case 0x4C:
        break;
      case 0x4D:
        break;
      case 0x4E:
        operand = stream.getUint8();
        break;
      case 0x54:
        break;
      case 0x55:
        break;
      case 0x56:
        operand = stream.getUint8();
        break;
      case 0x5C:
        break;
      case 0x5D:
        break;
      case 0x5E:
        operand = stream.getUint8();
        break;
      case 0x60:
        break;
      case 0x61:
        break;
      case 0x62:
        break;
      case 0x63:
        break;
      case 0x64:
        break;
      case 0x65:
        break;
      case 0x66:
        operand = stream.getUint8();
        break;
      case 0x67:
        break;
      case 0x68:
        break;
      case 0x69:
        break;
      case 0x6A:
        break;
      case 0x6B:
        break;
      case 0x6C:
        break;
      case 0x6D:
        break;
      case 0x6E:
        operand = stream.getUint8();
        break;
      case 0x6F:
        break;
      case 0x70:
        operand = stream.getUint8();
        break;
      case 0x71:
        operand = stream.getUint8();
        break;
      case 0x72:
        operand = stream.getUint8();
        break;
      case 0x73:
        operand = stream.getUint8();
        break;
      case 0x74:
        operand = stream.getUint8();
        break;
      case 0x75:
        operand = stream.getUint8();
        break;
      case 0x77:
        operand = stream.getUint8();
        break;
      case 0x7C:
        break;
      case 0x7D:
        break;
      case 0x7E:
        operand = stream.getUint8();
        break;
      case 0x84:
        break;
      case 0x85:
        break;
      case 0x86:
        operand = stream.getUint8();
        break;
      case 0x8C:
        break;
      case 0x8D:
        break;
      case 0x8E:
        operand = stream.getUint8();
        break;
      case 0x94:
        break;
      case 0x95:
        break;
      case 0x96:
        operand = stream.getUint8();
        break;
      case 0x9C:
        break;
      case 0x9D:
        break;
      case 0x9E:
        operand = stream.getUint8();
        break;
      case 0xA4:
        break;
      case 0xA5:
        break;
      case 0xA6:
        operand = stream.getUint8();
        break;
      case 0xAC:
        break;
      case 0xAD:
        break;
      case 0xAE:
        operand = stream.getUint8();
        break;
      case 0xB4:
        break;
      case 0xB5:
        break;
      case 0xB6:
        operand = stream.getUint8();
        break;
      case 0xBC:
        break;
      case 0xBD:
        break;
      case 0xBE:
        operand = stream.getUint8();
        break;
      case 0xCB:
        return getIndexCB(bytecode, stream);
      case 0xE1:
        break;
      case 0xE3:
        break;
      case 0xE5:
        break;
      case 0xE9:
        // This target can't be determined using static analysis.
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xF9:
        break;
      default:
        JSSMS.Utils.console.error('Unexpected opcode', '0xDD/0xFD ' + toHex(opcode));
    }

    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.isFunctionEnder = isFunctionEnder;

    return bytecode;
  }


  /**
   * Returns the bytecode associated to an opcode.
   *
   * @param {Bytecode} bytecode
   * @param {RomStream} stream
   * @return {Bytecode}
   */
  function getIndexCB(bytecode, stream) {
    var operand = stream.getUint8();
    var opcode = stream.getUint8();

    bytecode.opcode.push(opcode);
    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;

    return bytecode;
  }


  /**
   * @param {Array.<Array|DataView>} rom
   * @constructor
   */
  function RomStream(rom) {
    this.rom = rom;
    this.pos = null;
    this.page = 0;
  }

  RomStream.prototype = {
    /**
     * @return {?number}
     */
    get position() {
      return this.pos;
    },


    /**
     * @return {number}
     */
    get length() {
      return this.rom.length * PAGE_SIZE;
    },


    /**
     * @param {?number} pos
     */
    seek: function(pos) {
      this.pos = pos;
    },


    /**
     * Read an unsigned byte from ROM memory.
     *
     * @return {number} Value from memory location.
     */
    getUint8: function() {
      var value = 0;
      var page = this.page;
      var address = this.pos & 0x3FFF;

      if (SUPPORT_DATAVIEW) {
        value = this.rom[page].getUint8(address);
        this.pos++;
        if (address >= 0x3FFF) {
          this.page++;
        }
        return value;
      } else {
        value = this.rom[page][address] & 0xFF;
        this.pos++;
        return value;
      }
    },


    /**
     * Read a signed byte from ROM memory.
     *
     * @return {number} Value from memory location.
     */
    getInt8: function() {
      var value = 0;
      var page = this.page;
      var address = this.pos & 0x3FFF;

      if (SUPPORT_DATAVIEW) {
        value = this.rom[page].getInt8(address);
        this.pos++;
        if (address >= 0x3FFF) {
          this.page++;
        }
        return value + 1;
      } else {
        value = this.rom[page][address] & 0xFF;
        if (value >= 128) {
          value = value - 256;
        }
        this.pos++;
        return value + 1;
      }
    },


    /**
     * Read an unsigned word (two bytes) from ROM memory.
     *
     * @return {number} Value from memory location.
     */
    getUint16: function() {
      var value = 0;
      var page = this.page;
      var address = this.pos & 0x3FFF;

      if (SUPPORT_DATAVIEW) {
        if (address < 0x3FFF) {
          value = this.rom[page].getUint16(address, LITTLE_ENDIAN);
          this.pos += 2;
          return value;
        } else {
          value = (this.rom[page].getUint8(address)) |
              ((this.rom[++page].getUint8(address)) << 8);
          this.pos += 2;
          return value;
        }
      } else {
        value = (this.rom[page][address] & 0xFF) |
            ((this.rom[page][address + 1] & 0xFF) << 8);
        this.pos += 2;
        return value;
      }
    }
  };

  return parser;
})();
