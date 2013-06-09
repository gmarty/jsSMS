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

var opcodeTableED = {
  0x44: {
    name: 'NEG'
  },
  0x56: {
    name: 'IM1',
    ast: o.IM1()
  },
  0x5F: {
    name: 'LD A,R'
  },
  0x76: {
    name: 'IM1',
    ast: o.IM1()
  },
  0xA3: {
    name: 'OUTI'
  },
  0xB0: {
    name: 'LDIR'
  },
  0xB3: {
    name: 'OTIR'
  }
};
