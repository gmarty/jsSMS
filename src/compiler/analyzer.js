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
 * The analyzer rearranges instructions to use JavaScript control flow constructs.
 *
 * @param {Array.<Bytecode>} bytecodes
 * @constructor
 */
var Analyzer = function(bytecodes) {
  this.bytecodes = bytecodes;
  this.ast = [];

  if (DEBUG) console.time('Analyzing');
  this.normalizeBytecode();
  this.restructure();
  if (DEBUG) console.timeEnd('Analyzing');
};

Analyzer.prototype = {
  /**
   * Remove unused addresses and populate bytecodes with AST.
   * @todo Can we merge operand & target? Ex: `bytecode.operand || bytecode.target`
   */
  normalizeBytecode: function() {
    this.bytecodes = this.bytecodes
      .filter(function(bytecode) {
          // Turn parsed bytecodes array into a dense array.
          return bytecode;
        })
        //Populate AST for each bytecode.
      .map(function(bytecode) {
          switch (bytecode.opcode.length) {
            case 1:
              var opcode = opcodeTable[bytecode.opcode[0]];
              break;
            case 2:
              var opcode = opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]];
              break;
            case 3:
              var opcode = opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]][bytecode.opcode[2]];
              break;
            default:
              throw Error('Something went wrong in parsing. Opcode: [' + bytecode.opcode.join(',') + ']');
          }

          if (opcode && opcode.ast) {
            var ast = opcode.ast(bytecode.operand, bytecode.target, bytecode.address);

            // Force ast property to always be an array.
            if (!Array.isArray(ast) && ast != undefined)
              ast = [ast];

            bytecode.ast = ast;

            if (DEBUG) {
              bytecode.name = opcode.name;
              if (opcode.opcode)
                bytecode.opcode = opcode.opcode(bytecode.operand, bytecode.target, bytecode.address);
            }
          }

          return bytecode;
        });
  },


  /**
   * Do control flow graph restructuring. At the moment, the code is just split into functions
   * along jump targets.
   * Each array in `ast` will be converted in a function.
   */
  restructure: function() {
    var self = this;
    var pointer = -1;
    var startNewFunction = false;

    this.bytecodes
      .forEach(function(bytecode) {
          if (bytecode.isJumpTarget || startNewFunction) {
            pointer++;
            self.ast[pointer] = [];
            startNewFunction = false;
          }

          self.ast[pointer].push(bytecode);

          if (bytecode.isFunctionEnder) {
            startNewFunction = true;
          }
        });
  }
};
