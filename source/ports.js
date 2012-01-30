/**
 * jsSMS - A Sega Master System/GameGear emulator in JavaScript
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

/** @const */ var IO_TR_DIRECTION = 0;
/** @const */ var IO_TH_DIRECTION = 1;
/** @const */ var IO_TR_OUTPUT = 2;
/** @const */ var IO_TH_OUTPUT = 3;
/** @const */ var IO_TH_INPUT = 4;

/** @const */ var PORT_A = 0;
/** @const */ var PORT_B = 5;



/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.Ports = function(sms) {
  this.main = sms;
  this.vdp = sms.vdp;
  this.psg = sms.psg;
  this.keyboard = sms.keyboard;

  /**
   * European / Domestic system.
   * @type {number}
   */
  this.europe = 0x40;

  /**
   * Horizontal counter latch.
   * @type {number}
   */
  this.hCounter = 0;

  /**
   * I/O Ports A and B * (5 ints each).
   * @type {Array.<number>}
   */
  this.ioPorts = [];
};

JSSMS.Ports.prototype = {
  reset: function() {
    if (Setup.LIGHTGUN) {
      this.ioPorts = new Array(10);
      this.ioPorts[PORT_A + IO_TH_INPUT] = 1;
      this.ioPorts[PORT_B + IO_TH_INPUT] = 1;
    } else {
      this.ioPorts = new Array(2);
    }
  },


  /**
   * Output to a Z80 port.
   *
   * @param {number} port Port number.
   * @param {number} value Value to output.
   */
  out: function(port, value) {
    // Game Gear Serial Ports (do nothing for now)
    if (this.main.is_gg && port < 0x07) {
      return;
    }

    switch (port & 0xC1) {
      // 0x3F IO Port
      // D7 : Port B TH pin output level (1=high, 0=low)
      // D6 : Port B TR pin output level (1=high, 0=low)
      // D5 : Port A TH pin output level (1=high, 0=low)
      // D4 : Port A TR pin output level (1=high, 0=low)
      // D3 : Port B TH pin direction (1=input, 0=output)
      // D2 : Port B TR pin direction (1=input, 0=output)
      // D1 : Port A TH pin direction (1=input, 0=output)
      // D0 : Port A TR pin direction (1=input, 0=output)
      case 0x01:
        // Accurate emulation with HCounter
        if (Setup.LIGHTGUN) {
          this.oldTH = (this.getTH(PORT_A) != 0 || this.getTH(PORT_B) != 0);

          this.writePort(PORT_A, value);
          this.writePort(PORT_B, value >> 2);

          // Toggling TH latches H Counter
          if (!this.oldTH && (this.getTH(PORT_A) != 0 || this.getTH(PORT_B) != 0)) {
            this.hCounter = this.getHCount();
          }
        } else {
          // Rough emulation of Nationalisation bits
          this.ioPorts[0] = (value & 0x20) << 1;
          this.ioPorts[1] = (value & 0x80);

          if (this.europe == 0) {
            // Not European system
            this.ioPorts[0] = ~this.ioPorts[0];
            this.ioPorts[1] = ~this.ioPorts[1];
          }
        }
        break;

      // 0xBE VDP Data port
      case 0x80:
        this.vdp.dataWrite(value);
        break;

      // 0xBD / 0xBF VDP Control port (Mirrored at two locations)
      case 0x81:
        this.vdp.controlWrite(value);
        break;

      // 0x7F: PSG
      case 0x40:
      case 0x41:
        if (this.main.soundEnabled) this.psg.write(value);
        break;
    }
  },


  /**
   * Read from a Z80 port.
   *
   * @param {number} port Port number.
   * @return {number} Value from port number.
   */
  in_: function(port) {
    // Game Gear Serial Ports (not fully emulated)
    if (this.main.is_gg && port < 0x07) {
      switch (port) {
        // GameGear (Start Button and Nationalisation)
        case 0x00:
          return (this.keyboard.ggstart & 0xBF) | this.europe;

        // GG Serial Communication Ports -
        // Return 0 for now as "OutRun" gets stuck in a loop by returning 0xFF
        case 0x01:
        case 0x02:
        case 0x03:
        case 0x04:
        case 0x05:
          return 0;
        case 0x06:
          return 0xFF;
      }
    }

    switch (port & 0xC1) {
      // 0x7E - Vertical Port
      case 0x40:
        return this.vdp.getVCount();

      // 0x7F - Horizontal Port
      case 0x41:
        return this.hCounter;

      // VDP Data port
      case 0x80:
        return this.vdp.dataRead();

      // VDP Control port
      case 0x81:
        return this.vdp.controlRead();

      // 0xC0 / 0xDC - I/O Port A
      // D7 : Port B DOWN pin input
      // D6 : Port B UP pin input
      // D5 : Port A TR pin input
      // D4 : Port A TL pin input
      // D3 : Port A RIGHT pin input
      // D2 : Port A LEFT pin input
      // D1 : Port A DOWN pin input
      // D0 : Port A UP pin input
      case 0xC0:
        return this.keyboard.controller1;

      // 0xC1 / 0xDD - I/O Port B and Misc
      // D7 : Port B TH pin input
      // D6 : Port A TH pin input
      // D5 : Unused
      // D4 : RESET button (1= not pressed, 0= pressed)
      // D3 : Port B TR pin input
      // D2 : Port B TL pin input
      // D1 : Port B RIGHT pin input
      // D0 : Port B LEFT pin input
      case 0xC1:
        if (Setup.LIGHTGUN) {
          if (this.keyboard.lightgunClick)
            this.lightPhaserSync();

          return (this.keyboard.controller2 & 0x3F) | (this.getTH(PORT_A) != 0 ? 0x40 : 0) | (this.getTH(PORT_B) != 0 ? 0x80 : 0);
        } else {
          return (this.keyboard.controller2 & 0x3F) | this.ioPorts[0] | this.ioPorts[1];
        }
    }

    // Default Value is 0xFF
    return 0xFF;
  },


  // Port A/B Emulation
  /**
   * @param {number} index
   * @param {number} value
   */
  writePort: function(index, value) {
    this.ioPorts[index + IO_TR_DIRECTION] = value & 0x01;
    this.ioPorts[index + IO_TH_DIRECTION] = value & 0x02;
    this.ioPorts[index + IO_TR_OUTPUT] = value & 0x10;
    this.ioPorts[index + IO_TH_OUTPUT] = this.europe == 0 ? (~value) & 0x20 : value & 0x20;
  },


  /**
   * @param {number} index
   * @return {number}
   */
  getTH: function(index) {
    return (this.ioPorts[index + IO_TH_DIRECTION] == 0) ?
        this.ioPorts[index + IO_TH_OUTPUT] :
        this.ioPorts[index + IO_TH_INPUT];
  },


  /**
   * @param {number} index
   * @param {boolean} on
   */
  setTH: function(index, on) {
    this.ioPorts[index + IO_TH_DIRECTION] = 1;
    this.ioPorts[index + IO_TH_INPUT] = on ? 1 : 0;
  },


  // H Counter Emulation
  //
  //  The H counter is 9 bits, and reading it returns the upper 8 bits. This is
  //  because a scanline consists of 342 pixels, which couldn't be represented
  //  with an 8-bit counter. Each scanline is divided up as follows:
  //
  //    Pixels H.Cnt   Description
  //    256 : 00-7F : Active display
  //     15 : 80-87 : Right border
  //      8 : 87-8B : Right blanking
  //     26 : 8B-ED : Horizontal sync
  //      2 : ED-EE : Left blanking
  //     14 : EE-F5 : Color burst
  //      8 : F5-F9 : Left blanking
  //     13 : F9-FF : Left border
  /**
   * @return {number}
   */
  getHCount: function() {
    var pixels = Math.round((this.main.cpu.getCycle() * SMS_X_PIXELS) / this.main.cyclesPerLine);
    var v = ((pixels - 8) >> 1);
    if (v > 0x93)
      v += 0xE9 - 0x94;

    return v & 0xFF;
  },


  // Lightgun <-> Port Synchronisation
  // This is a hacky way to do things, but works reasonably well.
  /**
   * X range of Lightgun.
   * @type {number}
   */
  X_RANGE: 48,


  /**
   * Y range of Lightgun.
   * @type {number}
   */
  Y_RANGE: 4,


  lightPhaserSync: function() {
    var oldTH = this.getTH(PORT_A);
    var hc = this.getHCount();

    var dx = this.keyboard.lightgunX - (hc << 1);
    var dy = this.keyboard.lightgunY - this.vdp.line;

    // Within 8 pixels of click on Y value
    // Within 96 pixels of click on X value
    if ((dy > -this.Y_RANGE && dy < this.Y_RANGE) &&
        (dx > -this.X_RANGE && dx < this.X_RANGE)) {
      this.setTH(PORT_A, false);

      // TH has been toggled, update with lightgun position
      if (oldTH != this.getTH(PORT_A))
        this.hCounter = 20 + (this.keyboard.lightgunX >> 1);
    } else {
      this.setTH(PORT_A, true);

      // TH has been toggled, update with usual HCounter value
      if (oldTH != this.getTH(PORT_A))
        this.hCounter = hc;
    }
  },


  /**
   * Set console to European / Japanese model.
   *
   * @param {boolean} value True is European, false is Japanese.
   */
  setDomestic: function(value) {
    this.europe = value ? 0x40 : 0;
  },


  /**
   * @return {boolean}
   */
  isDomestic: function() {
    return this.europe != 0;
  }
};
