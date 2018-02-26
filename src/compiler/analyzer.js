/* global n */

'use strict';

/**
 * @constructor
 */
var Analyzer = (function() {
  /**
   * The analyzer rearranges bytecodes to use JavaScript control flow constructs.
   */
  var Analyzer = function() {
    this.bytecodes = {};
    this.ast = [];

    this.missingOpcodes = {};
  };

  Analyzer.prototype = {
    analyze: function(bytecodes) {
      var i = 0;

      this.bytecodes = bytecodes;
      this.ast = Array(this.bytecodes.length);

      JSSMS.Utils.console.time('Analyzing');
      for (i = 0; i < this.bytecodes.length; i++) {
        this.normalizeBytecode(i);
        this.restructure(i);
      }
      JSSMS.Utils.console.timeEnd('Analyzing');

      for (i in this.missingOpcodes) {
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
          var opcode;
          switch (bytecode.opcode.length) {
            case 1:
              opcode = opcodeTable[bytecode.opcode[0]];
              break;
            case 2:
              opcode = opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]];
              break;
            case 3:
              opcode =
                opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]][
                  bytecode.opcode[2]
                ];
              break;
            default:
              JSSMS.Utils.console.error(
                'Something went wrong in parsing. Opcode: [' +
                  bytecode.hexOpcode +
                  ']'
              );
          }

          if (opcode && opcode.ast) {
            var ast = opcode.ast(
              bytecode.operand,
              bytecode.target,
              bytecode.nextAddress
            );

            // Force ast property to always be an array.
            if (!Array.isArray(ast) && ast !== undefined) {
              ast = [ast];
            }

            if (bytecode.opcode.length > 1 && REFRESH_EMULATION) {
              // Sync server.
              ast = [].concat(
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: n.Identifier('incR'),
                    arguments: [],
                  },
                },
                ast
              );
            }

            bytecode.ast = ast;

            if (DEBUG) {
              bytecode.name = opcode.name;
              if (opcode.opcode) {
                bytecode.opcode = opcode.opcode(
                  bytecode.operand,
                  bytecode.target,
                  bytecode.nextAddress
                );
              }
            }
          } else {
            var i = bytecode.hexOpcode;
            self.missingOpcodes[i] =
              self.missingOpcodes[i] !== undefined
                ? self.missingOpcodes[i] + 1
                : 1;
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

      this.bytecodes[page].forEach(function(bytecode) {
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
    },
  };

  return Analyzer;
})();
