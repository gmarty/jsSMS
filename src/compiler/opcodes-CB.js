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
/* exported opcodeTableCB, opcodeTableDDCB, opcodeTableFDCB */

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

var opcodesList = {
  RLC: 'RLC',
  RRC: 'RRC',
  RL: 'RL',
  RR: 'RR',
  SLA: 'SLA',
  SRA: 'SRA',
  SLL: 'SLL',
  SRL: 'SRL'
};

var op = '';
var reg = '';

for (op in opcodesList) {
  for (reg in regs) {
    opcodeTableCB.push({
      name: opcodesList[op] + ' ' + reg,
      ast: o[op].apply(null, regs[reg])
    });
    // @todo Refactor and clean this section.
    if (reg !== '(HL)') {
      opcodeTableDDCB.push({
        name: 'LD ' + reg + ',' + opcodesList[op] + ' (IX)',
        ast: o['LD_' + opcodesList[op]].apply(null, ['ixH', 'ixL'].concat(regs[reg]))
      });
      opcodeTableFDCB.push({
        name: 'LD ' + reg + ',' + opcodesList[op] + ' (IY)',
        ast: o['LD_' + opcodesList[op]].apply(null, ['iyH', 'iyL'].concat(regs[reg]))
      });
    } else {
      opcodeTableDDCB.push({
        name: opcodesList[op] + ' (IX)',
        ast: o['LD_' + opcodesList[op]]('ixH', 'ixL')
      });
      opcodeTableFDCB.push({
        name: opcodesList[op] + ' (IY)',
        ast: o['LD_' + opcodesList[op]]('iyH', 'iyL')
      });
    }
  }
}

opcodesList = {
  BIT: 'BIT',
  RES: 'RES',
  SET: 'SET'
};

var i = 0;
var j = 0;

for (op in opcodesList) {
  for (i = 0; i < 8; i++) {
    for (reg in regs) {
      opcodeTableCB.push({
        name: opcodesList[op] + ' ' + i + ',' + reg,
        ast: o[op].apply(null, [i].concat(regs[reg]))
      });
    }
    for (j = 0; j < 8; j++) {
      opcodeTableDDCB.push({
        name: opcodesList[op] + ' ' + i + ' (IX)',
        ast: o[op].apply(null, [i].concat(['ixH', 'ixL']))
      });
      opcodeTableFDCB.push({
        name: opcodesList[op] + ' ' + i + ' (IY)',
        ast: o[op].apply(null, [i].concat(['iyH', 'iyL']))
      });
    }
  }
}
