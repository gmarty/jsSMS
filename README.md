# jsSMS

A Sega Master System & GameGear emulator in JavaScript.

## Code

This is a JavaScript port of JavaGear by Chris White.

Original copyright:
    Copyright (c) 2002-2008 Chris White

## Current state

At the moment, only a few roms are emulated correctly.

Sound and lightgun are not yet supported.

Though state save and load functions are ported, there are not used and should be more JavaScript friendly (using JSON for example, see JSNES for an example of implementation).

Many parts of the script are borrowed from JSNES, a NES emulator in JavaScript by Ben Firsh.

This script is shipped with a minified version of about 14 kb gzipped.
The ant task for build uses Closure Compiler in advanced optimizations mode.

If you are looking for another SMS emulator in JavaScript, go to [Miracle](http://github.com/mattgodbolt/Miracle).

## ToDos

Improve emulated roms rate.

Test and support other browsers (Opera, IE, mobile...).

Declare JSSMS#is_sms and JSSMS#is_gg as {define} to allow overwrite their type at build time. Stripping dead code would allow better performance.

## License

jsSMS - A Sega Master System/GameGear emulator in JavaScript
Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
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
