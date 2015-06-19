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

/* jshint -W079, -W098 */

'use strict';



/**
 * @param {JSSMS.Z80} cpu
 * @constructor
 */
var Recompiler = (function() {
  var Recompiler = function(cpu) {
    this.cpu = cpu;
    this.rom = [];
    this.options = {};

    this.parser = {};
    this.analyzer = new Analyzer();
    this.optimizer = new Optimizer(cpu.main);
    this.generator = new CodeGenerator();

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
        {address: 0x00, romPage: 0, memPage: 0}
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
        .generate()
        .optimize();

      // Attach generated code to an attach point in Z80 instance.
      for (var page = 0; page < this.rom.length; page++) {
        fns[page].forEach(function(body) {
          var funcName = '_' + body[0]._address;

          body = self.convertRegisters(body);
          body = self.thisifyIdentifiers(body);

          body = self.wrapFunction(funcName, body);
          self.cpu.branches[page][funcName] = new Function('return ' + self.generateCodeFromAst(body))();
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
      this.analyzer.analyze(this.parser.bytecodes);

      return this;
    },


    generate: function() {
      this.generator.generate(this.analyzer.ast);

      return this;
    },


    optimize: function() {
      this.optimizer.optimize(this.generator.ast);

      return this.optimizer.ast;
    },


    recompileFromAddress: function(address, romPage, memPage) {
      var self = this;

      var fns = this
        .parseFromAddress(address, romPage, memPage)
        .analyzeFromAddress()
        .generate()
        .optimize();

      // Attach generated code to an attach point in Z80 instance.
      fns[0].forEach(function(body) {
        var funcName = '_' + (address % 0x4000);

        body = self.convertRegisters(body);
        body = self.thisifyIdentifiers(body);

        body = self.wrapFunction(funcName, body);
        self.cpu.branches[romPage][funcName] = new Function('return ' + self.generateCodeFromAst(body))();
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
        parse: DEBUG ? window['esprima']['parse'] : function(c) {
          return {
            'type': 'Program',
            'body': [
              {
                'type': 'ExpressionStatement',
                'expression': {
                  'type': 'Literal',
                  'value': c,
                  'raw': c
                }
              }
            ]
          };
        }
      });
    },


    /**
     * Append `this` to all identifiers.
     */
    thisifyIdentifiers: function(body) {
      /**
       * These properties shouldn't be prepended with `this`.
       * @const
       */
      var whitelist = [
        'page', 'temp', 'location', 'val', 'value', 'JSSMS.Utils.rndInt'
      ];

      return JSSMS.Utils.traverse(body, function(obj) {
        if (obj.type && obj.type === 'Identifier' && whitelist.indexOf(obj.name) === -1) {
          obj.name = 'this.' + obj.name;
        }
        return obj;
      });
    },

    /**
     * Replace `Register` type with `Identifier`.
     */
    convertRegisters: function(ast) {
      return JSSMS.Utils.traverse(ast, function(ast) {
        if (ast.type === 'Register') {
          ast.type = 'Identifier';
        }

        return ast;
      });
    },


    wrapFunction: function(funcName, body) {
      return {
        'type': 'Program',
        'body': [
          {
            'type': 'FunctionDeclaration',
            'id': {
              'type': 'Identifier',
              // Name of the function (i.e. starting index).
              'name': funcName
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

  return Recompiler;
})();
