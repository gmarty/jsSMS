'use strict';

/**
 * This file is heavily inspired by n64.js.
 */

/** @const */ var LOG_LENGTH = 100;

/**
 * @todo Use jQuery here.
 * @constructor
 */
function BinaryRequest(method, url, args, data, cb) {
  method = method || 'GET';

  var alwaysCallbacks = [];

  if (args) {
    var arg_str = [];
    var i;
    for (i in args) {
      var arg = encodeURI(i);
      if (args[i] !== undefined) {
        arg += '=' + encodeURI(args[i]);
      }
      arg_str.push(arg);
    }

    url += '?' + arg_str.join('&');
  }

  function invokeAlways() {
    var i;
    for (i = 0; i < alwaysCallbacks.length; ++i) {
      alwaysCallbacks[i]();
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  try {
    xhr.responseType = 'arraybuffer';
  } catch (e) {
    console.error('responseType arrayBuffer not supported!');
  }
  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      invokeAlways();
    }
  };
  xhr.onload = function onload() {
    if (this.response instanceof ArrayBuffer) {
      cb(this.response);
    } else {
      console.error(
        'Bad response type: ' +
          typeof this.response +
          ' for ' +
          JSON.stringify(this.response)
      );
    }
  };
  xhr.send(data);

  this.always = function(cb) {
    // If the request has already completed then ensure the callback is called.
    if (xhr.readyState === 4) {
      cb();
    }
    alwaysCallbacks.push(cb);
    return this;
  };
}

/**
 * @constructor
 */
function SyncWriter() {
  this.kBufferLength = 1024 * 1024 / 2;
  this.syncBuffer = new Uint16Array(this.kBufferLength);
  this.syncBufferIdx = 0;

  this.fileOffset = 0;
  this.curRequest = null;
  this.buffers = [];
}

SyncWriter.prototype = {
  flushBuffer: function() {
    if (this.syncBufferIdx >= this.syncBuffer.length) {
      this.buffers.push(this.syncBuffer);
      this.syncBuffer = new Uint16Array(this.kBufferLength);
      this.syncBufferIdx = 0;
    }
  },

  tick: function() {
    if (!this.curRequest && this.syncBufferIdx > 0) {
      var b = new Uint16Array(this.syncBufferIdx);
      for (var i = 0; i < this.syncBufferIdx; ++i) {
        b[i] = this.syncBuffer[i];
      }
      this.buffers.push(b);
      this.syncBuffer = new Uint16Array(this.kBufferLength);
      this.syncBufferIdx = 0;
    }

    // If no request is active and we have more buffers to flush, kick off the next upload.
    if (!this.curRequest && this.buffers.length > 0) {
      var self = this;

      var buffer = this.buffers[0];
      this.buffers.splice(0, 1);
      var bytes = buffer.length * 2;

      this.curRequest = new BinaryRequest(
        'POST',
        '/wsynclog',
        {
          o: this.fileOffset,
          l: bytes,
        },
        buffer,
        function() {
          self.fileOffset += bytes;
        }
      ).always(function() {
        self.curRequest = null;
      });
    }

    return this.buffers.length === 0;
  },

  getAvailableBytes: function() {
    // NB we can always handle full buffers, so return a large number here.
    return 1000000000;
  },

  /**
   * @param {number} val
   * @param {string} name Name of the value to sync. Unused in write mode.
   */
  sync16: function(val, name) {
    if (this.syncBufferIdx >= this.syncBuffer.length) {
      this.flushBuffer();
    }

    this.syncBuffer[this.syncBufferIdx] = val;
    this.syncBufferIdx++;
  },

  reflect16: function(val) {
    if (this.syncBufferIdx >= this.syncBuffer.length) {
      this.flushBuffer();
    }

    this.syncBuffer[this.syncBufferIdx] = val;
    this.syncBufferIdx++;
    return val;
  },
};

/**
 * @constructor
 */
function SyncReader() {
  this.kBufferLength = 1024 * 1024;
  this.syncBuffer = null;
  this.syncBufferIdx = 0;

  this.fileOffset = 0;
  this.curRequest = null;
  this.oos = false;
  this.nextBuffer = null;

  this.log = new Array(LOG_LENGTH);
}

SyncReader.prototype = {
  refill: function() {
    if (!this.syncBuffer || this.syncBufferIdx >= this.syncBuffer.length) {
      this.syncBuffer = this.nextBuffer;
      this.syncBufferIdx = 0;
      this.nextBuffer = null;
    }
  },

  tick: function() {
    this.refill();

    if (!this.nextBuffer && !this.curRequest) {
      var self = this;

      this.curRequest = new BinaryRequest(
        'GET',
        '/rsynclog',
        {
          o: this.fileOffset,
          l: this.kBufferLength,
        },
        undefined,
        function(result) {
          self.nextBuffer = new Uint16Array(result);
          self.fileOffset += result.byteLength;
        }
      ).always(function() {
        self.curRequest = null;
      });

      return false;
    }

    return true;
  },

  getAvailableBytes: function() {
    var ops = 0;

    if (this.syncBuffer) {
      ops += this.syncBuffer.length - this.syncBufferIdx;
    }
    if (this.nextBuffer) {
      ops += this.nextBuffer.length;
    }

    return ops * 2;
  },

  pop: function() {
    if (!this.syncBuffer || this.syncBufferIdx >= this.syncBuffer.length) {
      this.refill();
    }

    if (this.syncBuffer && this.syncBufferIdx < this.syncBuffer.length) {
      var r = this.syncBuffer[this.syncBufferIdx];
      this.syncBufferIdx++;
      return r;
    }

    return -1;
  },

  /**
   * @param {number} val
   * @param {string} name
   */
  sync16: function(val, name) {
    if (this.oos) {
      return;
    }

    var toHex = JSSMS.Utils.toHex;
    var writtenVal = this.pop();

    if (val === writtenVal) {
      this.log.shift();
      this.log.push([name, toHex(val), toHex(writtenVal)]);
    } else {
      this.log.forEach(function(log) {
        console.log.apply(console, log);
      });
      this.log = new Array(LOG_LENGTH); // Flushing the log

      console.log('%c' + name, 'color: red;', toHex(val), toHex(writtenVal));

      if (name === 'pc') {
        // Flag that we're out of sync so that we don't keep spamming errors.
        //this.oos = true;
      }
    }
  },

  reflect16: function(val) {
    if (this.oos) {
      return val;
    }
    // Ignore val, just return the recorded value from the stream.
    return this.pop();
  },
};
