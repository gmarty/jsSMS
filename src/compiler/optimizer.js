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
 * Apply several passes to the ast.
 * A pass looks for patterns and optimize the code accordingly.
 * Each pass must leave the code in a valid state.
 *
 * @constructor
 */
var Optimizer = (function() {
  var Optimizer = function() {
    this.ast = [];
  };

  Optimizer.prototype = {
    /**
     * @param {Array.<Array.<Array.<Bytecode>>>} functions
     */
    optimize: function(functions) {
      this.ast = functions;

      for (var i = 0; i < this.ast.length; i++) {
        this.localOptimization(i);
      }
    },


    /**
     * Perform various optimizations limited to a function scope.
     *
     * @param {number} page
     */
    localOptimization: function(page) {
      this.ast[page] = this.ast[page].map(this.evaluateBinaryExpressions);
      this.ast[page] = this.ast[page].map(this.inlineRegisters);
    },


    /**
     * Evaluate binary expressions when both operands are literal:
     * ```
     * this.h = 0x0903 >> 0x08;
     * ```
     *
     * Is optimized into:
     * ```
     * this.h = 0x09;
     * ```
     *
     * The only operators used in the generated code are `>>` and `&`.
     *
     * @param {Array.<Bytecode>} fn
     * @return {Array.<Bytecode>}
     */
    evaluateBinaryExpressions: function(fn) {
      return fn.map(function(bytecodes) {
        var ast = bytecodes.ast;

        if (!ast) {
          return bytecodes;
        }

        bytecodes.ast = JSSMS.Utils.traverse(ast, function(ast) {
          if (ast.type == 'BinaryExpression' &&
              ast.left.type == 'Literal' &&
              ast.right.type == 'Literal') {
            var value = 0;
            switch (ast.operator) {
              case '>>':
                value = ast.left.value >> ast.right.value;
                break;
              case '&':
                value = ast.left.value & ast.right.value;
                break;
              default:
                JSSMS.Utils.console.log('Unimplemented evaluation optimization for operator',
                    ast.operator);
                return ast;
            }

            // Change the properties of the AST node.
            ast.type = 'Literal';
            ast.value = value;
            ast.raw = DEBUG ? JSSMS.Utils.toHex(value) : '' + value;
            delete ast.right;
            delete ast.left;
          }

          return ast;
        });

        return bytecodes;
      });
    },


    /**
     * This pass replaces references to defined registers with their respective values:
     * ```
     * b = 0x03;
     * writeMem(0xFFFE, b);
     * ```
     *
     * Is optimized into:
     * ```
     * b = 0x03;
     * writeMem(0xFFFE, 0x03);
     * ```
     *
     * It has many flaws and can be optimized:
     *  * Inlining all getBC(), getDE()... methods will provide better efficiency.
     *  * Limited to all registers but A and F:
     *    * A support requires inlining of methods like `add_a`, `adc_a`, `sub_a`, `sbc_a`...
     *    * F support requires inlining of methods like `ccf`, `add16`, `daa`, `rlc`...
     *  * Assignment to non literal can be improved (ex: `b = b - 1` forces b to be not inlinable).
     *
     *  Anyway, it is just a dummy example to test the integration in the workflow.
     *
     * @param {Array.<Bytecode>} fn
     * @return {Array.<Bytecode>}
     */
    inlineRegisters: function(fn) {
      var definedReg = {
        //a: false,
        //f: false,
        b: false,
        c: false,
        d: false,
        e: false,
        h: false,
        l: false
      };
      var definedRegValue = {
        //a: {},
        //f: {},
        b: {},
        c: {},
        d: {},
        e: {},
        h: {},
        l: {}
      };

      return fn.map(function(bytecodes) {
        var ast = bytecodes.ast;

        if (!ast) {
          return bytecodes;
        }

        bytecodes.ast = JSSMS.Utils.traverse(ast, function(ast) {
          // 1st, we tag defined registers.
          if (ast.type == 'AssignmentExpression' &&
              ast.operator == '=' &&
              ast.left.type == 'Register' &&
              ast.right.type == 'Literal' &&
              ast.left.name != 'a' &&
              ast.left.name != 'f') {
            definedReg[ast.left.name] = true;
            definedRegValue[ast.left.name] = ast.right;
          }

          // And we make sure to tag undefined registers.
          if (ast.type == 'AssignmentExpression' &&
              ast.left.type == 'Register' &&
              ast.right.type != 'Literal' &&
              ast.left.name != 'a' &&
              ast.left.name != 'f') {
            definedReg[ast.left.name] = false;
            definedRegValue[ast.left.name] = {};
            return ast;
          }

          // Then inline arguments.
          if (ast.type == 'CallExpression') {
            if (ast.arguments[0] &&
                ast.arguments[0].type == 'Register' &&
                definedReg[ast.arguments[0].name] &&
                ast.arguments[0].name != 'a' &&
                ast.arguments[0].name != 'f') {
              ast.arguments[0] = definedRegValue[ast.arguments[0].name];
            }
            if (ast.arguments[1] &&
                ast.arguments[1].type == 'Register' &&
                definedReg[ast.arguments[1].name] &&
                ast.arguments[1].name != 'a' &&
                ast.arguments[1].name != 'f') {
              ast.arguments[1] = definedRegValue[ast.arguments[1].name];
            }
            return ast;
          }

          // Inline object/array properties.
          if (ast.type == 'MemberExpression' &&
              ast.property.type == 'Register' &&
              definedReg[ast.property.name] &&
              ast.property.name != 'a' &&
              ast.property.name != 'f') {
            ast.property = definedRegValue[ast.property.name];
            return ast;
          }

          // Inline binary expressions.
          if (ast.type == 'BinaryExpression') {
            if (ast.right.type == 'Register' &&
                definedReg[ast.right.name] &&
                ast.right.name != 'a' &&
                ast.right.name != 'f') {
              ast.right = definedRegValue[ast.right.name];
            }
            if (ast.left.type == 'Register' &&
                definedReg[ast.left.name] &&
                ast.left.name != 'a' &&
                ast.left.name != 'f') {
              ast.left = definedRegValue[ast.left.name];
            }
            return ast;
          }

          return ast;
        });

        return bytecodes;
      });
    }
  };

  return Optimizer;
})();
