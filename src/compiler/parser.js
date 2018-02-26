/* global Bytecode */

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
  var Parser = function(rom, frameReg) {
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

  Parser.prototype = {
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

      for (
        currentPage = 0;
        currentPage < this.addresses.length;
        currentPage++
      ) {
        while (this.addresses[currentPage].length) {
          var currentObj = this.addresses[currentPage].shift();
          var currentAddress = currentObj.address % 0x4000;

          if (currentAddress < pageStart || currentAddress > pageEnd) {
            JSSMS.Utils.console.error(
              'Address out of bound',
              toHex(currentAddress)
            );
            continue;
          }

          // Make sure bytecodes are only parsed once.
          if (this.bytecodes[currentPage][currentAddress]) {
            continue;
          }

          var bytecode = new Bytecode(currentAddress, currentPage);
          this.bytecodes[currentPage][currentAddress] = disassemble(
            bytecode,
            this.stream
          );

          if (
            this.bytecodes[currentPage][currentAddress].nextAddress !== null &&
            this.bytecodes[currentPage][currentAddress].nextAddress >=
              pageStart &&
            this.bytecodes[currentPage][currentAddress].nextAddress <= pageEnd
          ) {
            this.addAddress(
              this.bytecodes[currentPage][currentAddress].nextAddress
            );
          }
          if (
            this.bytecodes[currentPage][currentAddress].target !== null &&
            this.bytecodes[currentPage][currentAddress].target >= pageStart &&
            this.bytecodes[currentPage][currentAddress].target <= pageEnd
          ) {
            this.addAddress(this.bytecodes[currentPage][currentAddress].target);
          }
        }
      }

      // We consider the first 0x0400 bytes as an independent memory page.
      if (this.bytecodes[0][0x03ff]) {
        this.bytecodes[0][0x03ff].isFunctionEnder = true;
      } else if (this.bytecodes[0][0x03fe]) {
        this.bytecodes[0][0x03fe].isFunctionEnder = true;
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
      for (
        currentPage = 0;
        currentPage < this.bytecodes.length;
        currentPage++
      ) {
        for (
          i = 0, length = this.bytecodes[currentPage].length;
          i < length;
          i++
        ) {
          if (!this.bytecodes[currentPage][i]) {
            continue;
          }
          // Comparing with null is important here as `0` is a valid address (0x00).
          if (
            this.bytecodes[currentPage][i].nextAddress !== null &&
            this.bytecodes[currentPage][
              this.bytecodes[currentPage][i].nextAddress
            ]
          ) {
            this.bytecodes[currentPage][
              this.bytecodes[currentPage][i].nextAddress
            ].jumpTargetNb++;
          }
          if (this.bytecodes[currentPage][i].target !== null) {
            var targetPage = ~~(this.bytecodes[currentPage][i].target / 0x4000);
            var targetAddress = this.bytecodes[currentPage][i].target % 0x4000;
            if (
              this.bytecodes[targetPage] &&
              this.bytecodes[targetPage][targetAddress]
            ) {
              this.bytecodes[targetPage][targetAddress].isJumpTarget = true;
              this.bytecodes[targetPage][targetAddress].jumpTargetNb++;
            } else {
              JSSMS.Utils.console.log(
                'Invalid target address',
                toHex(this.bytecodes[currentPage][i].target)
              );
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
        absoluteAddress = address + romPage * 0x4000;
      } while (
        address !== null &&
        absoluteAddress >= pageStart &&
        absoluteAddress < pageEnd &&
        !bytecode.isFunctionEnder
      );

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
      content = content.replace(
        / 0 \[label="/,
        ' 0 [style=filled,color="#CC0000",label="'
      );

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
        memPage: memPage,
      });
    },
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
    stream.seek(bytecode.address + stream.page * 0x4000);
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
      case 0x0a:
        break;
      case 0x0b:
        break;
      case 0x0c:
        break;
      case 0x0d:
        break;
      case 0x0e:
        operand = stream.getUint8();
        break;
      case 0x0f:
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
      case 0x1a:
        break;
      case 0x1b:
        break;
      case 0x1c:
        break;
      case 0x1d:
        break;
      case 0x1e:
        operand = stream.getUint8();
        break;
      case 0x1f:
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
      case 0x2a:
        operand = stream.getUint16();
        break;
      case 0x2b:
        break;
      case 0x2c:
        break;
      case 0x2d:
        break;
      case 0x2e:
        operand = stream.getUint8();
        break;
      case 0x2f:
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
      case 0x3a:
        operand = stream.getUint16();
        break;
      case 0x3b:
        break;
      case 0x3c:
        break;
      case 0x3d:
        break;
      case 0x3e:
        operand = stream.getUint8();
        break;
      case 0x3f:
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
      case 0x4a:
        break;
      case 0x4b:
        break;
      case 0x4c:
        break;
      case 0x4d:
        break;
      case 0x4e:
        break;
      case 0x4f:
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
      case 0x5a:
        break;
      case 0x5b:
        break;
      case 0x5c:
        break;
      case 0x5d:
        break;
      case 0x5e:
        break;
      case 0x5f:
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
      case 0x6a:
        break;
      case 0x6b:
        break;
      case 0x6c:
        break;
      case 0x6d:
        break;
      case 0x6e:
        break;
      case 0x6f:
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
      case 0x7a:
        break;
      case 0x7b:
        break;
      case 0x7c:
        break;
      case 0x7d:
        break;
      case 0x7e:
        break;
      case 0x7f:
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
      case 0x8a:
        break;
      case 0x8b:
        break;
      case 0x8c:
        break;
      case 0x8d:
        break;
      case 0x8e:
        break;
      case 0x8f:
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
      case 0x9a:
        break;
      case 0x9b:
        break;
      case 0x9c:
        break;
      case 0x9d:
        break;
      case 0x9e:
        break;
      case 0x9f:
        break;
      case 0xa0:
        break;
      case 0xa1:
        break;
      case 0xa2:
        break;
      case 0xa3:
        break;
      case 0xa4:
        break;
      case 0xa5:
        break;
      case 0xa6:
        break;
      case 0xa7:
        break;
      case 0xa8:
        break;
      case 0xa9:
        break;
      case 0xaa:
        break;
      case 0xab:
        break;
      case 0xac:
        break;
      case 0xad:
        break;
      case 0xae:
        break;
      case 0xaf:
        break;
      case 0xb0:
        break;
      case 0xb1:
        break;
      case 0xb2:
        break;
      case 0xb3:
        break;
      case 0xb4:
        break;
      case 0xb5:
        break;
      case 0xb6:
        break;
      case 0xb7:
        break;
      case 0xb8:
        break;
      case 0xb9:
        break;
      case 0xba:
        break;
      case 0xbb:
        break;
      case 0xbc:
        break;
      case 0xbd:
        break;
      case 0xbe:
        break;
      case 0xbf:
        break;
      case 0xc0:
        canEnd = true;
        break;
      case 0xc1:
        break;
      case 0xc2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xc3:
        target = stream.getUint16();
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xc4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xc5:
        break;
      case 0xc6:
        operand = stream.getUint8();
        break;
      case 0xc7:
        target = 0x00;
        isFunctionEnder = true;
        break;
      case 0xc8:
        canEnd = true;
        break;
      case 0xc9:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xca:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xcb:
        return getCB(bytecode, stream);
      case 0xcc:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xcd:
        target = stream.getUint16();
        isFunctionEnder = true;
        break;
      case 0xce:
        operand = stream.getUint8();
        break;
      case 0xcf:
        target = 0x08;
        isFunctionEnder = true;
        break;
      case 0xd0:
        canEnd = true;
        break;
      case 0xd1:
        break;
      case 0xd2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xd3:
        operand = stream.getUint8();
        break;
      case 0xd4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xd5:
        break;
      case 0xd6:
        operand = stream.getUint8();
        break;
      case 0xd7:
        target = 0x10;
        isFunctionEnder = true;
        break;
      case 0xd8:
        canEnd = true;
        break;
      case 0xd9:
        break;
      case 0xda:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xdb:
        operand = stream.getUint8();
        break;
      case 0xdc:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xdd:
        return getIndex(bytecode, stream);
      case 0xde:
        operand = stream.getUint8();
        break;
      case 0xdf:
        target = 0x18;
        isFunctionEnder = true;
        break;
      case 0xe0:
        canEnd = true;
        break;
      case 0xe1:
        break;
      case 0xe2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xe3:
        break;
      case 0xe4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xe5:
        break;
      case 0xe6:
        operand = stream.getUint8();
        break;
      case 0xe7:
        target = 0x20;
        isFunctionEnder = true;
        break;
      case 0xe8:
        canEnd = true;
        break;
      case 0xe9:
        // This target can't be determined using static analysis.
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xea:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xeb:
        break;
      case 0xec:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xed:
        return getED(bytecode, stream);
      case 0xee:
        operand = stream.getUint8();
        break;
      case 0xef:
        target = 0x28;
        isFunctionEnder = true;
        break;
      case 0xf0:
        canEnd = true;
        break;
      case 0xf1:
        break;
      case 0xf2:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xf3:
        break;
      case 0xf4:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xf5:
        break;
      case 0xf6:
        operand = stream.getUint8();
        break;
      case 0xf7:
        target = 0x30;
        isFunctionEnder = true;
        break;
      case 0xf8:
        canEnd = true;
        break;
      case 0xf9:
        break;
      case 0xfa:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xfb:
        break;
      case 0xfc:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 0xfd:
        return getIndex(bytecode, stream);
      case 0xfe:
        operand = stream.getUint8();
        break;
      case 0xff:
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
      case 0x4c:
      case 0x54:
      case 0x5c:
      case 0x64:
      case 0x6c:
      case 0x74:
      case 0x7c:
        break;
      case 0x45:
      case 0x4d:
      case 0x55:
      case 0x5d:
      case 0x65:
      case 0x6d:
      case 0x75:
      case 0x7d:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0x46:
      case 0x4e:
      case 0x66:
      case 0x6e:
        break;
      case 0x47:
        break;
      case 0x48:
        break;
      case 0x49:
        break;
      case 0x4a:
        break;
      case 0x4b:
        operand = stream.getUint16();
        break;
      case 0x4f:
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
      case 0x5a:
        break;
      case 0x5b:
        operand = stream.getUint16();
        break;
      case 0x5f:
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
      case 0x6a:
        break;
      case 0x6b:
        operand = stream.getUint16();
        break;
      case 0x6f:
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
      case 0x7a:
        break;
      case 0x7b:
        operand = stream.getUint16();
        break;
      case 0xa0:
        break;
      case 0xa1:
        break;
      case 0xa2:
        break;
      case 0xa3:
        break;
      case 0xa8:
        break;
      case 0xa9:
        break;
      case 0xaa:
        break;
      case 0xab:
        break;
      case 0xb0:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xb1:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xb2:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xb3:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xb8:
        break;
      case 0xb9:
        break;
      case 0xba:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 0xbb:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      default:
        JSSMS.Utils.console.error('Unexpected opcode', '0xED ' + toHex(opcode));
    }

    if (bytecode.address >= 0x3fff) {
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
      case 0x2a:
        operand = stream.getUint16();
        break;
      case 0x2b:
        break;
      case 0x2c:
        break;
      case 0x2d:
        break;
      case 0x2e:
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
      case 0x4c:
        break;
      case 0x4d:
        break;
      case 0x4e:
        operand = stream.getUint8();
        break;
      case 0x54:
        break;
      case 0x55:
        break;
      case 0x56:
        operand = stream.getUint8();
        break;
      case 0x5c:
        break;
      case 0x5d:
        break;
      case 0x5e:
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
      case 0x6a:
        break;
      case 0x6b:
        break;
      case 0x6c:
        break;
      case 0x6d:
        break;
      case 0x6e:
        operand = stream.getUint8();
        break;
      case 0x6f:
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
      case 0x7c:
        break;
      case 0x7d:
        break;
      case 0x7e:
        operand = stream.getUint8();
        break;
      case 0x84:
        break;
      case 0x85:
        break;
      case 0x86:
        operand = stream.getUint8();
        break;
      case 0x8c:
        break;
      case 0x8d:
        break;
      case 0x8e:
        operand = stream.getUint8();
        break;
      case 0x94:
        break;
      case 0x95:
        break;
      case 0x96:
        operand = stream.getUint8();
        break;
      case 0x9c:
        break;
      case 0x9d:
        break;
      case 0x9e:
        operand = stream.getUint8();
        break;
      case 0xa4:
        break;
      case 0xa5:
        break;
      case 0xa6:
        operand = stream.getUint8();
        break;
      case 0xac:
        break;
      case 0xad:
        break;
      case 0xae:
        operand = stream.getUint8();
        break;
      case 0xb4:
        break;
      case 0xb5:
        break;
      case 0xb6:
        operand = stream.getUint8();
        break;
      case 0xbc:
        break;
      case 0xbd:
        break;
      case 0xbe:
        operand = stream.getUint8();
        break;
      case 0xcb:
        return getIndexCB(bytecode, stream);
      case 0xe1:
        break;
      case 0xe3:
        break;
      case 0xe5:
        break;
      case 0xe9:
        // This target can't be determined using static analysis.
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 0xf9:
        break;
      default:
        JSSMS.Utils.console.error(
          'Unexpected opcode',
          '0xDD/0xFD ' + toHex(opcode)
        );
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
      var address = this.pos & 0x3fff;

      if (SUPPORT_DATAVIEW) {
        value = this.rom[page].getUint8(address);
        this.pos++;
        if (address >= 0x3fff) {
          this.page++;
        }
        return value;
      } else {
        value = this.rom[page][address] & 0xff;
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
      var address = this.pos & 0x3fff;

      if (SUPPORT_DATAVIEW) {
        value = this.rom[page].getInt8(address);
        this.pos++;
        if (address >= 0x3fff) {
          this.page++;
        }
        return value + 1;
      } else {
        value = this.rom[page][address] & 0xff;
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
      var address = this.pos & 0x3fff;

      if (SUPPORT_DATAVIEW) {
        if (address < 0x3fff) {
          value = this.rom[page].getUint16(address, LITTLE_ENDIAN);
          this.pos += 2;
          return value;
        } else {
          value =
            this.rom[page].getUint8(address) |
            (this.rom[++page].getUint8(address) << 8);
          this.pos += 2;
          return value;
        }
      } else {
        value =
          (this.rom[page][address] & 0xff) |
          ((this.rom[page][address + 1] & 0xff) << 8);
        this.pos += 2;
        return value;
      }
    },
  };

  return Parser;
})();
