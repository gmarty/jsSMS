'use strict';

/** @const */ var NTSC = 0;
/** @const */ var PAL = 1;

/**
 * X Pixels, including blanking.
 * @const
 */
var SMS_X_PIXELS = 342;

/**
 * Y Pixels (NTSC), including blanking.
 * @const
 */
var SMS_Y_PIXELS_NTSC = 262;

/**
 * Y Pixels (PAL), including blanking.
 * @const
 */
var SMS_Y_PIXELS_PAL = 313;

/**
 * SMS visible screen width.
 * @const
 */
var SMS_WIDTH = 256;

/**
 * SMS visible screen height.
 * @const
 */
var SMS_HEIGHT = 192;

/**
 * GG visible screen width.
 * @const
 */
var GG_WIDTH = 160;

/**
 * GG visible screen height.
 * @const
 */
var GG_HEIGHT = 144;

/**
 * GG visible window starts here (x).
 * @const
 */
var GG_X_OFFSET = 48;

/**
 * GG window starts here (y).
 * @const
 */
var GG_Y_OFFSET = 24;

/** @const */ var STATUS_VINT = 0x80; // Frame Interrupt Pending
/** @const */ var STATUS_OVERFLOW = 0x40; // Sprite Overflow
/** @const */ var STATUS_COLLISION = 0x20; // Sprite Collision
/** @const */ var STATUS_HINT = 0x04; // Line interrupt Pending

/** This would be different in 224 line mode. */
/** @const */ var BGT_LENGTH = 32 * 28 * 2;

/** Max number of sprites hardware can handle per scanline. */
/** @const */ var SPRITES_PER_LINE = 8;

/** References into lineSprites table. */
/** @const */ var SPRITE_COUNT = 0; // Number of sprites on line

/** @const */ var SPRITE_X = 1; // Sprite X Position
/** @const */ var SPRITE_Y = 2; // Sprite Y Position
/** @const */ var SPRITE_N = 3; // Sprite Pattern

// Total number of tiles in VRAM
/** @const */ var TOTAL_TILES = 512;

// Tile size
/** @const */ var TILE_SIZE = 8;

/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.Vdp = function(sms) {
  this.main = sms;

  var i = 0;

  /**
   * NTSC / PAL emulation.
   * @type {number}
   */
  this.videoMode = NTSC;

  // VDP Emulation
  /**
   * Video RAM.
   * 16K of Video RAM.
   * @type {Uint8Array}
   */
  this.VRAM = new JSSMS.Utils.Uint8Array(0x4000);

  /**
   * Colour RAM.
   * Note, we don't directly emulate CRAM but actually store the converted Java palette
   * in it. Therefore the length is different to on the real Game Gear where it's actually
   * 64 bytes.
   * @type {Uint8Array}
   */
  this.CRAM = new JSSMS.Utils.Uint8Array(0x20 * 3);
  for (i = 0; i < 0x20 * 3; i++) {
    this.CRAM[i] = 0xff;
  }

  /**
   * VDP registers.
   * 15 Registers, (0-10) used by SMS, but some programs write > 10.
   * @type {Uint8Array}
   */
  this.vdpreg = new JSSMS.Utils.Uint8Array(16);

  /**
   * Status register.
   * @type {number}
   */
  this.status = 0;

  /**
   * First or second byte of command word.
   * @type {boolean}
   */
  this.firstByte = false;

  /**
   * Command word first byte latch.
   * @type {number}
   */
  this.commandByte = 0;

  /**
   * Location in VRAM.
   * @type {number}
   */
  this.location = 0;

  /**
   * Store type of operation taking place.
   * @type {number}
   */
  this.operation = 0;

  /**
   * Buffer VRAM reads.
   * @type {number}
   */
  this.readBuffer = 0;

  /**
   * Current line number to render.
   * @type {number}
   */
  this.line = 0;

  /**
   * Vertical line interrupt counter.
   * @type {number}
   */
  this.counter = 0;

  /**
   * Background priorities.
   * @type {Uint8Array}
   */
  this.bgPriority = new JSSMS.Utils.Uint8Array(SMS_WIDTH);

  /** Sprite collisions. */
  if (VDP_SPRITE_COLLISIONS) {
    /**
     * @type {Uint8Array}
     */
    this.spriteCol = new JSSMS.Utils.Uint8Array(SMS_WIDTH);
  }

  /**
   * Address of background table (32x28x2 = 0x700 bytes).
   * @type {number}
   */
  this.bgt = 0;

  /**
   * As vscroll cannot be changed during the active display period.
   * @type {number}
   */
  this.vScrollLatch = 0;

  // Emulation Related
  /**
   * Emulated display.
   * @type {Uint8ClampedArray}
   */
  this.display = /** @type {Uint8ClampedArray} */ (sms.ui.canvasImageData.data);

  /** SMS colours converted to RGB hex. */
  /** @type {Uint8Array} */ this.main_JAVA_R = new JSSMS.Utils.Uint8Array(0x40);
  /** @type {Uint8Array} */ this.main_JAVA_G = new JSSMS.Utils.Uint8Array(0x40);
  /** @type {Uint8Array} */ this.main_JAVA_B = new JSSMS.Utils.Uint8Array(0x40);

  /** GG colours converted to RGB hex. */
  /** @type {Uint8Array} */ this.GG_JAVA_R = new JSSMS.Utils.Uint8Array(0x100);
  /** @type {Uint8Array} */ this.GG_JAVA_G = new JSSMS.Utils.Uint8Array(0x100);
  /** @type {Uint8Array} */ this.GG_JAVA_B = new JSSMS.Utils.Uint8Array(0x10);

  /**
   * Horizontal viewport start.
   * @type {number}
   */
  this.h_start = 0;

  /**
   * Horizontal viewport end.
   * @type {number}
   */
  this.h_end = 0;

  // Decoded SAT Table
  /**
   * Address of sprite attribute table (256 bytes).
   * @type {number}
   */
  this.sat = 0;

  /**
   * Determine whether SAT has been written to.
   * @type {boolean}
   */
  this.isSatDirty = false;

  /**
   * Decoded SAT by each scanline.
   * @type {Array.<Uint8Array>}
   */
  this.lineSprites = new Array(SMS_HEIGHT);
  for (i = 0; i < SMS_HEIGHT; i++) {
    this.lineSprites[i] = new JSSMS.Utils.Uint8Array(1 + 3 * SPRITES_PER_LINE);
  }

  // Decoded Tiles
  /**
   * Decoded tile data.
   * @type {Array.<Uint8Array>}
   */
  this.tiles = new Array(TOTAL_TILES);

  /**
   * Store whether tile has been written to.
   * @type {Uint8Array}
   */
  this.isTileDirty = new JSSMS.Utils.Uint8Array(TOTAL_TILES);

  /** Min / Max of dirty tile index. */
  /** @type {number} */ this.minDirty = 0;
  /** @type {number} */ this.maxDirty = 0;

  this.createCachedImages();
  this.generateConvertedPals();
};

JSSMS.Vdp.prototype = {
  /**
   * Reset VDP.
   */
  reset: function() {
    var i;

    this.firstByte = true;

    this.location = 0;
    this.counter = 0;
    this.status = 0;
    this.operation = 0;
    for (i = 0; i < 16; i++) {
      this.vdpreg[i] = 0;
    }
    this.vdpreg[2] = 0x0e; // B1-B3 high on startup
    this.vdpreg[5] = 0x7e; // B1-B6 high on startup

    this.vScrollLatch = 0;

    this.main.cpu.interruptLine = false;

    this.isSatDirty = true;

    this.minDirty = TOTAL_TILES;
    this.maxDirty = -1;

    for (i = 0x0000; i < 0x4000; i++) {
      this.VRAM[i] = 0;
    }

    for (i = 0; i < SMS_WIDTH * SMS_HEIGHT * 4; i = i + 4) {
      this.display[i] = 0x00;
      this.display[i + 1] = 0x00;
      this.display[i + 2] = 0x00;
      this.display[i + 3] = 0xff; // Alpha channel
    }
  },

  /**
   * Force full redraw of entire cache.
   */
  forceFullRedraw: function() {
    this.bgt = (this.vdpreg[2] & 0x0f & ~0x01) << 10;
    this.minDirty = 0;
    this.maxDirty = TOTAL_TILES - 1;
    for (var i = 0; i < TOTAL_TILES; i++) {
      this.isTileDirty[i] = 1;
    }

    this.sat = (this.vdpreg[5] & ~0x01 & ~0x80) << 7;
    this.isSatDirty = true;
  },

  /**
   * Read Vertical Port
   *
   * @return {number} VCounter Value.
   */
  getVCount: function() {
    if (this.videoMode === NTSC) {
      if (this.line > 0xda) {
        return this.line - 0x06; // Values from 00 to DA, then jump to D5-FF
      }
    } else {
      // PAL
      if (this.line > 0xf2) {
        return this.line - 0x39;
      }
    }

    return this.line;
  },

  /**
   * Read VDP control port (0xBF).
   *
   * @return {number} Copy of status register.
   */
  controlRead: function() {
    // Reset flag
    this.firstByte = true;

    // Create copy, as we'll need to clear bits of status reg
    var statuscopy = this.status;

    // Clear b7, b6, b5 when status register read
    this.status = 0; // other bits never used anyway

    // Clear IRQ Line
    this.main.cpu.interruptLine = false;

    return statuscopy;
  },

  /**
   * Write to VDP control port (0xBF).
   *
   * @param {number} value Value to write.
   */
  controlWrite: function(value) {
    // Store First Byte of Command Word
    if (this.firstByte) {
      this.firstByte = false;
      this.commandByte = value;
      this.location = (this.location & 0x3f00) | value;
    } else {
      this.firstByte = true;
      this.operation = (value >> 6) & 3;
      this.location = this.commandByte | (value << 8);

      // Read value from VRAM
      if (this.operation === 0) {
        this.readBuffer = this.VRAM[this.location++ & 0x3fff] & 0xff;
      } else if (this.operation === 2) {
        // Set VDP Register
        var reg = value & 0x0f;

        switch (reg) {
          // Interrupt Control 0 (Verified using Charles MacDonald test program)
          // Bit 4 of register $00 acts like a on/off switch for the VDP's IRQ line.

          // As long as the line interrupt pending flag is set, the VDP will assert the
          // IRQ line if bit 4 of register $00 is set, and it will de-assert the IRQ line
          // if the same bit is cleared.
          case 0:
            if (
              ACCURATE_INTERRUPT_EMULATION &&
              (this.status & STATUS_HINT) !== 0
            ) {
              this.main.cpu.interruptLine = (this.commandByte & 0x10) !== 0;
            }
            break;

          // Interrupt Control 1
          case 1:
            if (
              (this.status & STATUS_VINT) !== 0 &&
              (this.commandByte & 0x20) !== 0
            ) {
              this.main.cpu.interruptLine = true;
            }

            // By writing here we've updated the height of the sprites and need to update
            // the sprites on each line
            if ((this.commandByte & 3) !== (this.vdpreg[reg] & 3)) {
              this.isSatDirty = true;
            }
            break;

          // BGT Written
          case 2:
            // Address of Background Table in VRAM
            this.bgt = (this.commandByte & 0x0f & ~0x01) << 10;
            break;

          // SAT Written
          case 5:
            var old = this.sat;
            // Address of Sprite Attribute Table in RAM
            this.sat = (this.commandByte & ~0x01 & ~0x80) << 7;

            if (old !== this.sat) {
              // Should also probably update tiles here?
              this.isSatDirty = true;
              //JSSMS.Utils.console.log('New address written to SAT: ' + old + ' -> ' + this.sat);
            }
            break;
        }
        this.vdpreg[reg] = this.commandByte; // Set reg to previous byte
      }
    }
  },

  /**
   * Read VDP data port (0xBE).
   *
   * @return {number} Buffered read from VRAM.
   */
  dataRead: function() {
    // 0xBE
    this.firstByte = true; // Reset flag

    var value = this.readBuffer; // Stores value to be returned
    this.readBuffer = this.VRAM[this.location++ & 0x3fff] & 0xff;

    return value;
  },

  /**
   * Write to VDP data port (0xBE).
   *
   * @param {number} value Value to Write.
   */
  dataWrite: function(value) {
    var temp = 0;

    // Reset flag
    this.firstByte = true;

    switch (this.operation) {
      // VRAM Write
      case 0x00:
      case 0x01:
      case 0x02:
        var address = this.location & 0x3fff;
        // Check VRAM value has actually changed
        if (value !== (this.VRAM[address] & 0xff)) {
          //if (address >= bgt && address < bgt + BGT_LENGTH); // Don't write dirty to BGT
          if (
            (address >= this.sat && address < this.sat + 64) ||
            (address >= this.sat + 128 && address < this.sat + 256)
          ) {
            // Don't write dirty to SAT
            this.isSatDirty = true;
          } else {
            var tileIndex = address >> 5;

            // Get tile number that's being written to (divide VRAM location by 32).
            this.isTileDirty[tileIndex] = 1;
            if (tileIndex < this.minDirty) {
              this.minDirty = tileIndex;
            }
            if (tileIndex > this.maxDirty) {
              this.maxDirty = tileIndex;
            }
          }

          this.VRAM[address] = value;
        }
        break;
      // CRAM Write
      // Instead of writing real colour to CRAM, write converted Java palette colours for speed.
      // Slightly inaccurate, as CRAM doesn't contain real values, but it is never read by software.
      case 0x03:
        if (this.main.is_sms) {
          temp = (this.location & 0x1f) * 3;
          this.CRAM[temp] = this.main_JAVA_R[value];
          this.CRAM[temp + 1] = this.main_JAVA_G[value];
          this.CRAM[temp + 2] = this.main_JAVA_B[value];
        } else {
          temp = ((this.location & 0x3f) >> 1) * 3;
          if (!(this.location & 0x01)) {
            // first byte
            this.CRAM[temp] = this.GG_JAVA_R[value];
            this.CRAM[temp + 1] = this.GG_JAVA_G[value];
          } else {
            this.CRAM[temp + 2] = this.GG_JAVA_B[value];
          }
        }
        break;
    }

    if (ACCURATE) {
      this.readBuffer = value;
    }

    this.location++;
  },

  /**
   * Generate VDP Interrupts.
   * Assert the IRQ line as necessary for a particular scanline.
   *
   * @param {number} lineno  Line to check for interrupts.
   *
   * @see http://www.smspower.org/forums/viewtopic.php?t=9366&highlight=chicago
   */
  interrupts: function(lineno) {
    if (lineno <= 192) {
      // This can cause hangs as interrupts are only taken between instructions,
      // if the IRQ status flag is set *during* the execution of an instruction the
      // CPU will be able to read it without the interrupt occurring.
      //
      // e.g. Chicago Syndicate on GG

      if (!ACCURATE_INTERRUPT_EMULATION && lineno === 192) {
        this.status |= STATUS_VINT;
      }

      // Counter Expired = Line Interrupt Pending
      if (this.counter === 0) {
        // Reload Counter
        this.counter = this.vdpreg[10];
        this.status |= STATUS_HINT;
      } else {
        // Otherwise Decrement Counter
        this.counter--;
      }

      // Line Interrupts Enabled and Pending. Assert IRQ Line.
      if ((this.status & STATUS_HINT) !== 0 && (this.vdpreg[0] & 0x10) !== 0) {
        this.main.cpu.interruptLine = true;
      }
    } else {
      // lineno >= 193
      // Reload counter on every line outside active display + 1
      this.counter = this.vdpreg[10];

      // Frame Interrupts Enabled and Pending. Assert IRQ Line.
      if (
        (this.status & STATUS_VINT) !== 0 &&
        (this.vdpreg[1] & 0x20) !== 0 &&
        lineno < 224
      ) {
        this.main.cpu.interruptLine = true;
      }

      // Update the VSCROLL latch for the next active display period
      if (ACCURATE && lineno === this.main.no_of_scanlines - 1) {
        this.vScrollLatch = this.vdpreg[9];
      }
    }
  },

  setVBlankFlag: function() {
    this.status |= STATUS_VINT;
  },

  /**
   * Render Line of SMS/GG Display.
   *
   * @param {number} lineno Line Number to Render.
   */
  drawLine: function(lineno) {
    var x = 0;
    var location = 0;
    var colour = 0;

    // Check we are in the visible drawing region
    if (
      this.main.is_gg &&
      (lineno < GG_Y_OFFSET || lineno >= GG_Y_OFFSET + GG_HEIGHT)
    ) {
      return;
    }

    // Clear sprite collision array if enabled
    if (VDP_SPRITE_COLLISIONS) {
      for (x = 0; x < SMS_WIDTH /* this.spriteCol.length */; x++) {
        this.spriteCol[x] = false;
      }
    }

    // Check Screen is switched on
    if ((this.vdpreg[1] & 0x40) !== 0) {
      // Draw Background Layer
      if (this.maxDirty !== -1) {
        this.decodeTiles();
      }

      this.drawBg(lineno);

      // Draw Sprite Layer
      if (this.isSatDirty) {
        this.decodeSat();
      }

      if (this.lineSprites[lineno][SPRITE_COUNT] !== 0) {
        this.drawSprite(lineno);
      }

      // Blank Leftmost Column (SMS Only)
      if (this.main.is_sms && this.vdpreg[0] & 0x20) {
        location = (lineno << 8) * 4;
        colour = ((this.vdpreg[7] & 0x0f) + 16) * 3;

        for (x = location; x < location + 8 * 4; x = x + 4) {
          this.display[x] = this.CRAM[colour];
          this.display[x + 1] = this.CRAM[colour + 1];
          this.display[x + 2] = this.CRAM[colour + 2];
        }
      }
    } else {
      // Blank Display
      this.drawBGColour(lineno);
    }
  },

  /**
   * @param {number} lineno
   */
  drawBg: function(lineno) {
    var pixX = 0;
    var colour = 0;
    var temp = 0;
    var temp2 = 0;

    // Horizontal Scroll
    var hscroll = this.vdpreg[8];

    // Vertical Scroll
    var vscroll = ACCURATE ? this.vScrollLatch : this.vdpreg[9];

    // Top Two Rows Not Affected by Horizontal Scrolling (SMS Only)
    // We don't actually need the SMS check here as we don't draw this line for GG now
    if (lineno < 16 && (this.vdpreg[0] & 0x40) !== 0 /*&& this.main.is_sms*/) {
      hscroll = 0;
    }

    // Lock Right eight columns
    var lock = this.vdpreg[0] & 0x80;

    // Column to start drawing at (0 - 31) [Add extra columns for GG]
    var tile_column = 32 - (hscroll >> 3) + this.h_start;

    // Row to start drawing at (0 - 27)
    var tile_row = (lineno + vscroll) >> 3;

    if (tile_row > 27) {
      tile_row -= 28;
    }

    // Actual y position in tile (0 - 7) (Also times by 8 here for quick access to pixel)
    var tile_y = ((lineno + (vscroll & 7)) & 7) << 3;

    // Array Position
    var row_precal = lineno << 8;

    // Cycle through background table
    for (var tx = this.h_start; tx < this.h_end; tx++) {
      var tile_props = this.bgt + ((tile_column & 0x1f) << 1) + (tile_row << 6);
      var secondbyte = this.VRAM[tile_props + 1];

      // Select Palette (Either 0 or 16)
      var pal = (secondbyte & 0x08) << 1;

      // Screen X Position
      var sx = (tx << 3) + (hscroll & 7);

      // Do V-Flip (take into account the fact that everything is times 8)
      var pixY = (secondbyte & 0x04) === 0 ? tile_y : (7 << 3) - tile_y;

      // Pattern Number (0 - 512)
      var tile = this.tiles[
        (this.VRAM[tile_props] & 0xff) + ((secondbyte & 0x01) << 8)
      ];

      // Plot 8 Pixel Row (No H-Flip)
      if (!(secondbyte & 0x02)) {
        for (pixX = 0; pixX < 8 && sx < SMS_WIDTH; pixX++, sx++) {
          colour = tile[pixX + pixY];
          temp = (sx + row_precal) * 4;
          temp2 = (colour + pal) * 3;

          // Set Priority Array (Sprites over/under background tile)
          this.bgPriority[sx] = (secondbyte & 0x10) !== 0 && colour !== 0;
          if (sx >= this.h_start * 8 && sx < this.h_end * 8) {
            this.display[temp] = this.CRAM[temp2];
            this.display[temp + 1] = this.CRAM[temp2 + 1];
            this.display[temp + 2] = this.CRAM[temp2 + 2];
          }
        }
      } else {
        // Plot 8 Pixel Row (H-Flip)
        for (pixX = 7; pixX >= 0 && sx < SMS_WIDTH; pixX--, sx++) {
          colour = tile[pixX + pixY];
          temp = (sx + row_precal) * 4;
          temp2 = (colour + pal) * 3;

          // Set Priority Array (Sprites over/under background tile)
          this.bgPriority[sx] = (secondbyte & 0x10) !== 0 && colour !== 0;
          if (sx >= this.h_start * 8 && sx < this.h_end * 8) {
            this.display[temp] = this.CRAM[temp2];
            this.display[temp + 1] = this.CRAM[temp2 + 1];
            this.display[temp + 2] = this.CRAM[temp2 + 2];
          }
        }
      }
      tile_column++;

      // Rightmost 8 columns Not Affected by Vertical Scrolling
      if (lock !== 0 && tx === 23) {
        tile_row = lineno >> 3;
        tile_y = (lineno & 7) << 3;
      }
    }
  },

  /**
   * Render Line of Sprite Layer.
   * - Notes: Sprites do not wrap on the x-axis.
   *
   * @param {number} lineno Line Number to Render.
   */
  drawSprite: function(lineno) {
    var colour = 0;
    var temp = 0;
    var temp2 = 0;
    var i = 0;

    // Reference to the sprites that should appear on this line
    var sprites = this.lineSprites[lineno];

    // Number of sprites to draw on this scanline
    var count = Math.min(SPRITES_PER_LINE, sprites[SPRITE_COUNT]);

    // Zoom Sprites (0 = off, 1 = on)
    var zoomed = this.vdpreg[1] & 0x01;

    var row_precal = lineno << 8;

    // Get offset into array
    var off = count * 3;

    // Have to iterate backwards here as we've already cached tiles
    for (; i < count; i++) {
      // Sprite Pattern Index
      // Also mask on Pattern Index from 100 - 1FFh (if reg 6 bit 3 set)
      var n = sprites[off--] | ((this.vdpreg[6] & 0x04) << 6);

      // Sprite Y Position
      var y = sprites[off--];

      // Sprite X Position
      // Shift pixels left by 8 if necessary
      var x = sprites[off--] - (this.vdpreg[0] & 0x08);

      // Row of tile data to render (0-7)
      var tileRow = (lineno - y) >> zoomed;

      // When using 8x16 sprites LSB has no effect
      if ((this.vdpreg[1] & 0x02) !== 0) {
        n &= ~0x01;
      }

      // Pattern Number (0 - 512)
      var tile = this.tiles[n + ((tileRow & 0x08) >> 3)];

      // If X Co-ordinate is negative, do a fix to draw from position 0
      var pix = 0;

      if (x < 0) {
        pix = -x;
        x = 0;
      }

      // Offset into decoded tile data
      var offset = pix + ((tileRow & 7) << 3);

      // Plot Normal Sprites (Width = 8)
      if (!zoomed) {
        for (; pix < 8 && x < this.h_end * 8; pix++, x++) {
          colour = tile[offset++];

          if (x >= this.h_start * 8 && colour !== 0 && !this.bgPriority[x]) {
            temp = (x + row_precal) * 4;
            temp2 = (colour + 16) * 3;

            this.display[temp] = this.CRAM[temp2];
            this.display[temp + 1] = this.CRAM[temp2 + 1];
            this.display[temp + 2] = this.CRAM[temp2 + 2];

            // Emulate sprite collision (when two opaque pixels overlap)
            if (VDP_SPRITE_COLLISIONS) {
              if (!this.spriteCol[x]) {
                this.spriteCol[x] = true;
              } else {
                this.status |= STATUS_COLLISION; // Bit 5 of status flag indicates collision
              }
            }
          }
        }
      } else {
        // Plot Zoomed Sprites (Width = 16)
        for (; pix < 8 && x < this.h_end * 8; pix++, x += 2) {
          colour = tile[offset++];

          // Plot first pixel
          if (x >= this.h_start * 8 && colour !== 0 && !this.bgPriority[x]) {
            temp = (x + row_precal) * 4;
            temp2 = (colour + 16) * 3;

            this.display[temp] = this.CRAM[temp2];
            this.display[temp + 1] = this.CRAM[temp2 + 1];
            this.display[temp + 2] = this.CRAM[temp2 + 2];

            if (VDP_SPRITE_COLLISIONS) {
              if (!this.spriteCol[x]) {
                this.spriteCol[x] = true;
              } else {
                this.status |= STATUS_COLLISION; // Bit 5 of status flag indicates collision
              }
            }
          }

          // Plot second pixel
          if (
            x + 1 >= this.h_start * 8 &&
            colour !== 0 &&
            !this.bgPriority[x + 1]
          ) {
            temp = (x + row_precal + 1) * 4;
            temp2 = (colour + 16) * 3;

            this.display[temp] = this.CRAM[temp2];
            this.display[temp + 1] = this.CRAM[temp2 + 1];
            this.display[temp + 2] = this.CRAM[temp2 + 2];

            if (VDP_SPRITE_COLLISIONS) {
              if (!this.spriteCol[x + 1]) {
                this.spriteCol[x + 1] = true;
              } else {
                this.status |= STATUS_COLLISION; // Bit 5 of status flag indicates collision
              }
            }
          }
        }
      }
    }

    // Sprite Overflow (more than 8 sprites on line)
    if (sprites[SPRITE_COUNT] >= SPRITES_PER_LINE) {
      this.status |= STATUS_OVERFLOW;
    }
  },

  /**
   * Draw a line of the current background colour.
   *
   * @param {number} lineno Line number to render.
   */
  drawBGColour: function(lineno) {
    var x = 0;
    var location = (lineno << 8) * 4;
    var colour = ((this.vdpreg[7] & 0x0f) + 16) * 3;

    for (
      x = location + this.h_start * 8 * 4;
      x < location + this.h_end * 8 * 4;
      x = x + 4
    ) {
      this.display[x] = this.CRAM[colour];
      this.display[x + 1] = this.CRAM[colour + 1];
      this.display[x + 2] = this.CRAM[colour + 2];
    }
  },

  // Note we should try not to update the bgt/sat locations?
  decodeTiles: function() {
    //JSSMS.Utils.console.log('[' + this.line + ']' + ' min dirty:' + this.minDirty + ' max: ' + this.maxDirty);

    for (var i = this.minDirty; i <= this.maxDirty; i++) {
      // Only decode tiles that have changed since the last iteration
      if (!this.isTileDirty[i]) {
        continue;
      }

      // Note that we've updated the tile
      this.isTileDirty[i] = 0;

      //JSSMS.Utils.console.log('tile ' + i + ' is dirty');
      var tile = this.tiles[i];

      var pixel_index = 0;

      // 4 bytes per row, total of 32 bytes per tile
      var address = i << 5;

      // Plot column of 8 pixels
      for (var y = 0; y < TILE_SIZE; y++) {
        var address0 = this.VRAM[address++];
        var address1 = this.VRAM[address++];
        var address2 = this.VRAM[address++];
        var address3 = this.VRAM[address++];

        // Plot row of 8 pixels
        for (var bit = 0x80; bit !== 0; bit >>= 1) {
          var colour = 0;

          // Set Colour of Pixel (0-15)
          if ((address0 & bit) !== 0) {
            colour |= 0x01;
          }
          if ((address1 & bit) !== 0) {
            colour |= 0x02;
          }
          if ((address2 & bit) !== 0) {
            colour |= 0x04;
          }
          if ((address3 & bit) !== 0) {
            colour |= 0x08;
          }

          tile[pixel_index++] = colour;
        }
      }
    }

    // Reset min/max dirty counters
    this.minDirty = TOTAL_TILES;
    this.maxDirty = -1;
  },

  //  DECODE SAT TABLE
  //
  //   Each sprite is defined in the sprite attribute table (SAT), a 256-byte
  //   table located in VRAM. The SAT has the following layout:
  //
  //      00: yyyyyyyyyyyyyyyy
  //      10: yyyyyyyyyyyyyyyy
  //      20: yyyyyyyyyyyyyyyy
  //      30: yyyyyyyyyyyyyyyy
  //      40: ????????????????
  //      50: ????????????????
  //      60: ????????????????
  //      70: ????????????????
  //      80: xnxnxnxnxnxnxnxn
  //      90: xnxnxnxnxnxnxnxn
  //      A0: xnxnxnxnxnxnxnxn
  //      B0: xnxnxnxnxnxnxnxn
  //      C0: xnxnxnxnxnxnxnxn
  //      D0: xnxnxnxnxnxnxnxn
  //      E0: xnxnxnxnxnxnxnxn
  //      F0: xnxnxnxnxnxnxnxn
  //
  //   y = Y coordinate + 1
  //   x = X coordinate
  //   n = Pattern index
  //   ? = Unused
  /**
   * Creates a list of sprites per scanline.
   */
  decodeSat: function() {
    this.isSatDirty = false;

    // Clear Existing Table
    for (var i = 0; i < this.lineSprites.length; i++) {
      this.lineSprites[i][SPRITE_COUNT] = 0;
    }

    // Height of Sprites (8x8 or 8x16)
    var height = (this.vdpreg[1] & 0x02) === 0 ? 8 : 16;

    // Enable Zoomed Sprites
    if ((this.vdpreg[1] & 0x01) === 0x01) {
      height <<= 1;
    }

    // Search Sprite Attribute Table (64 Bytes)
    for (var spriteno = 0; spriteno < 0x40; spriteno++) {
      // Sprite Y Position
      var y = this.VRAM[this.sat + spriteno] & 0xff;

      // VDP stops drawing if y === 208
      if (y === 208) {
        return;
      }

      // y is actually at +1 of value
      y++;

      // If off screen, draw from negative 16 onwards
      if (y > 240) {
        y -= 256;
      }

      for (var lineno = y; lineno < SMS_HEIGHT; lineno++) {
        // Does Sprite fall on this line?
        if (lineno - y < height) {
          var sprites = this.lineSprites[lineno];

          if (!sprites || sprites[SPRITE_COUNT] >= SPRITES_PER_LINE) {
            break;
          }

          // Get offset into array
          var off = sprites[SPRITE_COUNT] * 3 + SPRITE_X;

          // Address of Sprite in Sprite Attribute Table
          var address = this.sat + (spriteno << 1) + 0x80;

          // Sprite X Position
          sprites[off++] = this.VRAM[address++] & 0xff;

          // Sprite Y Position
          sprites[off++] = y;

          // Sprite Pattern Index
          sprites[off++] = this.VRAM[address] & 0xff;

          // Increment number of sprites on this scanline
          sprites[SPRITE_COUNT]++;
        }
      }
    }
  },

  // Decode all background tiles
  //
  // Tiles are 8x8
  //
  // Background table is a 32x28 matrix of words stored in VRAM
  //
  //  MSB          LSB
  //  ---pcvhnnnnnnnnn
  //
  // p = priority
  // c = palette
  // v = vertical flip
  // h = horizontal flip
  // n = pattern index (0 - 512)
  createCachedImages: function() {
    //this.tiles = new JSSMS.Utils.Uint8Array(TOTAL_TILES);
    for (var i = 0; i < TOTAL_TILES; i++) {
      this.tiles[i] = new JSSMS.Utils.Uint8Array(TILE_SIZE * TILE_SIZE);
    }
    //this.isTileDirty = new JSSMS.Utils.Uint8Array(TOTAL_TILES);
  },

  // Generated pre-converted palettes.
  //
  // SMS and GG colours are converted to Java RGB for speed purposes.
  //
  // Java: 0xAARRGGBB (4 bytes) Java colour
  //
  // SMS : 00BBGGRR   (1 byte)
  // GG  : GGGGRRRR   (1st byte)
  //       0000BBBB   (2nd byte)
  generateConvertedPals: function() {
    var i;
    var r, g, b;

    // Convert SMS palette.
    for (i = 0; i < 0x40; i++) {
      r = i & 0x03;
      g = (i >> 2) & 0x03;
      b = (i >> 4) & 0x03;

      this.main_JAVA_R[i] = (r * 85) & 0xff;
      this.main_JAVA_G[i] = (g * 85) & 0xff;
      this.main_JAVA_B[i] = (b * 85) & 0xff;
    }

    // Convert GG palette.
    // Red & Green
    for (i = 0; i < 0x100; i++) {
      g = i & 0x0f;
      b = (i >> 4) & 0x0f;

      // Shift and fill with the original bitpattern
      // so %1111 becomes %11111111, %1010 becomes %10101010
      this.GG_JAVA_R[i] = ((g << 4) | g) & 0xff;
      this.GG_JAVA_G[i] = ((b << 4) | b) & 0xff;
    }
    // Blue
    for (i = 0; i < 0x10; i++) {
      this.GG_JAVA_B[i] = ((i << 4) | i) & 0xff;
    }
  },

  // VDP State Saving
  /**
   * @return {Array.<number>}
   */
  getState: function() {
    var state = new Array(
      3 + 16 /*this.vdpreg.length*/ + 0x20 /*this.CRAM.length*/
    );

    state[0] =
      this.videoMode |
      (this.status << 8) |
      (this.firstByte ? 1 << 16 : 0) |
      (this.commandByte << 24);
    state[1] = this.location | (this.operation << 16) | (this.readBuffer << 24);
    state[2] = this.counter | (this.vScrollLatch << 8) | (this.line << 16);

    JSSMS.Utils.copyArrayElements(
      this.vdpreg,
      0,
      state,
      3,
      16 /*this.vdpreg.length*/
    );
    JSSMS.Utils.copyArrayElements(
      this.CRAM,
      0,
      state,
      3 + 16 /*this.vdpreg.length*/,
      0x20 * 3 /*this.CRAM.length*/
    );

    return state;
  },

  /**
   * @param {Array.<number>} state
   */
  setState: function(state) {
    var temp = state[0];
    this.videoMode = temp & 0xff;
    this.status = (temp >> 8) & 0xff;
    this.firstByte = ((temp >> 16) & 0xff) !== 0;
    this.commandByte = (temp >> 24) & 0xff;

    temp = state[1];
    this.location = temp & 0xffff;
    this.operation = (temp >> 16) & 0xff;
    this.readBuffer = (temp >> 24) & 0xff;

    temp = state[2];
    this.counter = temp & 0xff;
    this.vScrollLatch = (temp >> 8) & 0xff;
    this.line = (temp >> 16) & 0xffff;

    JSSMS.Utils.copyArrayElements(
      state,
      3,
      this.vdpreg,
      0,
      16 /*this.vdpreg.length*/
    );
    JSSMS.Utils.copyArrayElements(
      state,
      3 + 16 /*this.vdpreg.length*/,
      this.CRAM,
      0,
      0x20 * 3 /*this.CRAM.length*/
    );

    // Force redraw of all cached tile data
    this.forceFullRedraw();
  },
};
