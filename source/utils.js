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
   * Copies an array from the specified source array, beginning at the
   * specified position, to the specified position of the destination array.
   *
   * @param {Array.<*>} src The source array.
   * @param {number} srcPos The specified position of the source array.
   * @param {Array.<*>} dest The destination array.
   * @param {number} destPos The specified position of the destination array.
   * @param {number} length The length of the source array portion to copy.
   */
  copyArrayElements: function(src, srcPos, dest, destPos, length) {
    var i = length;

    //for (var i = 0; i < length; ++i) {
    while (i--) {
      dest[destPos + i] = src[srcPos + i];
    }
  },


  /**
   * Returns a clone of the source array. Not safe for array of objects.
   *
   * @param {Array.<number>} src The source array.
   * @return {Array.<number>} A copy of source array.
   */
  copyArray: function(src) {
    if (src === undefined) {
      return [];
    }

    var i = src.length,
        dest = new Array(i);

    while (i--) {
      if (typeof src[i] != 'undefined')
        dest[i] = src[i];
    }
    return dest;
  },


  /**
   * Determine support and prefix of HTML5 features. Returns the prefix of the
   * implementation, or false otherwise.
   *
   * @param {Array.<string>} arr An array of prefixes.
   * @return {string|boolean} The implementation prefix or false.
   */
  getPrefix: function(arr) {
    var prefix = false;

    arr.some(function(prop) {
      if (prop in document) {
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
