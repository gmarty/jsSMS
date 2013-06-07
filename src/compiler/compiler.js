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
   * Process bytecodes.
   */
  generate: function() {
    var self = this;

    this.functions = this.functions
      .map(function(fn) {
          var arr = [];
          var name = fn[0].address;
          var jumpTargetNb = fn[0].jumpTargetNb;
          var lastPc = fn[fn.length - 1].nextAddress;

          fn = fn
          .filter(function(bytecode) {
                // @todo Decrement tstates if the instruction can jump out of the current function.
                return bytecode.ast;
              })
          .map(function(bytecode) {
                var ast = bytecode.ast;

                if (DEBUG) {
                  // Inline comment about the current bytecode.
                  attachComment(ast);
                }

                return ast;

                function attachComment(ast) {
                  if (Array.isArray(ast))
                    doAttachComment(ast[0]);
                  else
                    doAttachComment(ast);

                  function doAttachComment(ast) {
                    ast.leadingComments = [
                      {
                        type: 'Line',
                        value: ' ' + bytecode.label
                      }
                    ];
                  }
                }
              });

          // @todo Remove this test when all the opcodes are implemented.
          if (fn.length) {

            if (DEBUG && fn[0] && fn[0].leadingComments)
              // Inject data about current branch into a comment.
              fn[0].leadingComments = [
                {
                  type: 'Line',
                  value: ' Nb of instructions jumping here: ' + jumpTargetNb
                },
                fn[0].leadingComments[0]
              ];

            // Flatten the array (`ast` properties can be an object or an array of objects).
            fn.forEach(function(ast) {
              if (Array.isArray(ast))
                arr = arr.concat(ast);
              else
                arr.push(ast);
            });

            // Apply modifications to the AST recursively.
            arr = self.convertRegisters(arr);
          }

          if (lastPc != null) {
            // Updating this.pc at the end of the function.
            arr.push({
              "type": "ExpressionStatement",
              "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                  "type": "Identifier",
                  "name": "this.pc"
                },
                "right": {
                  "type": "Literal",
                  "value": lastPc
                }
              }
            });
          }

          return {
            'type': 'Program',
            'body': [
              {
                'type': 'FunctionDeclaration',
                'id': {
                  'type': 'Identifier',
                  'name': '_' + name // Name of the function
                },
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
              }
            ]
          };
        });

    this.ast = this.functions;
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
