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
    0x23: {
      name: 'INC ' + index + '',
      ast: o.INC16('i', register2)
    },
    0x2B: {
      name: 'DEC ' + index + '',
      ast: o.DEC16('i', register2)
    },
    0x7E: {
      name: 'LD A,(' + index + '+d)',
      ast: o.LD8_D('a', 'i', register2)
    },
    0xCB:
        generateIndexCBTable(index),
    0xE5: {
      name: 'PUSH ' + index,
      ast: o.PUSH('i' + register2LC + 'H', 'i' + register2LC + 'L')
    }
  };
}
