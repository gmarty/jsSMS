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
   * Write to a memory location.
   */
  writeMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(address, value) {
        if (address <= 0xffff) {
          this.memWriteMap.setInt8(address & 0x1fff, value);
          if (address == 0xfffc) {
            this.frameReg[3] = value;
          } else if (address == 0xfffd) {
            this.frameReg[0] = value;
          } else if (address == 0xfffe) {
            this.frameReg[1] = value;
          } else if (address == 0xffff) {
            this.frameReg[2] = value;
          }
        } else if (DEBUG) {
          console.error(JSSMS.Utils.toHex(address), JSSMS.Utils.toHex(address & 0x1fff));
          debugger;
        }
      }
    } else {
      /**
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(address, value) {
        // @todo
        /*this.memWriteMap[address >> 14][address & 0x3FFF] = value;

        // Paging registers
        if (address >= 0xFFFC)
          this.page(address & 3, value);*/
      }
    }
  }(),


  /**
   * Read a signed value from next memory location.
   */
  readMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0].getUint8(address);
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0] & this.romPageMask].getUint8(address);
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1] & this.romPageMask].getUint8(address - 0x4000);
        } else if (address < 0xc000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram.getUint8(address - 0x8000);
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram.getUint8(address - 0x4000);
          } else {
            return this.rom[this.frameReg[2] & this.romPageMask].getUint8(address - 0x8000);
          }
        } else if (address < 0xe000) {
          return this.memWriteMap.getUint8(address - 0xc000);
        } else if (address < 0xfffc) {
          return this.memWriteMap.getUint8(address - 0xe000);
        } else if (address == 0xfffc) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xfffd) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xfffe) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xffff) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else if (DEBUG) {
          console.error(JSSMS.Utils.toHex(address));
          debugger;
        }
      }
    } else {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        // @todo
        //return this.memReadMap[address >> 14][address & 0x3FFF] & 0xFF;
      }
    }
  }(),


  /**
   * Read a word (two bytes) from a memory location.
   */
  readMemWord: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0].getUint16(address, LITTLE_ENDIAN);
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0] & this.romPageMask].getUint16(address, LITTLE_ENDIAN);
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1] & this.romPageMask].getUint16(address - 0x4000, LITTLE_ENDIAN);
        } else if (address < 0xc000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram[address - 0x8000];
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram[address - 0x4000];
          } else {
            return this.rom[this.frameReg[2] & this.romPageMask].getUint16(address - 0x8000, LITTLE_ENDIAN);
          }
        } else if (address < 0xe000) {
          return this.memWriteMap.getUint16(address - 0xc000, LITTLE_ENDIAN);
        } else if (address < 0xfffc) {
          return this.memWriteMap.getUint16(address - 0xe000, LITTLE_ENDIAN);
        } else if (address == 0xfffc) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xfffd) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xfffe) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xffff) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else if (DEBUG) {
          console.error(JSSMS.Utils.toHex(address));
          debugger;
        }
      }
    } else {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        // @todo
        /*return (this.memReadMap[address >> 14][address & 0x3FFF] & 0xFF) |
            ((this.memReadMap[++address >> 14][address & 0x3FFF] & 0xFF) << 8);*/
      }
    }
  }(),


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
