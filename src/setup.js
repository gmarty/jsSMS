'use strict';

// Constants
/**
 * Whether to enable debug code globally. Set to false at build time.
 */
var DEBUG = false;

/**
 * Whether to activate debugger.
 * @define {boolean}
 */
var ENABLE_DEBUGGER = false;

/**
 * Whether to enable compiler.
 */
var ENABLE_COMPILER = true;

/** @const */ var WRITE_MODE = 0;
/** @const */ var READ_MODE = 1;

/**
 * Whether to enable server logging of various data used for debugging purposes.
 * This setting requires the server to be launched doing:
 * `node bin/sync-server.js`
 * Then, because of same domain policy, the emulator should be accessed from:
 * `http://127.0.0.1:8124/`
 * @define {boolean}
 */
var ENABLE_SERVER_LOGGER = false;

/**
 * @const
 */
var SYNC_MODE = READ_MODE;

/**
 * @type {boolean}
 */
var ACCURATE = false;

/**
 * Whether the system uses little endian or big endian.
 * @const
 */
var LITTLE_ENDIAN = true;

/**
 * Force the use of typed arrays.
 * @define {boolean}
 */
var FORCE_TYPED_ARRAYS = false;

/**
 * Does browser support typed arrays?
 * @const
 */
var SUPPORT_TYPED_ARRAYS = FORCE_TYPED_ARRAYS || 'Uint8Array' in window;

/**
 * Force ArrayBuffer and DataView use.
 * @define {boolean}
 */
var FORCE_DATAVIEW = false;

/**
 * Does browser support ArrayBuffer and DataView?
 * @const
 */
var SUPPORT_DATAVIEW =
  FORCE_DATAVIEW || ('ArrayBuffer' in window && 'DataView' in window);

/**
 * Force use of destructuring assignments.
 * @define {boolean}
 */
var FORCE_DESTRUCTURING = false;

/**
 * Does browser support destructuring assignments? Used in `EX ...` opcodes.
 * @const
 */
var SUPPORT_DESTRUCTURING = false; /*FORCE_DESTRUCTURING || function() {
  try {
    eval('var [a]=[1]');
    return true;
  } catch (e) {
    return false;
  }
}()*/

// Sound Output
/**
 * Sample Rate
 * @const
 */
var SAMPLE_RATE = 44100; //8000

/**
 * Print timing information on screen.
 * @type {boolean}
 */
var DEBUG_TIMING = DEBUG;

// CPU Settings
/**
 * Refresh register emulation (not required by any games?).
 * @type {boolean}
 */
var REFRESH_EMULATION = false;

/*
 * Games requiring accurate interrupt emulation:
 *  - Earthworm Jim (GG)
 */
/**
 * Do accurate interrupt emulation? (slower!).
 * Must be set to true when building jssms.node.min.js.
 * @define {boolean}
 */
var ACCURATE_INTERRUPT_EMULATION = false;

/*
 * Lightgun Mode (For the following titles):
 *  - Assault City
 *  - Gangster Town
 *  - Laser Ghost
 *  - Marksman Shooting / Trap Shooting / Safari Hunt
 *  - Missile Defense 3D
 *  - Operation Wolf
 *  - Rambo III
 *  - Rescue Mission
 *  - Shooting Gallery
 *  - Space Gun
 *  - Wanted
 */
/**
 * @type {boolean}
 */
var LIGHTGUN = /*ACCURATE*/ false;

// VDP Settings
/*
 * Games requiring sprite collision:
 *  - Cheese Cat'astrophe (SMS)
 *  - Ecco the Dolphin (SMS, GG)
 *  - Fantastic Dizzy (SMS, GG)
 *  - Fantazy Zone Gear (GG)
 *  - Impossible Mission (SMS)
 *  - Taz-Mania (SMS, GG)
 */
/**
 * Emulate hardware sprite collisions (not used by many games, and slower).
 * @type {boolean}
 */
var VDP_SPRITE_COLLISIONS = ACCURATE;

// Memory Settings
/**
 * Size of each memory page.
 * @const
 */
var PAGE_SIZE = 0x4000;
