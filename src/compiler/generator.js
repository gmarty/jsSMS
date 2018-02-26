/* global n */

'use strict';

/**
 * The generator cleans the data and returns a valid AST.
 *
 * @constructor
 */
var CodeGenerator = (function() {
  var toHex = JSSMS.Utils.toHex;

  /**
   * @param {Array.<number>} opcodes
   * @return {number}
   */
  function getTotalTStates(opcodes) {
    switch (opcodes[0]) {
      case 0xcb:
        return OP_CB_STATES[opcodes[1]];
      case 0xdd:
      case 0xfd:
        if (opcodes.length === 2) {
          return OP_DD_STATES[opcodes[1]];
        }
        return OP_INDEX_CB_STATES[opcodes[2]];
      case 0xed:
        return OP_ED_STATES[opcodes[1]];
      default:
        return OP_STATES[opcodes[0]];
    }
  }

  var CodeGenerator = function() {
    this.ast = [];
  };

  CodeGenerator.prototype = {
    /**
     * Process bytecodes.
     */
    generate: function(functions) {
      for (var page = 0; page < functions.length; page++) {
        functions[page] = functions[page].map(function(fn) {
          var name = fn[0].address;
          var body = [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: 'use strict',
                raw: '"use strict"',
              },
              _address: name,
            },
          ];
          var tstates = 0;

          fn = fn.map(function(bytecode) {
            if (bytecode.ast === undefined) {
              bytecode.ast = [];
            }

            if (REFRESH_EMULATION) {
              // Sync server.
              var refreshEmulationStmt = {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: n.Identifier('incR'),
                  arguments: [],
                },
              };
            }

            if (ENABLE_SERVER_LOGGER) {
              // Sync server.
              var syncServerStmt = {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: n.Identifier('sync'),
                  arguments: [],
                },
              };
            }

            // Decrement tstates.
            tstates += getTotalTStates(bytecode.opcode);

            //if (bytecode.isFunctionEnder || bytecode.canEnd || bytecode.target != null) {
            var decreaseTStateStmt = [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '-=',
                  left: {
                    type: 'Identifier',
                    name: 'tstates',
                  },
                  right: {
                    type: 'Literal',
                    value: tstates,
                    raw: DEBUG ? toHex(tstates) : '' + tstates,
                  },
                },
              },
            ];

            tstates = 0;

            if (REFRESH_EMULATION) {
              decreaseTStateStmt = [].concat(
                refreshEmulationStmt,
                decreaseTStateStmt
              );
            }

            if (ENABLE_SERVER_LOGGER) {
              decreaseTStateStmt = [].concat(
                syncServerStmt,
                decreaseTStateStmt
              );
            }

            // Increment `page` statement.
            if (bytecode.changePage) {
              // page++;
              var updatePageStmt = {
                type: 'ExpressionStatement',
                expression: {
                  type: 'UpdateExpression',
                  operator: '++',
                  argument: {
                    type: 'Identifier',
                    name: 'page',
                  },
                  prefix: false,
                },
              };

              bytecode.ast = [].concat(updatePageStmt, bytecode.ast);
            }

            bytecode.ast = [].concat(decreaseTStateStmt, bytecode.ast);
            //}

            // Update `this.pc` statement.
            if (
              (ENABLE_SERVER_LOGGER || bytecode.isFunctionEnder) &&
              bytecode.nextAddress !== null
            ) {
              // this.pc = |nextAddress| + page * 0x4000;
              var nextAddress = bytecode.nextAddress % 0x4000;
              var updatePcStmt = {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    name: 'pc',
                  },
                  right: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                      type: 'Literal',
                      value: nextAddress,
                      raw: DEBUG ? toHex(nextAddress) : '' + nextAddress,
                    },
                    right: {
                      type: 'BinaryExpression',
                      operator: '*',
                      left: {
                        type: 'Identifier',
                        name: 'page',
                      },
                      right: {
                        type: 'Literal',
                        value: 0x4000,
                        raw: '0x4000',
                      },
                    },
                  },
                },
              };

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
                            'type': 'ReturnStatement',
                            'argument': null
                          }
                        ]
                      },
                      'alternate': null
                    };

                 bytecode.ast.push(tStateCheck);*/

            if (DEBUG) {
              // Inline comment about the current bytecode.
              if (bytecode.ast[0]) {
                bytecode.ast[0].leadingComments = [
                  {
                    type: 'Line',
                    value: ' ' + bytecode.label,
                  },
                ];
              }
            }

            return bytecode.ast;
          });

          /*if (DEBUG && fn[0][0])
                // Inject data about current branch into a comment.
                fn[0][0].leadingComments = [].concat({
                  type: 'Line',
                  value: ' Nb of bytecodes jumping here: ' + fn[0].jumpTargetNb
                }, fn[0][0].leadingComments);*/

          // Flatten the array.
          fn.forEach(function(ast) {
            body = body.concat(ast);
          });

          return body;
        });
      }

      this.ast = functions;
    },
  };

  return CodeGenerator;
})();
