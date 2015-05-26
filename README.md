# jsSMS

jsSMS is a dynamic recompiling emulator for Sega Master System & Game Gear ROMs written in JavaScript and designed to be fast on mobile browsers.

## Code

Originally, this is a JavaScript port of JavaGear by Chris White.

Original copyright:
    Copyright (C) 2002-2008 Chris White

The code then evolved from a basic interpreter to a complex recompiler able to run on mobile at full speed.

The recompilation code is located in `src/compiler` folder as well as technical insights.

## Related talk

[Video of the talk about JSSMS](http://bit.ly/18n5yHj) I gave at Reject.js 2013. There are also the [slides in HTML](http://gmarty.github.io/jsSMS/Reject.JS-2013-Slides/).

## Current state

* Though state save and load functions are ported, there are not used and should be more JavaScript friendly (using JSON for example, see JSNES for an example of implementation).
* Lightgun is not yet supported.
* The recompiler is not compatible with Closure Compiler in advanced optimizations mode and will likely never be.

Many parts of the script are borrowed from JSNES, a NES emulator in JavaScript by Ben Firsh.

If you are looking for another SMS emulator in JavaScript, go to [Miracle](http://github.com/mattgodbolt/Miracle).

## ToDos

* Support latest IE.
* Experiment with web workers for recompiled code generation.
* Experiment with generator for calling interrupts.
* Experiment with asm.js.

## License

jsSMS - A dynamic recompiling emulator for Sega Master System & Game Gear written in JavaScript

Copyright (C) 2015 Guillaume Cedric Marty (https://github.com/gmarty)

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
