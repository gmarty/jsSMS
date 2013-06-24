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
  this.generator = new Compiler();

  this.bytecodes = {};
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

    this.options.entryPoints = [
      0x00,
      0x38,
      0x66
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
        fn.body[0].id.name = '_' + funcName;
        var code = self.generateCodeFromAst(fn);

        self.cpu.branches[page]['_' + (funcName - (page * 0x4000))] = new Function('return ' + code)();
      });
    }
  },


  recompileFromAddress: function(address, page) {
    var self = this;

    var fns = this
      .parseFromAddress(address, page)
      .analyzeFromAddress()
      .optimize()
      .generate();

    // Attach generated code to an attach point in Z80 instance.
    fns[0].forEach(function(fn) {
      var funcName = fn.body[0].id.name;
      fn.body[0].id.name = '_' + funcName;
      var code = self.generateCodeFromAst(fn);

      //console.log(funcName, code);

      self.cpu.branches[page]['_' + (funcName - (page * 0x4000))] = new Function('return ' + code)();
    });
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


  parseFromAddress: function(address, page) {
    //self.parser.addEntryPoint(address);
    this.bytecodes = this.parser.parseFromAddress(address, page);

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
      parse: window['esprima']['parse']
    });
  }
};
