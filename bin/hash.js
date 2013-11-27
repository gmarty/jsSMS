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
 * Usage: node ./jsSMS/bin/hash.js -f [rom_file_name]
 *
 * Options:
 * -f, --file  The path to a single ROM file  [required]
 * -d, --dir   A folder containing ROM files
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');

var JSSMS = require('../min/jssms.node.js');
var argv = require('optimist')
  .usage('Usage: $0 -f [rom_file_name]')
  .alias('f', 'file')
  .describe('f', 'The path to a single ROM file')
  .alias('d', 'dir')
  .describe('d', 'A folder containing ROM files')
  .argv;

if (argv.file) {
  var crc32 = getCRC32FromFile(argv.file);

  return process.stdout.write('' + crc32);
} else if (argv.dir) {
  // @todo
  glob(argv.dir + path.sep + '**/*', {}, function(err, files) {
    if (err) {
      return new Error(err);
    }

    var result = [];

    files
      .filter(function(file) {
        // Better use this rather than `path.extname()` to ensure consistency with the browser.
        var extension = JSSMS.Utils.getFileExtension(file);
        return extension === 'sms' || extension === 'gg';
      })
      .forEach(function(file) {
        var fileName = file.split(path.sep);
        fileName = fileName [fileName.length - 1];
        result.push(getCRC32FromFile(file) + '\t' + fileName);
      });

    process.stdout.write(result.join('\r'));
  });
} else {
  process.stdout.write('Please specify either -f or -d options.');
}


/**
 * Compute the CRC32 hash from a file.
 * Using the synchronous API for now.
 *
 * @param {string} file
 * @returns {number}
 */
function getCRC32FromFile(file) {
  var data = fs.readFileSync(file, {encoding: 'binary'});

  return JSSMS.Utils.crc32(data);
}
