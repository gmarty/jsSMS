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
 * @constructor
 * @param {JSSMS.Z80} cpu
 */
var Recompiler = function(cpu) {
  this.cpu = cpu;
  this.rom = [];
  this.parser = {};
};

Recompiler.prototype = {
  /**
   * @param {Array.<Array|DataView>} rom
   */
  setRom: function(rom) {
    this.rom = rom;

    this.parser = new Parser(rom);
  },


  /**
   * Do initial parsing when a ROM is loaded.
   */
  reset: function() {
    var self = this;

    if (this.rom.length <= 2) {
      // If ROM is below 32KB, we don't have to limit parse to memory pages.
      JSSMS.Utils.console.log('Parsing full ROM');
      this.parser.parse(0x00);
      this.parser.parse(0x38);
      this.parser.parse(0x66);
    } else {
      // Parse initial memory page.
      JSSMS.Utils.console.log('Parsing initial memory page of ROM');
      this.parser.parse(0x00, 0x0000, 0x4000);
      this.parser.parse(0x38, 0x0000, 0x4000);
      this.parser.parse(0x66, 0x0000, 0x4000);
    }

    var analyzer = new Analyzer(this.parser.instructions);

    var optimizer = new Optimizer(analyzer.ast);

    var compiler = new Compiler(optimizer.ast);

    // Attach generated code to an attach point in Z80 instance.
    compiler.ast.forEach(function(fn) {
      var funcName = fn.body[0].id.name;
      var code = window['escodegen']['generate'](fn, {
        comment: true,
        renumber: true,
        hexadecimal: true,
        parse: window['esprima']['parse']
      });
      self.cpu.branches[''][funcName] = new Function('return ' + code)();
    });
  }
};
