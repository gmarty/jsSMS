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
 * @param {number} page
 * @constructor
 */
var Bytecode = (function() {
  var toHex = JSSMS.Utils.toHex;

  /**
   * A bytecode is made of:
   *  * at least one and at most 3 opcodes
   *  * an operand (defaults to null, can be 8 or 16 bits)
   *  * a next address (defaults to null)
   *  * a jump target (defaults to null)
   */
  function Bytecode(address, page) {
    this.address = address;
    //this.hexAddress = toHex(address);
    this.page = page;
    this.opcode = [];
    this.operand = null;
    this.nextAddress = null;
    this.target = null;
    this.isFunctionEnder = false;
    this.canEnd = false;
    this.changePage = false;
    this.isJumpTarget = false;
    this.jumpTargetNb = 0; // Number of bytecodes targeting there.
    this.ast = null;
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
      return toHex(this.address + (this.page * PAGE_SIZE)) + ' ' +
          this.hexOpcode + ' ' +
          name;
    }
  };

  return Bytecode;
})();
