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



/**
 * Default implementation of UI. Could as well be defined as an interface, to
 * make sure we don't forget anything when implementing it.
 *
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.DummyUI = function(sms) {
  this.main = sms;
  this.enable = function() {};
  this.updateStatus = function() {};
  this.writeAudio = function() {};
  this.writeFrame = function() {};
};

if (typeof $ != 'undefined') {
  /**
   * @constructor
   * @param {Object.<string, Object.<string, string>>} roms A list of rom files.
   */
  $.fn.JSSMSUI = function(roms) {
    var parent = /** HTMLElement **/ (this);
    var UI = function(sms) {
      this.main = sms;

      // Exit if ran from Opera Mini.
      if (Object.prototype.toString.call(window['operamini']) == '[object OperaMini]') {
        $(parent).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
        return;
      }

      var self = this;

      // Create UI
      var root = $('<div></div>');
      var controls = $('<div class="controls"></div>');

      // General settings
      /**
       * Contains the fullscreen API prefix or false if not supported.
       * @type {string|boolean}
       */
      var fullscreenSupport = JSSMS.Utils.getPrefix(['fullscreenEnabled', 'mozFullScreenEnabled', 'webkitCancelFullScreen']);

      var requestAnimationFramePrefix = JSSMS.Utils.getPrefix(['requestAnimationFrame', 'msRequestAnimationFrame', 'mozRequestAnimationFrame', 'webkitRequestAnimationFrame', 'oRequestAnimationFrame'], window);

      var i;

      if (requestAnimationFramePrefix) {
        this.requestAnimationFrame = window[requestAnimationFramePrefix].bind(window);
      } else {
        var lastTime = 0;
        this.requestAnimationFrame = function(callback) {
          var currTime = JSSMS.Utils.getTimestamp();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
          lastTime = currTime + timeToCall;
        };
      }

      this.zoomed = false;

      /**
       * Contains the visibility API prefix or false if not supported.
       * @type {string|boolean}
       */
      this.hiddenPrefix = JSSMS.Utils.getPrefix(['hidden', 'mozHidden', 'webkitHidden', 'msHidden']);

      // Screen
      this.screen = $('<canvas width=' + SMS_WIDTH + ' height=' + SMS_HEIGHT + ' class="screen"></canvas>');
      this.canvasContext = this.screen[0].getContext('2d');

      if (!this.canvasContext.getImageData) {
        $(parent).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
        return;
      }

      this.canvasImageData = this.canvasContext.getImageData(0, 0, SMS_WIDTH, SMS_HEIGHT);

      this.romContainer = $('<div></div>');
      this.romSelect = $('<select></select>');

      // ROM loading
      this.romSelect.change(function() {
        self.loadROM();
      });

      // Buttons
      this.buttons = Object.create(null);

      this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">');
      this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">');

      if (DEBUG) {
        this.dissambler = $('<div id="dissambler"></div>');
        $(parent).after(this.dissambler);
        this.buttons.nextStep = $('<input type="button" value="Next step" class="btn" disabled="disabled">')
          .click(function() {
              self.main.nextStep();
            });
      }

      if (this.main.soundEnabled) {
        this.buttons.sound = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">')
          .click(function() {
              if (self.main.soundEnabled) {
                self.main.soundEnabled = false;
                self.buttons.sound.attr('value', 'Enable sound');
              } else {
                self.main.soundEnabled = true;
                self.buttons.sound.attr('value', 'Disable sound');
              }
            });
      }

      this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">');

      this.buttons.start.click(function() {
        if (!self.main.isRunning) {
          self.main.start();
          self.buttons.start.attr('value', 'Pause');
        } else {
          self.main.stop();
          self.updateStatus('Paused');
          self.buttons.start.attr('value', 'Start');
        }
      });

      this.buttons.reset.click(function() {
        if (!self.main.reloadRom()) {
          $(this).attr('disabled', 'disabled');
          return;
        }
        self.main.reset();
        self.main.vdp.forceFullRedraw();
        self.main.start();
      });

      this.buttons.zoom.click(function() {
        if (self.zoomed) {
          self.screen.animate({
            width: SMS_WIDTH + 'px',
            height: SMS_HEIGHT + 'px'
          }, function() {
            $(this).removeAttr('style');
          });
          self.buttons.zoom.attr('value', 'Zoom in');
        } else {
          self.screen.animate({
            width: (SMS_WIDTH * 2) + 'px',
            height: (SMS_HEIGHT * 2) + 'px'
          });
          self.buttons.zoom.attr('value', 'Zoom out');
        }
        self.zoomed = !self.zoomed;
      });

      // @todo Add an exit fullScreen button.
      if (fullscreenSupport) {
        this.buttons.fullscreen = $('<input type="button" value="Go fullscreen" class="btn">').
            click(function() {
              var screen = /** @type {HTMLCanvasElement} */ (self.screen[0]);

              if (screen.requestFullscreen) {
                screen.requestFullscreen();
              } else if (screen.mozRequestFullScreen) {
                screen.mozRequestFullScreen();
              } else {
                screen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
              }
            });
      }

      // Append buttons to controls div.
      for (i in this.buttons) {
        this.buttons[i].appendTo(controls);
      }

      this.log = $('<div id="status"></div>');

      this.screen.appendTo(root);
      this.romContainer.appendTo(root);
      controls.appendTo(root);
      this.log.appendTo(root);
      root.appendTo($(parent));

      if (roms != undefined) {
        this.setRoms(roms);
      }

      // Keyboard
      $(document).
          bind('keydown', function(evt) {
            self.main.keyboard.keydown(evt);
            //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
          }).
          bind('keyup', function(evt) {
            self.main.keyboard.keyup(evt);
            //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
          });
    };

    UI.prototype = {
      reset: function() {
        this.screen[0].width = SMS_WIDTH;
        this.screen[0].height = SMS_HEIGHT;

        this.log.empty();

        if (DEBUG) {
          this.dissambler.empty();
        }
      },


      /**
       * Given an map of roms, build a <select> tag to allow game selection.
       *
       * @param {Object.<Array.<string>>} roms The list of roms.
       */
      setRoms: function(roms) {
        var groupName,
            optgroup,
            length,
            i,
            count = 0;

        this.romSelect.children().remove();
        $('<option>Select a ROM...</option>').appendTo(this.romSelect);

        for (groupName in roms) {
          if (roms.hasOwnProperty(groupName)) {
            optgroup = $('<optgroup></optgroup>').attr('label', groupName);
            length = roms[groupName].length;
            i = 0;
            for (; i < length; i++) {
              $('<option>' + roms[groupName][i][0] + '</option>')
                .attr('value', roms[groupName][i][1])
                .appendTo(optgroup);
            }
            optgroup.appendTo(this.romSelect);
          }
          count++;
        }
        if (count) {
          this.romSelect.appendTo(this.romContainer);
        }
      },


      loadROM: function() {
        var self = this;

        this.updateStatus('Downloading...');
        $.ajax({
          url: escape(this.romSelect.val()),
          xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.overrideMimeType != undefined) {
              // Download as binary
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            self.xhr = xhr;
            return xhr;
          },
          complete: function(xhr, status) {
            var data;

            if (status == 'error') {
              self.updateStatus('The selected rom could not be loaded.');
              return;
            }

            /*if (JSSMS.Utils.isIE()) {
              var charCodes = JSNESBinaryToArray(xhr.responseBody).toArray();
              data = String.fromCharCode.apply(undefined, charCodes);
            } else {*/
            data = xhr.responseText;
            //}

            self.main.reset();
            self.main.readRomDirectly(data, self.romSelect.val());
            self.main.vdp.forceFullRedraw();
            //self.main.start();
            self.enable();
            self.buttons.start.removeAttr('disabled');
          }
        });
      },


      /**
       * Enable and reset UI elements.
       */
      enable: function() {
        /*this.buttons.pause.removeAttr('disabled');
        if (this.main.isRunning) {
          this.buttons.pause.attr('value', 'pause');
        } else {
          this.buttons.pause.attr('value', 'resume');
        }*/
        this.buttons.reset.removeAttr('disabled');
        if (DEBUG) {
          this.buttons.nextStep.removeAttr('disabled');
        }
        if (this.buttons.sound) {
          this.buttons.sound.attr('value', 'Disable sound');
        } else {
          this.buttons.sound.attr('value', 'Enable sound');
        }
      },


      /**
       * Update the message. Used mainly for displaying frame rate.
       *
       * @param {string} s The message to display.
       */
      updateStatus: function(s) {
        this.log.text(s);
      },


      /**
       * @param {Array.<number>} buffer
       */
      writeAudio: function(buffer) {
      },


      /**
       * Update the canvas screen. ATM, prevBuffer is not used. See JSNES for
       * an implementation of differential update.
       *
       * @param {Array.<number>} buffer
       * @param {Array.<number>} prevBuffer
       */
      writeFrame: function(buffer, prevBuffer) {
        // If browser supports visibility API and this page is hidden, we exit.
        if (this.hiddenPrefix && document[this.hiddenPrefix]) {
          return;
        }

        this.canvasContext.putImageData(this.canvasImageData, 0, 0);
      },


      /**
       * A function called at each cpu instruction and display information relative to debug.
       */
      updateDisassembly: function(currentAddress) {
        var index = this.main.cpu.addressMap[currentAddress];
        var startAddress = (index - 8) < 0 ? 0 : index - 8;
        var addresses = this.main.cpu.instructions.slice(startAddress, startAddress + 16);
        var html = addresses
          .map(function(address) {
              return '<div' + (address.address == currentAddress ? ' class="current"' : '') + '>' + address.hexAddress +
                  (address.isJumpTarget ? ':' : ' ') +
                  '<code>' + address.inst + '</code></div>';
            })
          .join('');
        this.dissambler.html(html);
      }
    };

    return UI;
  };
}
