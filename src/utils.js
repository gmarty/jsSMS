'use strict';

// Fix console inconsistencies on browsers.
(function() {
  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
    };
  } else if (!('bind' in window.console.log)) {
    // native functions in IE9 might not have bind.
    window.console.log = (function(fn) {
      return function(msg) {
        return fn(msg);
      };
    })(window.console.log);
    window.console.error = (function(fn) {
      return function(msg) {
        return fn(msg);
      };
    })(window.console.error);
  }
})();

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

  Uint8Array: (function() {
    /**
     * @param {number|ArrayBufferView|Array.<number>|ArrayBuffer} length or array or buffer.
     * @return {Uint8Array}
     */
    if (SUPPORT_TYPED_ARRAYS) {
      return Uint8Array;
    } else {
      /**
       * @param {number} length
       * @return {Array}
       */
      return Array;
    }
  })(),

  Uint16Array: (function() {
    /**
     * @param {number|ArrayBufferView|Array.<number>|ArrayBuffer} length or array or buffer.
     * @return {Uint16Array}
     */
    if (SUPPORT_TYPED_ARRAYS) {
      return Uint16Array;
    } else {
      /**
       * @param {number} length
       * @return {Array}
       */
      return Array;
    }
  })(),

  /**
   * Simple polyfill for DataView and ArrayBuffer.
   * \@todo We must use Uint8Array for browsers supporting them but not DataView.
   */
  Array: (function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} length
       * @return {DataView}
       */
      return function(length) {
        return new DataView(new ArrayBuffer(length));
      };
    } else {
      /**
       * @param {number} length
       * @return {Array}
       */
      return Array;
    }
  })(),

  /**
   * Copies an array from the specified source array, beginning at the
   * specified position, to the specified position of the destination array.
   */
  copyArrayElements: (function() {
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
  })(),

  /**
   * A proxy for console that is activated in DEBUG mode only.
   */
  console: {
    log: (function() {
      if (DEBUG) {
        return window.console.log.bind(window.console);
      }
      return function(var_args) {};
    })(),
    error: (function() {
      if (DEBUG) {
        return window.console.error.bind(window.console);
      }
      return function(var_args) {};
    })(),
    /**
     * @todo Develop a polyfill for non supporting browsers like IE.
     */
    time: (function() {
      if (DEBUG && window.console.time) {
        return window.console.time.bind(window.console);
      }
      return function(label) {};
    })(),
    /**
     * @todo Develop a polyfill for non supporting browsers like IE.
     */
    timeEnd: (function() {
      if (DEBUG && window.console.timeEnd) {
        return window.console.timeEnd.bind(window.console);
      }
      return function(label) {};
    })(),
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
        if (Object(child) === child) {
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
  getTimestamp: (function() {
    if (window.performance && window.performance.now) {
      return window.performance.now.bind(window.performance);
    } else {
      return function() {
        return new Date().getTime();
      };
    }
  })(),

  /**
   * Get a hex from a decimal. Pad with 0 if necessary.
   *
   * @param {number} dec A decimal integer.
   * @return {string} A hex representation of the input.
   */
  toHex: function(dec) {
    var minus = dec < 0;
    var hex = Math.abs(dec)
      .toString(16)
      .toUpperCase();
    if (hex.length % 2) {
      hex = '0' + hex;
    }

    if (minus) {
      return '-0x' + hex;
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

    if (obj === undefined) {
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
   * Given a file name, returns the extension.
   *
   * @param {string} fileName The filename, possibly including a path.
   * @return {string} The extension of the file without the leading dot.
   */
  getFileExtension: function(fileName) {
    if (typeof fileName !== 'string') {
      return '';
    }

    return fileName
      .split('.')
      .pop()
      .toLowerCase();
  },

  /**
   * Given a file name, returns the filename, without path or extension.
   *
   * @param {string} fileName The filename, possibly including a path.
   * @return {string} The filename of the file.
   */
  getFileName: function(fileName) {
    if (typeof fileName !== 'string') {
      return '';
    }

    var parts = fileName.split('.');
    parts.pop();
    return parts
      .join('.')
      .split('/')
      .pop();
  },

  /**
   * CRC32 algorithm.
   * @see http://stackoverflow.com/questions/18638900/javascript-crc32
   * @see http://jsperf.com/js-crc32
   *
   * @param {string} str
   * @returns {number}
   */
  crc32: function(str) {
    // Lazy initialisation pattern by David Bruant (@DavidBruant).
    var crcTable = (function makeCRCTable() {
      var c = 0;
      var crcTable = new Uint32Array(256);
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        crcTable[n] = c;
      }

      return crcTable;
    })();

    this.crc32 = function(str) {
      var crc = 0 ^ -1;

      for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
      }

      return (crc ^ -1) >>> 0;
    };

    return this.crc32(str);
  },

  /**
   * Return true if current browser is IE. Not used at the moment.
   *
   * @return {boolean}
   */
  isIE: function() {
    return (
      /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)
    );
  },
};
