/**
 * @fileoverview Definitions for the fullscreen API specification of HTML5.
 * @see http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
 * 
 * @externs
 */

// Externs as defined by the specification.
Element.prototype.requestFullscreen = function() {};

/** @type {boolean} */
Document.prototype.fullscreenEnabled;

/** @type {Element} */
Document.prototype.fullscreenElement;

Document.prototype.exitFullscreen = function() {};

// Externs definitions of browser current implementations.
// Firefox 10 implementation.
Element.prototype.mozRequestFullScreen = function() {};

/** @type {boolean} */
Document.prototype.mozFullScreen;

Document.prototype.mozCancelFullScreen = function() {};

/** @type {Element} */
Document.prototype.mozFullScreenElement;

/** @type {boolean} */
Document.prototype.mozFullScreenEnabled;

// Chrome 18 implementation.
/**
 * @param {number=} opt
 */
Element.prototype.webkitRequestFullScreen = function(opt) {};

/** @type {boolean} */
Document.prototype.webkitIsFullScreen;

Document.prototype.webkitCancelFullScreen = function() {};

/** @type {Element} */
Document.prototype.webkitCurrentFullScreenElement;

/** @type {boolean} */
Document.prototype.webkitFullScreenKeyboardInputAllowed;

/** @type {number} */
Element.ALLOW_KEYBOARD_INPUT = 1;

/** @type {number} */
Element.prototype.ALLOW_KEYBOARD_INPUT = 1;
