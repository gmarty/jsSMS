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
       * @param {number=} length
       * @return {DataView}
       */
      return function(length) {
        if (!length) {
          length = 0;
        }

        return new DataView(new ArrayBuffer(length));
      }
    } else {
      /**
       * @param {number=} length
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
   * Returns a clone of the source array. Not safe for array of objects.
   */
  copyArray: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {DataView} src The source array.
       * @return {DataView} A copy of source array.
       */
      return function(src) {
        if (!src) {
          return JSSMS.Utils.Array();
        }

        var i, dest;

        i = src.byteLength;
        dest = new JSSMS.Utils.Array(i);

        while (i--) {
          dest.setInt8(i, src.getInt8(i));
        }

        return dest;
      };
    } else {
      /**
       * @param {Array.<number>} src The source array.
       * @return {Array.<number>} A copy of source array.
       */
      return function(src) {
        if (!src) {
          return JSSMS.Utils.Array();
        }

        var i, dest;

        i = src.length;
        dest = new JSSMS.Utils.Array(i);

        while (i--) {
          if (src[i] != undefined)
            dest[i] = src[i];
        }

        return dest;
      };
    }
  }(),


  /**
   * Write to a memory location.
   */
  writeMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {*} self A context.
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(self, address, value) {
        // DEBUG
        if (DEBUG && ((address >> 10) >= self.memWriteMap.length || !self.memWriteMap[address >> 10] || (address & 0x3FF) >= self.memWriteMap[address >> 10].byteLength)) {
          console.error(address, (address >> 10), (address & 0x3FF));
          debugger;
        }

        self.memWriteMap[address >> 10].setInt8(address & 0x3FF, value);

        // Paging registers
        if (address >= 0xFFFC)
          self.page(address & 3, value);
      }
    } else {
      /**
       * @param {*} self A context.
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(self, address, value) {
        self.memWriteMap[address >> 10][address & 0x3FF] = value;

        // Paging registers
        if (address >= 0xFFFC)
          self.page(address & 3, value);
      }
    }
  }(),


  /**
   * Read a signed value from next memory location.
   */
  readMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {Array.<DataView>} array
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(array, address) {
        // DEBUG
        if (DEBUG && ((address >> 10) >= array.length || !array[address >> 10] || (address & 0x3FF) >= array[address >> 10].byteLength)) {
          console.error(address, (address >> 10), (address & 0x3FF));
          debugger;
        }

        return array[address >> 10].getUint8(address & 0x3FF);
      }
    } else {
      /**
       * @param {Array.<Array.<number>>} array
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(array, address) {
        return array[address >> 10][address & 0x3FF] & 0xFF;
      }
    }
  }(),


  /**
   * Read a word (two bytes) from a memory location.
   */
  readMemWord: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {Array.<DataView>} array
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(array, address) {
        // DEBUG
        if (DEBUG && ((address >> 10) >= array.length || !array[address >> 10] || (address & 0x3FF) >= array[address >> 10].byteLength)) {
          console.error(address, (address >> 10), (address & 0x3FF));
          debugger;
        }

        if ((address & 0x3FF) < 1023) {
          return array[address >> 10].getUint16(address & 0x3FF, LITTLE_ENDIAN);
        } else {
          return (array[address >> 10].getUint8(address & 0x3FF)) |
              ((array[++address >> 10].getUint8(address & 0x3FF)) << 8);
        }
      }
    } else {
      /**
       * @param {Array.<Array.<number>>} array
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(array, address) {
        return (array[address >> 10][address & 0x3FF] & 0xFF) |
            ((array[++address >> 10][address & 0x3FF] & 0xFF) << 8);
      }
    }
  }(),


  /**
   * Return the current timestamp in a fast way.
   *
   * @return {number} The current timestamp.
   */
  getTimestamp: Date.now || function() {
    return new Date().getTime();
  },


  /**
   * Get a hex from a decimal. Pad with 0 if necessary.
   *
   * @param {number} dec A decimal integer.
   * @return {string} A hex representation of the input.
   */
  toHex: function(dec) {
    var hex = (dec).toString(16);
    if (hex.length == 1) {
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
