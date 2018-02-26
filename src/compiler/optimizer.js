/* global n */

'use strict';

/**
 * Apply several passes to the ast.
 * A pass looks for patterns and optimize the code accordingly.
 * Each pass must leave the code in a valid state.
 *
 * @constructor
 */
var Optimizer = (function() {
  var Optimizer = function(main) {
    this.main = main; // References the parent instance of JSSMS.
    this.ast = [];
  };

  Optimizer.prototype = {
    /**
     * @param {Array.<Array.<Array.<Object>>>} functions
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
      this.ast[page] = this.ast[page].map(this.portPeephole.bind(this));
      this.ast[page] = this.ast[page].map(this.evaluateBinaryExpressions);
      this.ast[page] = this.ast[page].map(this.inlineRegisters);
      this.ast[page] = this.ast[page].map(
        this.evaluateMemberExpressions.bind(this)
      );
      this.ast[page] = this.ast[page].map(this.trimAfterReturn.bind(this));
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
     * @param {Array.<Object>} fn
     * @return {Array.<Object>}
     */
    evaluateBinaryExpressions: function(fn) {
      return fn.map(function(_ast) {
        _ast = JSSMS.Utils.traverse(_ast, function(ast) {
          if (
            ast['type'] === 'BinaryExpression' &&
            ast['left']['type'] === 'Literal' &&
            ast['right']['type'] === 'Literal'
          ) {
            var value = 0;
            switch (ast['operator']) {
              case '>>':
                value = ast['left']['value'] >> ast['right']['value'];
                break;
              case '&':
                value = ast['left']['value'] & ast['right']['value'];
                break;
              default:
                JSSMS.Utils.console.log(
                  'Unimplemented evaluation optimization for operator',
                  ast['operator']
                );
                return ast;
            }

            // Change the properties of the AST node.
            ast['type'] = 'Literal';
            ast['value'] = value;
            ast['raw'] = DEBUG ? JSSMS.Utils.toHex(value) : '' + value;
            delete ast['right'];
            delete ast['left'];
          }

          return ast;
        });

        return _ast;
      });
    },

    /**
     * Evaluate members expressions when the property is a literal:
     * ```
     * this.f = this.SZP_TABLE[0x00];
     * ```
     *
     * Is optimized into:
     * ```
     * this.f = 0x44;
     * ```
     *
     * @param {Array.<Object>} fn
     * @return {Array.<Object>}
     */
    evaluateMemberExpressions: function(fn) {
      var self = this;

      return fn.map(function(_ast) {
        _ast = JSSMS.Utils.traverse(_ast, function(ast) {
          if (
            ast['type'] === 'MemberExpression' &&
            ast['object']['name'] === 'SZP_TABLE' &&
            ast['property']['type'] === 'Literal'
          ) {
            var value = self.main.cpu.SZP_TABLE[ast['property']['value']];

            // Change the properties of the AST node.
            ast['type'] = 'Literal';
            ast['value'] = value;
            ast['raw'] = DEBUG ? JSSMS.Utils.toHex(value) : '' + value;
            delete ast['computed'];
            delete ast['object'];
            delete ast['property'];
          }

          return ast;
        });

        return _ast;
      });
    },

    /**
     * This pass replaces references to defined registers with their respective values:
     * ```
     * b = 0x03;
     * setUint8(0xFFFE, b);
     * ```
     *
     * Is optimized into:
     * ```
     * b = 0x03;
     * setUint8(0xFFFE, 0x03);
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
     * @param {Array.<Object>} fn
     * @return {Array.<Object>}
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
        l: false,
      };
      var definedRegValue = {
        //a: {},
        //f: {},
        b: {},
        c: {},
        d: {},
        e: {},
        h: {},
        l: {},
      };

      return fn.map(function(_ast) {
        _ast = JSSMS.Utils.traverse(_ast, function(ast) {
          // 1st, we tag defined registers.
          if (
            ast['type'] === 'AssignmentExpression' &&
            ast['operator'] === '=' &&
            ast['left']['type'] === 'Register' &&
            ast['right']['type'] === 'Literal' &&
            ast['left']['name'] !== 'a' &&
            ast['left']['name'] !== 'f'
          ) {
            definedReg[ast['left']['name']] = true;
            definedRegValue[ast['left']['name']] = ast['right'];
          }

          // And we make sure to tag undefined registers.
          if (
            ast['type'] === 'AssignmentExpression' &&
            ast['left']['type'] === 'Register' &&
            ast['right']['type'] !== 'Literal' &&
            ast['left']['name'] !== 'a' &&
            ast['left']['name'] !== 'f'
          ) {
            definedReg[ast['left']['name']] = false;
            definedRegValue[ast['left']['name']] = {};
            return ast;
          }

          // Then inline arguments.
          if (ast['type'] === 'CallExpression') {
            if (
              ast['arguments'][0] &&
              ast['arguments'][0]['type'] === 'Register' &&
              definedReg[ast['arguments'][0]['name']] &&
              ast['arguments'][0]['name'] !== 'a' &&
              ast['arguments'][0]['name'] !== 'f'
            ) {
              ast['arguments'][0] =
                definedRegValue[ast['arguments'][0]['name']];
            }
            if (
              ast['arguments'][1] &&
              ast['arguments'][1]['type'] === 'Register' &&
              definedReg[ast['arguments'][1]['name']] &&
              ast['arguments'][1]['name'] !== 'a' &&
              ast['arguments'][1]['name'] !== 'f'
            ) {
              ast['arguments'][1] =
                definedRegValue[ast['arguments'][1]['name']];
            }
            return ast;
          }

          // Inline object/array properties.
          if (
            ast['type'] === 'MemberExpression' &&
            ast['property']['type'] === 'Register' &&
            definedReg[ast['property']['name']] &&
            ast['property']['name'] !== 'a' &&
            ast['property']['name'] !== 'f'
          ) {
            ast['property'] = definedRegValue[ast['property']['name']];
            return ast;
          }

          // Inline binary expressions.
          if (ast['type'] === 'BinaryExpression') {
            if (
              ast['right']['type'] === 'Register' &&
              definedReg[ast['right']['name']] &&
              ast['right']['name'] !== 'a' &&
              ast['right']['name'] !== 'f'
            ) {
              ast['right'] = definedRegValue[ast['right']['name']];
            }
            if (
              ast['left']['type'] === 'Register' &&
              definedReg[ast['left']['name']] &&
              ast['left']['name'] !== 'a' &&
              ast['left']['name'] !== 'f'
            ) {
              ast['left'] = definedRegValue[ast['left']['name']];
            }
            return ast;
          }

          return ast;
        });

        return _ast;
      });
    },

    /**
     * This pass inlines the port communication through bypassing port.out and port.in_ and calling
     * directly the method based on the value passed:
     * ```
     * this.a = this.port.in_(0x7E);
     * ```
     *
     * Becomes:
     * ```
     * this.a = this.vdp.getVCount();
     * ```
     *
     * Please note that this is Sega Master System & Game Gear specific. Don't use this pass if you
     * emulate another Z80 system.
     *
     * @param {Array.<Object>} fn
     * @return {Array.<Object>}
     */
    portPeephole: function(fn) {
      var self = this;

      return fn.map(function(_ast) {
        _ast = JSSMS.Utils.traverse(_ast, function(ast) {
          if (ast['type'] === 'CallExpression') {
            var port;
            if (ast['callee']['name'] === 'port.out') {
              port = ast['arguments'][0]['value'];
              var value = ast['arguments'][1];

              if (self.main.is_gg && port < 0x07) {
                ast['callee']['name'] = 'nop';
                return undefined;
              }

              switch (port & 0xc1) {
                case 0x01:
                  // @todo
                  break;

                case 0x80:
                  ast['callee']['name'] = 'vdp.dataWrite';
                  ast['arguments'] = [value];
                  break;

                case 0x81:
                  ast['callee']['name'] = 'vdp.controlWrite';
                  ast['arguments'] = [value];
                  break;

                case 0x40:
                case 0x41:
                  if (self.main.soundEnabled) {
                    ast['callee']['name'] = 'psg.write';
                    ast['arguments'] = [value];
                  } else {
                    // @todo Remove the AST node.
                  }
                  break;
              }

              return ast;
            } else if (ast['callee']['name'] === 'port.in_') {
              port = ast['arguments'][0]['value'];

              if (self.main.is_gg && port < 0x07) {
                switch (port) {
                  case 0x00:
                    // (port.keyboard.ggstart & 0xBF) | port.europe
                    ast['type'] = 'BinaryExpression';
                    ast['operator'] = '|';
                    ast['left'] = n.BinaryExpression(
                      '&',
                      n.Identifier('port.keyboard.ggstart'),
                      n.Literal(0xbf)
                    );
                    ast['right'] = n.Identifier('port.europe');
                    delete ast['callee'];
                    delete ast['arguments'];
                    return ast;

                  case 0x01:
                  case 0x02:
                  case 0x03:
                  case 0x04:
                  case 0x05:
                    ast['type'] = 'Literal';
                    ast['value'] = 0x00;
                    ast['raw'] = DEBUG ? JSSMS.Utils.toHex(0x00) : '' + 0x00;
                    delete ast['callee'];
                    delete ast['arguments'];
                    return ast;

                  case 0x06:
                    ast['type'] = 'Literal';
                    ast['value'] = 0xff;
                    ast['raw'] = DEBUG ? JSSMS.Utils.toHex(0xff) : '' + 0xff;
                    delete ast['callee'];
                    delete ast['arguments'];
                    return ast;
                }
              }

              switch (port & 0xc1) {
                case 0x40:
                  ast['callee']['name'] = 'vdp.getVCount';
                  ast['arguments'] = [];
                  return ast;

                case 0x41:
                  ast['type'] = 'Identifier';
                  ast['name'] = 'port.hCounter';
                  delete ast['callee'];
                  delete ast['arguments'];
                  return ast;

                case 0x80:
                  ast['callee']['name'] = 'vdp.dataRead';
                  ast['arguments'] = [];
                  return ast;

                case 0x81:
                  ast['callee']['name'] = 'vdp.controlRead';
                  ast['arguments'] = [];
                  return ast;

                case 0xc0:
                  ast['type'] = 'Identifier';
                  ast['name'] = 'main.keyboard.controller1';
                  delete ast['callee'];
                  delete ast['arguments'];
                  return ast;

                case 0xc1:
                  // @todo
                  if (LIGHTGUN) {
                    // if (this.keyboard.lightgunClick) {
                    //   this.port.lightPhaserSync();
                    // }
                    // (main.keyboard.controller2 & 0x3F) | (port.getTH(PORT_A) !== 0 ? 0x40 : 0) | (port.getTH(PORT_B) !== 0 ? 0x80 : 0)
                    return ast;
                  } else {
                    // @todo Test me.
                    // (main.keyboard.controller2 & 0x3F) | port.ioPorts[0] | port.ioPorts[1]
                    ast['type'] = 'BinaryExpression';
                    ast['operator'] = '|';
                    ast['left'] = n.BinaryExpression(
                      '|',
                      n.BinaryExpression(
                        '&',
                        n.Identifier('main.keyboard.controller2'),
                        n.Literal(0x3f)
                      ),
                      n.MemberExpression(
                        n.Identifier('port.ioPorts'),
                        n.Literal(0)
                      )
                    );
                    ast['right'] = n.MemberExpression(
                      n.Identifier('port.ioPorts'),
                      n.Literal(1)
                    );
                    delete ast['callee'];
                    delete ast['arguments'];
                    return ast;
                  }
              }

              ast['type'] = 'Literal';
              ast['value'] = 0xff;
              ast['raw'] = DEBUG ? JSSMS.Utils.toHex(0xff) : '' + 0xff;
              delete ast['callee'];
              delete ast['arguments'];
              return ast;
            }
          }

          return ast;
        });

        return _ast;
      });
    },

    /**
     * A pass to remove all instructions from a function body located
     * after a return statement:
     * ```
     * this.pc = 1382;
     * return;
     * this.pc = 134 + page * 16384;
     * ```
     *
     * Becomes:
     * ```
     * this.pc = 1382;
     * return;
     * ```
     *
     * @param {Array.<Object>} fn
     * @return {Array.<Object>}
     */
    trimAfterReturn: function(fn) {
      var returnStatementIndex = null;

      fn.some(function(ast, index) {
        if (ast['type'] === 'ReturnStatement') {
          returnStatementIndex = index;
          return true;
        }
      });

      if (returnStatementIndex) {
        fn = fn.slice(0, returnStatementIndex);
      }

      return fn;
    },
  };

  return Optimizer;
})();
