'use strict';

/**
 * @param {number} address
 * @param {number} page
 * @constructor
 */
var Bytecode = (function() {
  var toHex = JSSMS.Utils.toHex;

  /**
   * A bytecode is made of:
   *  * at least one and at most 3 opcodes
   *  * an operand (defaults to null, can be 8 or 16 bits)
   *  * a next address (defaults to null)
   *  * a jump target (defaults to null)
   */
  function Bytecode(address, page) {
    this.address = address;
    //this.hexAddress = toHex(address);
    this.page = page;
    this.opcode = [];
    this.operand = null;
    this.nextAddress = null;
    this.target = null;
    this.isFunctionEnder = false;
    this.canEnd = false;
    this.changePage = false;
    this.isJumpTarget = false;
    this.jumpTargetNb = 0; // Number of bytecodes targeting there.
    this.ast = null;
  }

  Bytecode.prototype = {
    get hexOpcode() {
      if (this.opcode.length) {
        return this.opcode.map(toHex).join(' ');
      }

      return '';
    },

    get label() {
      // @todo Generate a function for each opcode instead of this.
      var name = this.name
        ? this.name.replace(
            /(nn|n|PC\+e|d)/,
            toHex(this.target || this.operand || 0)
          )
        : '';
      return (
        toHex(this.address + this.page * PAGE_SIZE) +
        ' ' +
        this.hexOpcode +
        ' ' +
        name
      );
    },
  };

  return Bytecode;
})();
