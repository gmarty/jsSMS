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
  this.options = {};

  this.parser = {};
  this.analyzer = new Analyzer();
  this.optimizer = new Optimizer();
  this.generator = new Generator();

  this.bytecodes = {};
};

Recompiler.prototype = {
  /**
   * @param {Array.<Array|DataView>} rom
   */
  setRom: function(rom) {
    this.rom = rom;
    this.parser = new Parser(rom, this.cpu.frameReg);
  },


  /**
   * Do initial parsing when a ROM is loaded.
   */
  reset: function() {
    var self = this;

    this.options.entryPoints = [
      {address: 0x00, romPage: 0, memPage: 0},
      {address: 0x38, romPage: 0, memPage: 0},
      {address: 0x66, romPage: 0, memPage: 0}
    ];

    if (this.rom.length <= 2) {
      // If ROM is below 32KB, we don't have to limit parse to memory pages.
      JSSMS.Utils.console.log('Parsing full ROM');
    } else {
      // Parse initial memory page only.
      this.options.pageLimit = 0;
      JSSMS.Utils.console.log('Parsing initial memory page of ROM');
    }

    var fns = this
      .parse()
      .analyze()
      .optimize()
      .generate();

    // Attach generated code to an attach point in Z80 instance.
    for (var page = 0; page < this.rom.length; page++) {
      fns[page].forEach(function(fn) {
        var funcName = fn.body[0].id.name;
        fn.body[0].id.name = '_' + JSSMS.Utils.toHex(funcName);
        var code = self.generateCodeFromAst(fn);

        self.cpu.branches[page][funcName] = new Function('return ' + code)();
      });
    }
  },


  parse: function() {
    var self = this;

    this.options.entryPoints.forEach(function(entryPoint) {
      self.parser.addEntryPoint(entryPoint);
    });
    this.parser.parse(this.options.pageLimit);

    return this;
  },


  analyze: function() {
    this.analyzer.analyze(this.parser.instructions);

    return this;
  },


  optimize: function() {
    this.optimizer.optimize(this.analyzer.ast);

    return this;
  },


  generate: function() {
    this.generator.generate(this.optimizer.ast);

    return this.generator.ast;
  },


  recompileFromAddress: function(address, romPage, memPage) {
    var self = this;

    var fns = this
      .parseFromAddress(address, romPage, memPage)
      .analyzeFromAddress()
      .optimize()
      .generate();

    // Attach generated code to an attach point in Z80 instance.
    fns[0].forEach(function(fn) {
      var funcName = fn.body[0].id.name;
      fn.body[0].id.name = '_' + JSSMS.Utils.toHex(funcName);
      var code = self.generateCodeFromAst(fn);

      self.cpu.branches[romPage][address % 0x4000] = new Function('return ' + code)();
    });
  },


  parseFromAddress: function(address, romPage, memPage) {
    var obj = {address: address, romPage: romPage, memPage: memPage};
    this.parser.entryPoints.push(obj);
    this.bytecodes = this.parser.parseFromAddress(obj);

    return this;
  },


  analyzeFromAddress: function() {
    this.analyzer.analyzeFromAddress(this.bytecodes);

    return this;
  },


  generateCodeFromAst: function(fn) {
    return window['escodegen']['generate'](fn, {
      comment: true,
      renumber: true,
      hexadecimal: true,
      parse: DEBUG ? window['esprima']['parse'] : function() {}
    });
  },

  /**
   * Generate a string representation of the branches generated.
   */
  dump: function() {
    var output = [];

    // @todo Sort branches here.
    for (var i in this.cpu.branches) {
      output.push('// Page ' + i);
      for (var j in this.cpu.branches[i]) {
        output.push(this.cpu.branches[i][j]);
      }
    }

    output = output.join('\n');
    console.log(output);
  }
};
