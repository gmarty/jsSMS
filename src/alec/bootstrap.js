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
 * Deal with the installer:
 *  * Check if Open Web Apps are supported.
 *  * If so, check is the app is not already installed.
 *  * If so, show the install instructions and button.
 *
 *  @todo Use externs for mozApps, mozNotification and Google Universal Analytics.
 */
var installationInstructions = document.getElementById('installation-instructions');

var mozApps = navigator['mozApps'];
if (mozApps) {
  var checkIfInstalled = mozApps['getSelf']();
  checkIfInstalled.onsuccess = function() {
    if (checkIfInstalled.result) {
      // Already installed.
      DEBUG && console.log('App is already installed.');

      //document.getElementById('load').className = 'show';
    } else {
      // Not yet installed.
      DEBUG && console.log('App is not installed.');

      var install = document.getElementById('install');
      var manifestURL = location.href.substring(0, location.href.lastIndexOf('/')) + '/manifest.webapp';
      install.className = 'show';
      installationInstructions.className = 'show';
      install.onclick = function() {
        var installApp = mozApps['install'](manifestURL);
        installApp.onsuccess = function() {
          install.className = '';
          installationInstructions.className = '';

          // Track install via Google Analytics.
          window['ga']('send', 'event', 'button', 'click', 'install');
        };
        installApp.onerror = function() {
          alert('Install failed:\n\n' + installApp.error.name);
        };
      };

      // Dismiss the install instructions.
      var dismissInstallInstructions = function() {
        installationInstructions.className = 'show fadeout';
        // Completely hide the element after the animation.
        installationInstructions.addEventListener('transitionend', function() {
          this.className = '';
        });
      };
      // After 10s...
      setTimeout(dismissInstallInstructions, 10000);
      // ... or on click.
      installationInstructions.onclick = dismissInstallInstructions;
    }
  };
} else {
  DEBUG && console.log('Open Web Apps are not supported.');
}


/**
 * Reload content using the button in the footer.
 */
document.getElementById('reload').onclick = function() {
  location.reload(true);
};


/**
 * Check for new versions.
 */
var appCache = window.applicationCache;
if (appCache) {
  appCache.onupdateready = function() {
    // Display a notification.
    var notification = navigator['mozNotification']['createNotification'](
        'Alec emulator',
        'New version available! Click to reload.'
        );
    notification.onclick = function() {
      location.reload(true);
    };
    notification.show();

    // Ask for reload confirmation.
    if (confirm('A new version is available. Do you want to update now?\nOtherwise it will be updated at the next reload.')) {
      location.reload(true);
    }
  };
}


/**
 * Defer loading of the main script after load.
 */
$(function() {
  var scriptEl = document.createElement('script');
  var firstScript = document.scripts[0];
  scriptEl.src = 'min/alec.min.js';
  scriptEl.onload = function() {
    // When the script is loaded, instantiate jsSMS.
    var sms = new JSSMS({
      'ui': $('#emulator')['JSSMSUI']({
        'Homebrew Master System': [
          ['Blockhead', 'rom/sms/homebrew/blockhead.sms'],
          ['KunKun & KokoKun 2 - Return of the Kun', 'rom/sms/homebrew/KunKun & KokoKun 2 - Return of the Kun [v0.99].sms'],
          ['Sokoban', 'rom/sms/homebrew/sokoban.sms']
        ],
        'Homebrew Game Gear': [
          ['Fire Track', 'rom/gg/homebrew/ftrack.gg'],
          ['GG Nibbles v.4', 'rom/gg/homebrew/nibbles.gg'],
          ['Zoop \'Em Up', 'rom/gg/homebrew/zoopemup.gg']
        ],
        'Master System technical ROMs': [
          ['ZEXALL v.0.15', 'rom/sms/technical/zexall.sms']
        ],
        'Game Gear technical ROMs': [
          ['FadeTest', 'rom/gg/technical/FadeTest.gg']
        ]
      })
    });
  };
  firstScript.parentNode.insertBefore(scriptEl, firstScript);
});
