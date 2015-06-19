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

/* jshint -W079 */

'use strict';

/** @const */ var P1_KEY_UP = 0x01;
/** @const */ var P1_KEY_DOWN = 0x02;
/** @const */ var P1_KEY_LEFT = 0x04;
/** @const */ var P1_KEY_RIGHT = 0x08;
/** @const */ var P1_KEY_FIRE1 = 0x10;
/** @const */ var P1_KEY_FIRE2 = 0x20;

/** @const */ var P2_KEY_UP = 0x40;
/** @const */ var P2_KEY_DOWN = 0x80;
/** @const */ var P2_KEY_LEFT = 0x01;
/** @const */ var P2_KEY_RIGHT = 0x02;
/** @const */ var P2_KEY_FIRE1 = 0x04;
/** @const */ var P2_KEY_FIRE2 = 0x08;

/** @const */ var KEY_START = 0x40;
/** @const */ var GG_KEY_START = 0x80;



/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.Keyboard = function(sms) {
  this.main = sms;

  /**
   * Controller 1.
   * @type {number}
   */
  this.controller1 = 0;

  /**
   * Controller 2.
   * @type {number}
   */
  this.controller2 = 0;

  /**
   * Game Gear start button.
   * @type {number}
   */
  this.ggstart = 0;

  /** Lightgun position. */
  /** @type {number} */ this.lightgunX = 0;
  /** @type {number} */ this.lightgunY = 0;

  /**
   * Lightgun button pressed.
   * @type {boolean}
   */
  this.lightgunClick = false;

  /**
   * Lightgun is enabled.
   * @type {boolean}
   */
  this.lightgunEnabled = false;
};

JSSMS.Keyboard.prototype = {
  /**
   * Reset controllers to default state.
   */
  reset: function() {
    // Default 0xFF = No Keys Pressed
    this.controller1 = 0xFF;
    this.controller2 = 0xFF;
    this.ggstart = 0xFF;

    // Turn lightgun off
    if (LIGHTGUN) {
      this.lightgunClick = false;
    }

    this.pause_button = false;
  },


  /**
   * @param {Event} evt A keydown event.
   */
  keydown: function(evt) {
    switch (evt.keyCode) {
      case 38: this.controller1 &= ~P1_KEY_UP; break;     // Up
      case 40: this.controller1 &= ~P1_KEY_DOWN; break;   // Down
      case 37: this.controller1 &= ~P1_KEY_LEFT; break;   // Left
      case 39: this.controller1 &= ~P1_KEY_RIGHT; break;  // Right
      case 88: this.controller1 &= ~P1_KEY_FIRE1; break;  // X
      case 90: this.controller1 &= ~P1_KEY_FIRE2; break;  // Z
      case 13:
        //this.controller1 &= ~P1_KEY_START;
        if (this.main.is_sms) {
          //this.controller2 &= ~0x10; // Reset
          this.main.pause_button = true; // Pause
        } else {
          this.ggstart &= ~GG_KEY_START;   // Start
        }
        break;  // Enter

      case 104: this.controller2 &= ~P2_KEY_UP; break;    // Num-8
      case 98: this.controller2 &= ~P2_KEY_DOWN; break;   // Num-2
      case 100: this.controller2 &= ~P2_KEY_LEFT; break;  // Num-4
      case 102: this.controller2 &= ~P2_KEY_RIGHT; break; // Num-6
      case 103: this.controller2 &= ~P2_KEY_FIRE1; break; // Num-7
      case 105: this.controller2 &= ~P2_KEY_FIRE2; break; // Num-9
      default: return; //browser should handle key event
    }

    evt.preventDefault();
  },


  /**
   * @param {Event} evt A keyup event.
   */
  keyup: function(evt) {
    switch (evt.keyCode) {
      case 38: this.controller1 |= P1_KEY_UP; break;     // Up
      case 40: this.controller1 |= P1_KEY_DOWN; break;   // Down
      case 37: this.controller1 |= P1_KEY_LEFT; break;   // Left
      case 39: this.controller1 |= P1_KEY_RIGHT; break;  // Right
      case 88: this.controller1 |= P1_KEY_FIRE1; break;  // X
      case 90: this.controller1 |= P1_KEY_FIRE2; break;  // Z
      case 13:
        //this.controller1 |= P1_KEY_START;
        if (!this.main.is_sms) {
          //  controller2 |= 0x10;    // Reset/Start
          //else
          this.ggstart |= GG_KEY_START;    // Start
        }
        break;  // Enter

      case 104: this.controller2 |= P2_KEY_UP; break;    // Num-8
      case 98: this.controller2 |= P2_KEY_DOWN; break;   // Num-2
      case 100: this.controller2 |= P2_KEY_LEFT; break;  // Num-4
      case 102: this.controller2 |= P2_KEY_RIGHT; break; // Num-6
      case 103: this.controller2 |= P2_KEY_FIRE1; break; // Num-7
      case 105: this.controller2 |= P2_KEY_FIRE2; break; // Num-9
      default: return; //browser should handle key event
    }

    evt.preventDefault();
  }

  // @todo Add setLightGunPos().
};
