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
 * Default implementation of UI. Could as well be defined as an interface, to
 * make sure we don't forget anything when implementing it.
 *
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.DummyUI = function(sms) {
  this.main = sms;
  this.reset = function() {
  };
  this.updateStatus = function() {
  };
  this.writeAudio = function() {
  };
  this.writeFrame = function() {
  };
};



/**
 * A basic UI to be used with Node.js.
 *
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.NodeUI = function(sms) {
  this.main = sms;
  this.client = null;
  // Mocking video buffer.
  this.canvasImageData = {
    data: []
  };
};

JSSMS.NodeUI.prototype = {
  /**
   * Enable and reset UI elements.
   */
  reset: function() {
  },


  /**
   * Update the message. Used mainly for displaying frame rate.
   *
   * @param {string} s The message to display.
   */
  updateStatus: function(s) {
    //this.client && this.client['sendUTF'](s);
  },


  /**
   * @param {Array.<number>} buffer
   */
  writeAudio: function(samples) {
    //this.client && this.client.sendBytes(samples);
  },


  /**
   * Update the canvas screen. ATM, prevBuffer is not used. See JSNES for
   * an implementation of differential update.
   */
  writeFrame: function() {
  },


  writeGraphViz: function() {
    return this.main.cpu.writeGraphViz();
  },


  writeJavaScript: function() {
    return this.main.cpu.writeJavaScript();
  },


  updateDisassembly: function() {
  }
};
