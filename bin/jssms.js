#!/usr/bin/env node;

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
  .describe('o', 'Output file, otherwise output is written to stdout').argv;

fs.readFile(argv.file, { encoding: 'binary' }, function(err, data) {
  if (err) return new Error(err);

  var sms = new JSSMS({
    ui: JSSMS.NodeUI,
    ENABLE_COMPILER: false,
  });

  sms.readRomDirectly(data, argv.file);
  sms.reset();

  if (argv.v) {
    generateOutput(sms.ui.writeGraphViz());
    return;
  }

  if (argv.d) {
    var tpl = fs
      .readFileSync(__dirname + '/tpl/z80.js.tpl', { encoding: 'ascii' })
      .toString();
    tpl = tpl.replace(/\{\{run_method_code\}\}/, sms.ui.writeJavaScript());
    generateOutput(tpl);
    return;
  }

  process.stdout.write('Please specify either -v or -o options.');
});

function generateOutput(content) {
  if (argv.o) {
    fs.writeFile(argv.o, content, { encoding: 'ascii' }, function(err) {
      if (err) return new Error(err);

      process.stdout.write('File successfully generated.');
    });

    return;
  }

  process.stdout.write(content);
}
