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
 * A node is made of:
 *  * at least one and at most 3 opcodes
 *  * an optional operand
 *  * an optional offset (?)
 *  * an optional next address
 *  * an optional jump target
 *
 * @param {number} address
 * @constructor
 */
function Node(address) {
  var toHex = JSSMS.Utils.toHex;

  this.address = address;
  this.hexAddress = toHex(address);
  this.opcode = [];
  this.inst = '';
  this.nextAddress = null;
  this.target = null;
  this.isJumpTarget = false;
  this.jumpTargetNb = 0; // Number of instructions targeting there.
  // Memory can be registry or offset, read or write mode, 8 or 16 bit.
  /*this.memory = null;

   this.srcRegs = {};
   this.dstRegs = {};*/
}

Node.prototype = {
  get hexOpcode() {
    var toHex = JSSMS.Utils.toHex;

    if (this.opcode.length) {
      return this.opcode
        .map(toHex)
        .join(' ');
    }

    return '';
  },


  get label() {
    return this.hexAddress + ' ' +
        this.hexOpcode + ' ' +
        this.inst;
  }
};
