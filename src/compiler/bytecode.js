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
 * @param {number} address
 * @constructor
 */
var Bytecode = (function() {
  /**
   * in DEBUG mode, get a hex from a decimal. Pad with 0 if necessary.
   *
   * @param {number} dec A decimal integer.
   * @return {string} A hex representation of the input.
   */
  var toHex = function() {
    if (DEBUG)
      return JSSMS.Utils.toHex;
    return function(dec) {
      return dec;
    }
  }();

  /**
   * A bytecode is made of:
   *  * at least one and at most 3 opcodes
   *  * an operand (defaults to null)
   *  * a next address (defaults to null)
   *  * a jump target (defaults to null)
   */
  function Bytecode(address) {
    this.address = address;
    this.hexAddress = toHex(address);
    this.opcode = [];
    this.operand = null;
    this.nextAddress = null;
    this.target = null;
    this.isFunctionEnder = false;
    this.canEnd = false;
    this.isJumpTarget = false;
    this.jumpTargetNb = 0; // Number of instructions targeting there.
    this.ast = null;
    // Memory can be registry or offset, read or write mode, 8 or 16 bit.
    /*this.memory = null;

     this.srcRegs = {};
     this.dstRegs = {};*/
  }

  Bytecode.prototype = {
    get hexOpcode() {
      if (this.opcode.length) {
        return this.opcode
          .map(toHex)
          .join(' ');
      }

      return '';
    },


    get label() {
      // @todo Generate a function for each opcode instead of this.
      var name = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, toHex(this.target || this.operand || 0)) : '';
      return this.hexAddress + ' ' +
          this.hexOpcode + ' ' +
          name;
    }
  };

  return Bytecode;
})();
