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
 * @constructor
 */
var Analyzer = function() {
  this.bytecodes = {};
  this.ast = [];

  this.missingOpcodes = {};
};

Analyzer.prototype = {
  analyze: function(bytecodes) {
    this.bytecodes = bytecodes;
    this.ast = Array(this.bytecodes.length);

    JSSMS.Utils.console.time('Analyzing');
    for (var i = 0; i < this.bytecodes.length; i++) {
      this.normalizeBytecode(i);
      this.restructure(i);
    }
    JSSMS.Utils.console.timeEnd('Analyzing');

    for (var i in this.missingOpcodes) {
      console.error('Missing opcode', i, this.missingOpcodes[i]);
    }
  },


  analyzeFromAddress: function(bytecodes) {
    this.bytecodes = [bytecodes];
    this.ast = [];

    this.missingOpcodes = {};

    this.normalizeBytecode(0);

    this.bytecodes[0][this.bytecodes[0].length - 1].isFunctionEnder = true;
    this.ast = [this.bytecodes];

    for (var i in this.missingOpcodes) {
      console.error('Missing opcode', i, this.missingOpcodes[i]);
    }
  },


  /**
   * Remove unused addresses and populate bytecodes with AST.
   * @todo Can we merge operand & target? Ex: `bytecode.operand || bytecode.target`
   */
  normalizeBytecode: function(page) {
    var self = this;

    this.bytecodes[page] = this.bytecodes[page]
        // Populate AST for each bytecode.
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
            var ast = opcode.ast(bytecode.operand, bytecode.target, bytecode.nextAddress);

            // Force ast property to always be an array.
            if (!Array.isArray(ast) && ast != undefined)
              ast = [ast];

            bytecode.ast = ast;

            if (DEBUG) {
              bytecode.name = opcode.name;
              if (opcode.opcode)
                bytecode.opcode = opcode.opcode(bytecode.operand, bytecode.target, bytecode.nextAddress);
            }
          } else {
            var i = bytecode.hexOpcode;
            self.missingOpcodes[i] = self.missingOpcodes[i] != undefined ?
                self.missingOpcodes[i] + 1 : 1;
          }

          return bytecode;
        });
  },


  /**
   * Do control flow graph restructuring. At the moment, the code is just split into functions
   * along jump targets.
   * Each array in `ast` will be converted in a function.
   */
  restructure: function(page) {
    this.ast[page] = [];
    var self = this;
    var pointer = -1;
    var startNewFunction = true;
    var prevBytecode = {};

    this.bytecodes[page]
      .forEach(function(bytecode) {
          if (bytecode.isJumpTarget || startNewFunction) {
            pointer++;
            self.ast[page][pointer] = [];
            startNewFunction = false;
            prevBytecode.isFunctionEnder = true; // Update previous bytecode object.
          }

          self.ast[page][pointer].push(bytecode);

          if (bytecode.isFunctionEnder) {
            startNewFunction = true;
          }

          prevBytecode = bytecode;
        });
  }
};
