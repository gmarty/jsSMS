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
 * The generator cleans the data and returns a valid AST.
 *
 * @constructor
 */
var Generator = (function() {
  var toHex = JSSMS.Utils.toHex;

  /**
   * These properties shouldn't be prepended with `this`.
   * @const
   */
  var whitelist = [
    'page', 'temp', 'location', 'val', 'value', 'JSSMS.Utils.rndInt'
  ];

  /**
   * @param {Array.<number>} opcodes
   * @return {number}
   */
  function getTotalTStates(opcodes) {
    var tstates = 0;

    switch (opcodes[0]) {
      case 0xCB:
        tstates = OP_CB_STATES[opcodes[1]];
        break;
      case 0xDD:
      case 0xFD:
        if (opcodes.length == 2)
          tstates = OP_DD_STATES[opcodes[1]];
        else
          tstates = OP_INDEX_CB_STATES[opcodes[2]];
        break;
      case 0xED:
        tstates = OP_ED_STATES[opcodes[1]];
        break;
      default:
        tstates = OP_STATES[opcodes[0]];
        break;
    }

    return tstates;
  }

  /**
   * Replace `Register` type with `Identifier`.
   */
  function convertRegisters(ast) {
    var convertRegisters = function(node) {
      if (node.type == 'Register') {
        node.type = 'Identifier';
      }

      return node;
    };

    return JSSMS.Utils.traverse(ast, convertRegisters);
  }

  var Generator = function() {
    this.ast = [];
  };

  Generator.prototype = {
    /**
     * Process bytecodes.
     */
    generate: function(functions) {
      var self = this;

      JSSMS.Utils.console.time('Generating');
      for (var page = 0; page < functions.length; page++) {
        functions[page] = functions[page]
          .map(function(fn) {
              var body = [];
              var name = fn[0].address;
              var jumpTargetNb = fn[0].jumpTargetNb;
              var tstates = 0;

              fn = fn
              .map(function(bytecode) {
                    if (bytecode.ast == null)
                      bytecode.ast = [];

                    if (ENABLE_SERVER_LOGGER) {
                      // Sync server.
                      var syncServerStmt = {
                        'type': 'ExpressionStatement',
                        'expression': {
                          'type': 'CallExpression',
                          'callee': n.Identifier('sync'),
                          'arguments': []
                        }
                      };
                    }

                    // Decrement tstates.
                    tstates += getTotalTStates(bytecode.opcode);

                    //if (bytecode.isFunctionEnder || bytecode.canEnd || bytecode.target != null) {
                    var decreaseTStateStmt = [
                      {
                        'type': 'ExpressionStatement',
                        'expression': {
                          'type': 'AssignmentExpression',
                          'operator': '-=',
                          'left': {
                            'type': 'Identifier',
                            'name': 'tstates'
                          },
                          'right': {
                            'type': 'Literal',
                            'value': tstates
                          }
                        }
                      }
                    ];

                    tstates = 0;

                    if (DEBUG) {
                      decreaseTStateStmt[0]['expression']['right']['raw'] = toHex(decreaseTStateStmt[0]['expression']['right']['value']);
                    }

                    if (ENABLE_SERVER_LOGGER) {
                      decreaseTStateStmt = [].concat(syncServerStmt, decreaseTStateStmt);
                    }

                    bytecode.ast = [].concat(decreaseTStateStmt, bytecode.ast);
                    //}

                    // Update `this.pc` statement.
                    if (/*bytecode.isFunctionEnder &&*/ bytecode.nextAddress != null) {
                      var updatePcStmt = {
                        'type': 'ExpressionStatement',
                        'expression': {
                          'type': 'AssignmentExpression',
                          'operator': '=',
                          'left': {
                            'type': 'Identifier',
                            'name': 'pc'
                          },
                          'right': {
                            'type': 'BinaryExpression',
                            'operator': '+',
                            'left': {
                              'type': 'Literal',
                              'value': bytecode.nextAddress % 0x4000
                            },
                            'right': {
                              'type': 'BinaryExpression',
                              'operator': '*',
                              'left': {
                                'type': 'Identifier',
                                'name': 'page'
                              },
                              'right': {
                                'type': 'Literal',
                                'value': 0x4000
                              }
                            }
                          }
                        }
                      };

                      if (DEBUG) {
                        updatePcStmt['expression']['right']['left']['raw'] = toHex(updatePcStmt['expression']['right']['left']['value']);
                        updatePcStmt['expression']['right']['right']['right']['raw'] = '0x4000';
                      }

                      bytecode.ast.push(updatePcStmt);
                    }

                    // Test tstates.
                    /*var tStateCheck = {
                      'type': 'IfStatement',
                      'test': {
                        'type': 'LogicalExpression',
                        'operator': '&&',
                        'left': {
                          'type': 'BinaryExpression',
                          'operator': '<=',
                          'left': {
                            'type': 'Identifier',
                            'name': 'tstates'
                          },
                          'right': {
                            'type': 'Literal',
                            'value': 0,
                            'raw': '0'
                          }
                        },
                        'right': {
                          'type': 'CallExpression',
                          'callee': {
                            'type': 'Identifier',
                            'name': 'eol'
                          },
                          'arguments': []
                        }
                      },
                      'consequent': {
                        'type': 'BlockStatement',
                        'body': [
                          {
                            'type': 'ExpressionStatement',
                            'expression': {
                              'type': 'AssignmentExpression',
                              'operator': '=',
                              'left': {
                                'type': 'Identifier',
                                'name': 'pc'
                              },
                              'right': {
                                'type': 'Literal',
                                'value': bytecode.address + (bytecode.page * 0x4000)
                              }
                            }
                          },
                          {
                            'type': 'ReturnStatement',
                            'argument': null
                          }
                        ]
                      },
                      'alternate': null
                    };

                    if (DEBUG) {
                      //tStateCheck[0]['consequent']['body'][0]['expression']['right']['raw'] = toHex(tStateCheck[0]['consequent']['body'][0]['expression']['right']['value']);
                    }

                    bytecode.ast.push(tStateCheck);*/

                    if (DEBUG) {
                      // Inline comment about the current bytecode.
                      if (bytecode.ast[0])
                        bytecode.ast[0].leadingComments = [
                          {
                            type: 'Line',
                            value: ' ' + bytecode.label
                          }
                        ];
                    }

                    return bytecode.ast;
                  });

              /*if (DEBUG && fn[0][0])
                // Inject data about current branch into a comment.
                fn[0][0].leadingComments = [].concat({
                  type: 'Line',
                  value: ' Nb of instructions jumping here: ' + jumpTargetNb
                }, fn[0][0].leadingComments);*/

              // Flatten the array.
              fn.forEach(function(ast) {
                body = body.concat(ast);
              });

              // Apply modifications to the AST recursively.
              body = convertRegisters(body);

              // Append `this` to all identifiers.
              body = JSSMS.Utils.traverse(body, function(obj) {
                if (obj.type && obj.type == 'Identifier' && whitelist.indexOf(obj.name) == -1)
                  obj.name = 'this.' + obj.name;
                return obj;
              });

              if (DEBUG) {
                return {
                  'type': 'Program',
                  'body': [
                    {
                      'type': 'FunctionDeclaration',
                      'id': {
                        'type': 'Identifier',
                        'name': name // Name of the function
                      },
                      'params': [
                        {
                          'type': 'Identifier',
                          'name': 'page'
                        },
                        {
                          'type': 'Identifier',
                          'name': 'temp'
                        },
                        {
                          'type': 'Identifier',
                          'name': 'location'
                        }
                      ],
                      'defaults': [],
                      'body': {
                        'type': 'BlockStatement',
                        'body': body
                      },
                      'rest': null,
                      'generator': false,
                      'expression': false
                    }
                  ]
                };
              } else {
                return {
                  'type': 'Program',
                  'body': body,
                  'comments': [
                    {
                      'type': 'Line',
                      'value': name // Name of the function
                    }
                  ]
                };
              }
            });
      }
      JSSMS.Utils.console.timeEnd('Generating');

      this.ast = functions;
    }
  };

  return Generator;
})();
