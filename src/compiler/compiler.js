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
 * These properties shouldn't be preprended with `this`.
 * @const
 */
var whitelist = [
  'F_CARRY', 'F_NEGATIVE', 'F_PARITY', 'F_OVERFLOW', 'F_BIT3', 'F_HALFCARRY', 'F_BIT5', 'F_ZERO', 'F_SIGN',
  'BIT_0', 'BIT_1', 'BIT_2', 'BIT_3', 'BIT_4', 'BIT_5', 'BIT_6', 'BIT_7',
  'temp'
];



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
    var toHex = JSSMS.Utils.toHex;

    this.functions = this.functions
      .map(function(fn) {
          var body = [];
          var name = fn[0].address;
          var jumpTargetNb = fn[0].jumpTargetNb;

          fn = fn
          .map(function(bytecode) {
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
                        'value': self.getTotalTStates(bytecode.opcode)
                      }
                    }
                  }
                ];

                if (bytecode.nextAddress != null)
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
                        'type': 'Literal',
                        'value': bytecode.nextAddress
                      }
                    }
                  };

                if (DEBUG) {
                  if (decreaseTStateStmt[0]['expression']['right']['value'])
                    decreaseTStateStmt[0]['expression']['right']['raw'] = toHex(decreaseTStateStmt[0]['expression']['right']['value']);
                  if (bytecode.nextAddress != null)
                    updatePcStmt['expression']['right']['raw'] = toHex(updatePcStmt['expression']['right']['value']);
                }

                if (bytecode.ast == null)
                  bytecode.ast = decreaseTStateStmt;
                else
                  bytecode.ast = decreaseTStateStmt.concat(bytecode.ast);

                if (bytecode.nextAddress != null)
                  bytecode.ast.push(updatePcStmt);

                if (DEBUG) {
                  // Inline comment about the current bytecode.
                  bytecode.ast[0].leadingComments = [
                    {
                      type: 'Line',
                      value: ' ' + bytecode.label
                    }
                  ];
                }

                return bytecode.ast;
              });

          if (DEBUG)
            // Inject data about current branch into a comment.
            fn[0][0].leadingComments = [].concat({
              type: 'Line',
              value: ' Nb of instructions jumping here: ' + jumpTargetNb
            }, fn[0][0].leadingComments);

          // Flatten the array.
          fn.forEach(function(ast) {
            body = body.concat(ast);
          });

          // Apply modifications to the AST recursively.
          body = self.convertRegisters(body);

          // Append `this` to all identifiers.
          body = JSSMS.Utils.traverse(body, function(obj) {
            if (obj.type && obj.type == 'Identifier' && whitelist.indexOf(obj.name) == -1)
              obj.name = 'this.' + obj.name;
            return obj;
          });

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
                  'body': body
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


  getTotalTStates: function(opcodes) {
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
