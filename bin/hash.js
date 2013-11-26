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

var JSSMS = require('../min/jssms.node.js');
var argv = require('optimist')
  .usage('Usage: $0 -f [rom_file_name]')
  .demand('f')
  .alias('f', 'file')
  .describe('f', 'The path to a single ROM file')
  .alias('d', 'dir')
  .describe('d', 'A folder containing ROM files')
  .argv;

fs.readFile(argv.file, {encoding: 'ascii'}, function(err, data) {
  if (err) {
    return new Error(err);
  }

  return process.stdout.write('' + JSSMS.Utils.crc32(data));
});
