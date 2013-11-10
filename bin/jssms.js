#!/usr/bin/env node;
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
 * Command line to generate various type of output from a rom.
 *
 * Usage: node ./jsSMS/bin/jssms.js -f [rom_file_name]
 *
 * Options:
 * -f, --file    ROM file location                                   [required]
 * -v, --viz     Output a viz graph
 * -d, --dump    Dump the ROM to a JavaScript file
 * -o, --output  Output file, otherwise output is written to stdout
 */

var fs = require('fs');
var path = require('path');

var JSSMS = require('../min/jssms.node.js');
var argv = require('optimist')
  .usage('Usage: $0 -f [rom_file_name]')
  .demand('f')
  .alias('f', 'file')
  .describe('f', 'ROM file location')
  .alias('v', 'viz')
  .describe('v', 'Output a viz graph')
  .alias('d', 'dump')
  .describe('d', 'Dump the ROM to a JavaScript file')
  .alias('o', 'output')
  .describe('o', 'Output file, otherwise output is written to stdout')
  .argv;

fs.readFile(argv.file, {encoding: 'binary'}, function(err, data) {
  if (err) return new Error(err);

  var sms = new JSSMS({
    ui: JSSMS.NodeUI,
    ENABLE_COMPILER: false
  });

  sms.readRomDirectly(data, argv.file);
  sms.reset();

  if (argv.v) {
    generateOutput(sms.ui.writeGraphViz());
    return;
  }

  if (argv.d) {
    var tpl = fs.readFileSync(__dirname + '/tpl/z80.js.tpl', {encoding: 'ascii'}).toString();
    tpl = tpl.replace(/\{\{run_method_code\}\}/, sms.ui.writeJavaScript());
    generateOutput(tpl);
    return;
  }

  process.stdout.write('Please specify either -v or -o options.');
});

function generateOutput(content) {
  if (argv.o) {
    fs.writeFile(argv.o, content, {encoding: 'ascii'}, function(err) {
      if (err) return new Error(err);

      process.stdout.write('File successfully generated.');
    });

    return;
  }

  process.stdout.write(content);
}
