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
 * The compiler cleans the data and returns a valid AST.
 *
 * @param {Array.<Array.<Bytecode>>} functions
 * @constructor
 */
var Compiler = function(functions) {
  this.functions = functions;
  this.ast = [];

  if (DEBUG) console.time('Generating');
  this.generate();
  if (DEBUG) console.timeEnd('Generating');
};

Compiler.prototype = {
  /**
   * Process bytecodes and return an AST.
   *
   * @return {{type: string, body: Array}}
   */
  generate: function() {
    var self = this;

    this.functions = this.functions
      .map(function(fn, index) {
          var toHex = JSSMS.Utils.toHex;
          var arr = [];
          var name = toHex(fn[0].address);

          fn = fn
          .filter(function(bytecode) {
                // @todo Remove this filter when all the opcodes are implemented.
                return bytecode.ast;
              })
          .map(function(bytecode) {
                return bytecode.ast;
              });

          // @todo Remove this test when all the opcodes are implemented.
          if (fn.length) {

            // Flatten the array (`ast` properties can be an object or an array of objects).
            fn.forEach(function(ast) {
              if (Array.isArray(ast))
                arr = arr.concat(ast);
              else
                arr.push(ast);
            });

            // Apply modifications to the AST recursively.
            fn = self.convertRegisters(fn);
          }

          return {
            'type': 'Property',
            'key': {
              'type': 'Literal',
              'value': 'f_' + name // Name of the function
            },
            'value': {
              'type': 'FunctionExpression',
              'id': null,
              'params': [
                {
                  'type': 'Identifier',
                  'name': 'temp'
                }
              ],
              'defaults': [],
              'body': {
                'type': 'BlockStatement',
                'body': arr
              },
              'rest': null,
              'generator': false,
              'expression': false
            },
            'kind': 'init'
          };
        });

    this.ast = {
      'type': 'Program',
      'body': [
        {
          'type': 'VariableDeclaration',
          'declarations': [
            {
              'type': 'VariableDeclarator',
              'id': {
                'type': 'Identifier',
                'name': 'functions'
              },
              'init': {
                'type': 'ObjectExpression',
                'properties': this.functions
              }
            }
          ],
          'kind': 'var'
        }
      ]
    };
  },


  /**
   * Replace `Register` type with `Identifier`.
   */
  convertRegisters: function(ast) {
    var convertRegisters = function(node) {
      if (node.type == 'Register') {
        node.type = 'Identifier';
      }

      return node;
    };

    return JSSMS.Utils.traverse(ast, convertRegisters);
  }
};
