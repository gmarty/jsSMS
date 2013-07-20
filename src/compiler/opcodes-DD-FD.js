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

function generateIndexTable(index) {
  var register2 = index.substring(1, 2);
  var register2LC = index.substring(1, 2).toLowerCase();

  return {
    0x09: {
      name: 'ADD ' + index + ',BC',
      ast: o.ADD16('i', register2, 'b', 'c')
    },
    0x19: {
      name: 'ADD ' + index + ',DE',
      ast: o.ADD16('i', register2, 'd', 'e')
    },
    0x21: {
      name: 'LD ' + index + ',nn',
      ast: o.LD16('i', register2)
    },
    0x22: {
      name: 'LD (nn),' + index,
      ast: o.LD_NN('i' + register2LC + 'H', 'i' + register2LC + 'L')
    },
    0x23: {
      name: 'INC ' + index,
      ast: o.INC16('i', register2)
    },
    0x2A: {
      name: 'LD ' + index + ',(nn)',
      ast: o.LD16('i', register2, 'n', 'n'),
      operand: UINT16
    },
    0x2B: {
      name: 'DEC ' + index,
      ast: o.DEC16('i', register2)
    },
    0x34: {
      name: 'INC (' + index + '+d)',
      ast: o.INC_X('i', register2)
    },
    0x35: {
      name: 'DEC (' + index + '+d)',
      ast: o.DEC_X('i', register2)
    },
    0x36: {
      name: 'LD (' + index + '+d),n',
      ast: o.LD_X('i', register2)
    },
    0x46: {
      name: 'LD B,(' + index + '+d)',
      ast: o.LD8_D('b', 'i', register2)
    },
    0x4E: {
      name: 'LD C,(' + index + '+d)',
      ast: o.LD8_D('c', 'i', register2)
    },
    0x54: {
      name: ' LD D,' + index + 'H *',
      ast: o.LD8('d', 'i' + register2LC + 'H')
    },
    0x56: {
      name: 'LD D,(' + index + '+d)',
      ast: o.LD8_D('d', 'i', register2)
    },
    0x5D: {
      name: 'LD E,' + index + 'L *',
      ast: o.LD8('e', 'i' + register2LC + 'L')
    },
    0x5E: {
      name: 'LD E,(' + index + '+d)',
      ast: o.LD8_D('e', 'i', register2)
    },
    0x60: {
      name: 'LD ' + index + 'H,B',
      ast: o.LD8('i' + register2LC + 'H', 'b')
    },
    0x61: {
      name: 'LD ' + index + 'H,C',
      ast: o.LD8('i' + register2LC + 'H', 'c')
    },
    0x62: {
      name: 'LD ' + index + 'H,D',
      ast: o.LD8('i' + register2LC + 'H', 'd')
    },
    0x63: {
      name: 'LD ' + index + 'H,E',
      ast: o.LD8('i' + register2LC + 'H', 'e')
    },
    0x64: {
      name: 'LD ' + index + 'H,' + index + 'H',
      ast: o.NOOP()
    },
    0x65: {
      name: 'LD ' + index + 'H,' + index + 'L *',
      ast: o.LD8_D('i' + register2LC + 'H', 'i' + register2LC + 'L')
    },
    0x66: {
      name: 'LD H,(' + index + '+d)',
      ast: o.LD8_D('h', 'i', register2)
    },
    0x67: {
      name: 'LD ' + index + 'H,A',
      ast: o.LD8('i' + register2LC + 'H', 'a')
    },
    0x68: {
      name: 'LD ' + index + 'L,B',
      ast: o.LD8('i' + register2LC + 'L', 'b')
    },
    0x69: {
      name: 'LD ' + index + 'L,C',
      ast: o.LD8('i' + register2LC + 'L', 'c')
    },
    0x6A: {
      name: 'LD ' + index + 'L,D',
      ast: o.LD8('i' + register2LC + 'L', 'd')
    },
    0x6B: {
      name: 'LD ' + index + 'L,E',
      ast: o.LD8('i' + register2LC + 'L', 'e')
    },
    0x6C: {
      name: 'LD ' + index + 'L,' + index + 'H',
      ast: o.LD8_D('i' + register2LC + 'L', 'i' + register2LC + 'H')
    },
    0x6D: {
      name: 'LD ' + index + 'L,' + index + 'L *',
      ast: o.NOOP()
    },
    0x6E: {
      name: 'LD L,(' + index + '+d)',
      ast: o.LD8_D('l', 'i', register2)
    },
    0x6F: {
      name: 'LD ' + index + 'L,A *',
      ast: o.LD8('i' + register2LC + 'L', 'a')
    },
    0x70: {
      name: 'LD (' + index + '+d),B',
      ast: o.LD_X('b', 'i', register2)
    },
    0x71: {
      name: 'LD (' + index + '+d),C',
      ast: o.LD_X('c', 'i', register2)
    },
    0x72: {
      name: 'LD (' + index + '+d),D',
      ast: o.LD_X('d', 'i', register2)
    },
    0x73: {
      name: 'LD (' + index + '+d),E',
      ast: o.LD_X('e', 'i', register2)
    },
    0x74: {
      name: 'LD (' + index + '+d),H',
      ast: o.LD_X('h', 'i', register2)
    },
    0x75: {
      name: 'LD (' + index + '+d),L',
      ast: o.LD_X('l', 'i', register2)
    },
    0x76: {
      name: 'LD (' + index + '+d),B',
      ast: o.LD_X('b', 'i', register2)
    },
    0x77: {
      name: 'LD (' + index + '+d),A',
      ast: o.LD_X('a', 'i', register2)
    },
    0x7E: {
      name: 'LD A,(' + index + '+d)',
      ast: o.LD8_D('a', 'i', register2)
    },
    0x7C: {
      name: 'LD A,' + index + 'H',
      ast: o.LD8('a', 'i' + register2LC + 'H')
    },
    0x7D: {
      name: 'LD A,' + index + 'L',
      ast: o.LD8('a', 'i' + register2LC + 'L')
    },
    0x86: {
      name: 'ADD A,(' + index + '+d)',
      ast: o.ADD_X('i', register2)
    },
    0x8E: {
      name: 'ADC A,(' + index + '+d)',
      ast: o.ADC_X('i', register2)
    },
    0x96: {
      name: 'SUB A,(' + index + '+d)',
      ast: o.SUB_X('i', register2)
    },
    0x9E: {
      name: 'SBC A,(' + index + '+d)',
      ast: o.SBC_X('i', register2)
    },
    0xCB:
        index == 'IX' ? opcodeTableDDCB : opcodeTableFDCB,
    0xB6: {
      name: 'OR A,(' + index + '+d)',
      ast: o.OR_X('i', register2)
    },
    0xBE: {
      name: 'CP (' + index + '+d)',
      ast: o.CP_X('i', register2)
    },
    0xE1: {
      name: 'POP ' + index,
      ast: o.POP('i', register2)
    },
    0xE3: {
      name: 'EX SP,(' + index + ')',
      ast: o.EX_SP_X('i', register2)
    },
    0xE5: {
      name: 'PUSH ' + index,
      ast: o.PUSH('i' + register2LC + 'H', 'i' + register2LC + 'L')
    },
    0xE9: {
      name: 'JP (' + index + ')',
      ast: o.JP_X('i', register2)
    },
    0xF9: {
      name: 'LD SP,' + index,
      ast: o.LD_SP('i', register2)
    }
  };
}
