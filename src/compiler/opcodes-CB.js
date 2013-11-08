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

/* global o */

'use strict';

var opcodeTableCB = [];
var opcodeTableDDCB = [];
var opcodeTableFDCB = [];

var regs = {
  'B': ['b'],
  'C': ['c'],
  'D': ['d'],
  'E': ['e'],
  'H': ['h'],
  'L': ['l'],
  '(HL)': ['h', 'l'],
  'A': ['a']
};

['RLC', 'RRC', 'RL', 'RR', 'SLA', 'SRA', 'SLL', 'SRL'].forEach(function(op) {
  for (var reg in regs) {
    opcodeTableCB.push({
      name: op + ' ' + reg,
      ast: o[op].apply(null, regs[reg])
    });
    // @todo Refactor and clean this section.
    if (reg !== '(HL)') {
      opcodeTableDDCB.push({
        name: 'LD ' + reg + ',' + op + ' (IX)',
        ast: o['LD_' + op].apply(null, ['ixH', 'ixL'].concat(regs[reg]))
      });
      opcodeTableFDCB.push({
        name: 'LD ' + reg + ',' + op + ' (IY)',
        ast: o['LD_' + op].apply(null, ['iyH', 'iyL'].concat(regs[reg]))
      });
    } else {
      opcodeTableDDCB.push({
        name: op + ' (IX)',
        ast: o['LD_' + op]('ixH', 'ixL')
      });
      opcodeTableFDCB.push({
        name: op + ' (IY)',
        ast: o['LD_' + op]('iyH', 'iyL')
      });
    }
  }
});

['BIT', 'RES', 'SET'].forEach(function(op) {
  for (var i = 0; i < 8; i++) {
    for (var reg in regs) {
      opcodeTableCB.push({
        name: op + ' ' + i + ',' + reg,
        ast: o[op].apply(null, [i].concat(regs[reg]))
      });
    }
    for (var j = 0; j < 8; j++) {
      opcodeTableDDCB.push({
        name: op + ' ' + i + ' (IX)',
        ast: o[op].apply(null, [i].concat(['ixH', 'ixL']))
      });
      opcodeTableFDCB.push({
        name: op + ' ' + i + ' (IY)',
        ast: o[op].apply(null, [i].concat(['iyH', 'iyL']))
      });
    }
  }
});
