/**
 * @license jsSMS - A Sega Master System/GameGear emulator in JavaScript
 * Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
 * Based on JavaGear Copyright (c) 2002-2008 Chris White.
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


// Constants
/**
 * Whether to enable debug code globally. Set to false at build time.
 * @define {boolean}
 */
var DEBUG = true;


/**
 * @type {boolean}
 */
var ACCURATE = true;


/**
 * @const
 */
var Setup = {
  // Debug settings
  /**
   * Print timing information on screen.
   * @type {boolean}
   */
  DEBUG_TIMING: DEBUG,


  // CPU Settings
  /**
   * Refresh register emulation (not required by any games?).
   * @type {boolean}
   */
  REFRESH_EMULATION: false,


  /*
   * Games requiring accurate interrupt emulation:
   *  - Earthworm Jim (GG)
   */
  /**
   * Do accurate interrupt emulation? (slower!).
   * @type {boolean}
   */
  ACCURATE_INTERRUPT_EMULATION: ACCURATE,


  /*
   * Lightgun Mode (For the following titles):
   *  - Assault City
   *  - Gangster Town
   *  - Laser Ghost
   *  - Marksman Shooting / Trap Shooting / Safari Hunt
   *  - Missile Defense 3D
   *  - Operation Wolf
   *  - Rambo III
   *  - Rescue Mission
   *  - Shooting Gallery
   *  - Space Gun
   *  - Wanted
   */
  /**
   * @type {boolean}
   */
  LIGHTGUN: /*ACCURATE*/ false,


  // VDP Settings
  /*
   * Games requiring sprite collision:
   *  - Cheese Cat'astrophe (SMS)
   *  - Ecco the Dolphin (SMS, GG)
   *  - Fantastic Dizzy (SMS, GG)
   *  - Fantazy Zone Gear (GG)
   *  - Impossible Mission (SMS)
   *  - Taz-Mania (SMS, GG)
   */
  /**
   * Emulate hardware sprite collisions (not used by many games, and slower).
   * @type {boolean}
   */
  VDP_SPRITE_COLLISIONS: ACCURATE,


  // Memory Settings
  /**
   * Size of each memory page (1K in this case).
   * @type {number}
   */
  PAGE_SIZE: 0x400
};
