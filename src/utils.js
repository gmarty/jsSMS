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

JSSMS.Utils = {
  /**
   * Generate a random integer.
   *
   * @param {number} range Generate random numbers from 0 to range.
   *              A range of 4 would generate numbers between 0 and 3.
   * @return {number} A random integer.
   */
  rndInt: function(range) {
    return Math.round(Math.random() * range);
  },


  /**
   * Simple polyfill for DataView and ArrayBuffer.
   * \@todo We must use Uint8Array for browsers supporting them but not DataView.
   */
  Array: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} length
       * @return {DataView}
       */
      return function(length) {
        return new DataView(new ArrayBuffer(length));
      }
    } else {
      /**
       * @param {number} length
       * @return {Array}
       */
      return Array;
    }
  }(),


  /**
   * Copies an array from the specified source array, beginning at the
   * specified position, to the specified position of the destination array.
   */
  copyArrayElements: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {DataView} src The source DataView.
       * @param {number} srcPos The specified position of the source array.
       * @param {DataView} dest The destination DataView.
       * @param {number} destPos The specified position of the destination array.
       * @param {number} length The length of the source array portion to copy.
       */
      return function(src, srcPos, dest, destPos, length) {
        while (length--) {
          dest.setInt8(destPos + length, src.getInt8(srcPos + length));
        }
      };
    } else {
      /**
       * @param {Array.<number>} src The source array.
       * @param {number} srcPos The specified position of the source array.
       * @param {Array.<number>} dest The destination array.
       * @param {number} destPos The specified position of the destination array.
       * @param {number} length The length of the source array portion to copy.
       */
      return function(src, srcPos, dest, destPos, length) {
        while (length--) {
          dest[destPos + length] = src[srcPos + length];
        }
      };
    }
  }(),


  /**
   * A proxy for console that is activated in DEBUG mode only.
   */
  console: {
    log: function() {
      if (DEBUG)
        window.console.log.apply(window.console, arguments);
    },
    error: function() {
      if (DEBUG)
        window.console.error.apply(window.console, arguments);
    },
    time: function(label) {
      if (DEBUG)
        window.console.time(label);
    },
    timeEnd: function(label) {
      if (DEBUG)
        window.console.timeEnd(label);
    }
  },


  /**
   * Apply a function recursively on an object and its children.
   *
   * @param {Object} object
   * @param {Function} fn
   * @return {Object} object.
   */
  traverse: function(object, fn) {
    var key, child;

    /*// Return false to stop the recursive process.
     if ( === false) {
     return;
     }*/
    fn.call(null, object);

    for (key in object) {
      if (object.hasOwnProperty(key)) {
        child = object[key];
        if (typeof child === 'object' && child !== null) {
          object[key] = JSSMS.Utils.traverse(child, fn);
        }
      }
    }

    return object;
  },


  /**
   * Return the current timestamp in a fast way.
   *
   * @return {number} The current timestamp.
   */
  getTimestamp: function() {
    if (window.performance && window.performance.now) {
      return function() {
        return window.performance.now();
      }
    } else {
      return function() {
        return new Date().getTime();
      }
    }
  }(),


  /**
   * Get a hex from a decimal. Pad with 0 if necessary.
   *
   * @param {number} dec A decimal integer.
   * @return {string} A hex representation of the input.
   */
  toHex: function(dec) {
    var hex = (dec).toString(16).toUpperCase();
    if (hex.length % 2) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  },


  /**
   * Determine support and prefix of HTML5 features. Returns the prefix of the
   * implementation, or false otherwise.
   *
   * @param {Array.<string>} arr An array of prefixes.
   * @param {Object=} obj An object to check the prefix against, default to `window.document`.
   * @return {string|boolean} The implementation prefix or false.
   */
  getPrefix: function(arr, obj) {
    var prefix = false;

    if (obj == undefined) {
      obj = document;
    }

    arr.some(function(prop) {
      if (prop in obj) {
        prefix = prop;
        return true;
      }
      return false;
    });

    return prefix;
  },


  /**
   * Return true if current browser is IE. Not used at the moment.
   *
   * @return {boolean}
   */
  isIE: function() {
    return (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));
  }
};
