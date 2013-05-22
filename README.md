# jsSMS

jsSMS is an emulator for Sega Master System & Game Gear ROMs written in JavaScript.

## Code

This is a JavaScript port of JavaGear by Chris White.

Original copyright:
    Copyright (C) 2002-2008 Chris White

## Current state

The compatibility is quite good now, even better than the original JavaGear. The CPU class is not fully ZEXXAL compliant tough.

Lightgun is not yet supported.

Sound is supported on the outdated [dynamicaudio](https://github.com/gmarty/jsSMS/tree/dynamicaudio) branch.

Though state save and load functions are ported, there are not used and should be more JavaScript friendly (using JSON for example, see JSNES for an example of implementation).

Many parts of the script are borrowed from JSNES, a NES emulator in JavaScript by Ben Firsh.

This script is shipped with a minified version of about 14 kb gzipped. The Grunt task for build uses Closure Compiler in advanced optimizations mode.

If you are looking for another SMS emulator in JavaScript, go to [Miracle](http://github.com/mattgodbolt/Miracle).

## ToDos

Improve execution speed in mobile browsers.

Support latest IE.

## License

jsSMS - A Sega Master System/Game Gear emulator in JavaScript
Copyright (C) 2012-2013 Guillaume Marty (https://github.com/gmarty)
Based on JavaGear Copyright (c) 2002-2008 Chris White

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
