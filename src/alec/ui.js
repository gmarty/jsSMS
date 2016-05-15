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
  this.enable = function() {
  };
  this.updateStatus = function() {
  };
  this.writeAudio = function() {
  };
  this.writeFrame = function() {
  };
};

if (window['$']) {
  /**
   * @constructor
   * @param {Object.<string, Object.<string, string>>} roms A list of ROM files.
   */
  $.fn['JSSMSUI'] = function(roms) {
    var parent = /** HTMLElement **/ (this);
    var UI = function(sms) {
      this.main = sms;

      var self = this;

      // Create UI
      var screenContainer = $('<div id="screen"></div>');
      var gamepadContainer = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>');

      // General settings
      /**
       * Contains the fullscreen API prefix or false if not supported.
       * @type {string|boolean}
       */
      //var fullscreenSupport = JSSMS.Utils.getPrefix(['fullscreenEnabled', 'mozFullScreenEnabled']);

      var requestAnimationFramePrefix = JSSMS.Utils.getPrefix(['requestAnimationFrame', 'msRequestAnimationFrame', 'mozRequestAnimationFrame', 'webkitRequestAnimationFrame'], window);

      var i;

      this.requestAnimationFrame = window[requestAnimationFramePrefix].bind(window);

      // Screen
      this.screen = $('<canvas width=' + SMS_WIDTH + ' height=' + SMS_HEIGHT + ' moz-opaque></canvas>');
      this.canvasContext = this.screen[0].getContext('2d', {
        'alpha': false // See http://wiki.whatwg.org/wiki/CanvasOpaque
      });

      // Nearest-neighbour rendering for scaling pixel-art.
      this.canvasContext['webkitImageSmoothingEnabled'] = false;
      this.canvasContext['mozImageSmoothingEnabled'] = false;
      this.canvasContext['imageSmoothingEnabled'] = false;

      this.canvasImageData = this.canvasContext.getImageData(0, 0, SMS_WIDTH, SMS_HEIGHT);

      // Gamepad
      this.gamepad = {
        up: P1_KEY_UP,
        right: P1_KEY_RIGHT,
        down: P1_KEY_DOWN,
        left: P1_KEY_LEFT,
        fire1: P1_KEY_FIRE1,
        fire2: P1_KEY_FIRE2
      };
      var startButton = $('.start', gamepadContainer);

      // Play button
      $('#play').click(function(evt) {
        if (!self.main.romFileName) {
          evt.preventDefault();
          return;
        }

        if (!self.main.isRunning) {
          self.main.start();
          $('#play span')
            .removeClass('icon-play')
            .addClass('icon-pause');
        } else {
          self.main.stop();
          self.updateStatus('Paused');
          $('#play span')
            .removeClass('icon-pause')
            .addClass('icon-play');
        }
      });

      // ROM loader
      var romFilename = '';
      var romReader = new FileReader();

      romReader.onload = function(evt) {
        var data = evt.target.result;
        self.loadROMFile(data, romFilename);
      };

      $('#romUpload').change(function() {
        if (document.getElementById('romUpload').files.length === 0) {
          return;
        }
        var oFile = document.getElementById('romUpload').files[0];
        romFilename = oFile.name;
        romReader.readAsBinaryString(oFile);
      });

      // ROM selector
      this.romSelect = $('#romSelector')
        .change(function() {
          self.loadROM();
        });

      // Buttons
      /*this.buttons.start = $('<button class="btn btn-primary" disabled="disabled">Start</button>')
       .click(function() {
       if (!self.main.isRunning) {
       self.main.start();
       self.buttons.start.attr('value', 'Pause');
       } else {
       self.main.stop();
       self.updateStatus('Paused');
       self.buttons.start.attr('value', 'Start');
       }
       });*/

      /*this.buttons.reset = $('<button class="btn" disabled="disabled">Reset</button>')
       .click(function() {
       if (!self.main.reloadRom()) {
       $(this).attr('disabled', 'disabled');
       return;
       }
       self.main.reset();
       self.main.vdp.forceFullRedraw();
       self.main.start();
       });*/

      /*if (this.main.soundEnabled) {
       this.buttons.sound = $('<button class="btn" disabled="disabled">Enable sound</button>')
       .click(function() {
       if (self.main.soundEnabled) {
       self.main.soundEnabled = false;
       self.buttons.sound.attr('value', 'Enable sound');
       } else {
       self.main.soundEnabled = true;
       self.buttons.sound.attr('value', 'Disable sound');
       }
       });
       }*/

      // @todo Add an exit fullScreen button.
      $('#fullscreen')
        .click(function() {
          var screen = /** @type {HTMLDivElement} */ (screenContainer[0]);

          if (screen.requestFullscreen) {
            screen.requestFullscreen();
          } else {
            screen.mozRequestFullScreen();
          }
        });

      // Software buttons - touch
      gamepadContainer.on('touchstart touchmove', function(evt) {
        evt.preventDefault();

        self.main.keyboard.controller1 = 0xFF;

        var touches = evt.originalEvent.touches;

        for (var i = 0; i < touches.length; i++) {
          var target = document.elementFromPoint(touches[i].clientX, touches[i].clientY);

          if (!target) {
            continue;
          }

          var className = target.className;

          if (!className || !self.gamepad[className]) {
            continue;
          }

          var key = self.gamepad[className];
          self.main.keyboard.controller1 &= ~key;
        }
      });

      gamepadContainer.on('touchend', function(evt) {
        evt.preventDefault();

        if (evt.originalEvent.touches.length === 0) {
          self.main.keyboard.controller1 = 0xFF;
        }
      });

      // Software buttons - click
      function mouseDown(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 &= ~key;
        evt.preventDefault();
      }

      function mouseUp(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 |= key;
        evt.preventDefault();
      }

      for (i in this.gamepad) {
        $('.' + i, gamepadContainer)
          .mousedown(mouseDown)
          .mouseup(mouseUp);
      }

      startButton
        .on('mousedown touchstart', function(evt) {
          if (self.main.is_sms) {
            self.main.pause_button = true;       // Pause
          } else {
            self.main.keyboard.ggstart &= ~0x80; // Start
          }
          evt.preventDefault();
        })
        .on('mouseup touchend', function(evt) {
          if (!self.main.is_sms) {
            self.main.keyboard.ggstart |= 0x80;  // Start
          }
          evt.preventDefault();
        });

      // Keyboard
      $(document)
        .bind('keydown', function(evt) {
          self.main.keyboard.keydown(evt);
          //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
        })
        .bind('keyup', function(evt) {
          self.main.keyboard.keyup(evt);
          //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
        });

      this.screen.appendTo(screenContainer);
      gamepadContainer.appendTo(screenContainer);
      screenContainer.appendTo($(parent));

      if (roms !== undefined) {
        this.setRoms(roms);
      }
    };

    UI.prototype = {
      reset: function() {
        this.screen[0].width = SMS_WIDTH;
        this.screen[0].height = SMS_HEIGHT;
      },


      /**
       * Given an map of ROMs, build a <select> tag to allow game selection.
       *
       * @param {Object.<Array.<string>>} roms The list of ROMs.
       */
      setRoms: function(roms) {
        var groupName,
            optgroup,
            length,
            i,
            count = 0;

        this.romSelect.children().remove();
        $('<option></option>').appendTo(this.romSelect);

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
      },


      loadROM: function() {
        var self = this;

        this.updateStatus('Downloading...');
        $.ajax({
          url: encodeURI(this.romSelect.val()),
          xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.overrideMimeType !== undefined) {
              // Download as binary
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            self.xhr = xhr;
            return xhr;
          },
          complete: function(xhr, status) {
            var data;

            if (status === 'error') {
              alert('The selected ROM file could not be loaded.');
              return;
            }

            /*if (JSSMS.Utils.isIE()) {
             var charCodes = JSNESBinaryToArray(xhr.responseBody).toArray();
             data = String.fromCharCode.apply(undefined, charCodes);
             } else {*/
            data = xhr.responseText;
            //}

            self.loadROMFile(data, self.romSelect.val());
          }
        });
      },


      loadROMFile: function(data, filename) {
        this.main.stop();
        this.main.readRomDirectly(data, filename);
        this.main.reset();
        this.main.vdp.forceFullRedraw();
        this.enable();

        $('#play').removeClass('disabled');
        $('#fullscreen').removeClass('disabled');
      },


      /**
       * Enable and reset UI elements.
       */
      enable: function() {
        /*this.buttons.start.removeAttr('disabled');
         this.buttons.start.attr('value', 'Start');
         this.buttons.reset.removeAttr('disabled');
         if (this.main.soundEnabled) {
         if (this.buttons.sound) {
         this.buttons.sound.attr('value', 'Disable sound');
         } else {
         this.buttons.sound.attr('value', 'Enable sound');
         }
         }*/
      },


      /**
       * Update the message. Used mainly for displaying frame rate.
       */
      updateStatus: function() {
      },


      /**
       * @param {Array.<number>} buffer
       */
      writeAudio: function(buffer) {
        var source = this.main.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.main.audioContext.destination);
        source.start();
      },


      /**
       * Update the canvas screen. ATM, prevBuffer is not used. See JSNES for
       * an implementation of differential update.
       */
      writeFrame: function() {
        /**
         * Contains the visibility API prefix or false if not supported.
         * @type {string|boolean}
         */
        var hiddenPrefix = JSSMS.Utils.getPrefix(['hidden', 'mozHidden', 'webkitHidden', 'msHidden']);

        if (hiddenPrefix) {
          // If browser supports visibility API and this page is hidden, we exit.
          return function() {
            if (document[hiddenPrefix]) {
              return;
            }

            this.canvasContext.putImageData(this.canvasImageData, 0, 0);
          };
        } else {
          return function() {
            this.canvasContext.putImageData(this.canvasImageData, 0, 0);
          };
        }
      }(),


      /**
       * A function called at each cpu instruction and display information relative to debug.
       * \@todo If currentAddress is not in this.main.cpu.instructions, then start parsing from it.
       */
      updateDisassembly: function(currentAddress) {
        var startAddress = currentAddress < 8 ? 0 : currentAddress - 8;
        var instructions = this.main.cpu.instructions;
        var length = instructions.length;
        var html = '';
        var i = startAddress;
        var num = 0;

        for (; num < 16 && i <= length; i++) {
          if (instructions[i]) {
            html += '<div' + (instructions[i].address === currentAddress ? ' class="current"' : '') + '>' + instructions[i].hexAddress +
              (instructions[i].isJumpTarget ? ':' : ' ') +
              '<code>' + instructions[i].inst + '</code></div>';

            num++;
          }
        }

        this.dissambler.html(html);
      }
    };

    return UI;
  };
}
