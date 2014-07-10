# jsSMS internals

> Interpreter or recompiler?

The general rule is that an interpreter is slow but reliable and easy to develop, while a recompiler is fast but has high latency and implementation can be tricky.

In this project, in order to achieve full speed emulation on mobile browsers we use a mix of static, dynamic recompiler and classic interpreter.

Most of the internals of jsSMS were inspired by [Shumway](https://github.com/mozilla/shumway/tree/master/src/avm2).

In an ideal world, we want to compile SMS/Game Gear ROMs to pure JavaScript without using the interpreter, but this is not always possible because:

* The static analysis has limitations and cannot determine the next instruction or jump target of some opcodes.
* Paging memory changes at runtime and it's hard to reliably track such changes using static analysis.
* It is possible to execute instructions from memory in Z80 (The PC variable being set to a value higher than 0xC000, very similar to an `eval()`). I believe ZEXALL does that.

That means that you can only convert a ROM to JavaScript if:

* It uses a subset of Z80 opcodes.
* It is under 32KB (i.e. don't use paging memory).
* PC remains strictly below 0xC000.

When a ROM is loaded, the emulator tries to generate as much code as possible using static analysis -- this is the static recompiling phase.

Later at runtime, JavaScript functions are generated from new instructions using dynamic recompilation.

When it is not possible to recompile JavaScript at all, the interpreter is used.

Let's now go through this different components.

## Interpreter

The interpreter is just a basic `switch()` that looks for the opcode associated to current PC and execute respective JavaScript instructions sequentially.

The optimizations possible are limited to the scope of a single instruction. Example for opcode `XOR A,A`:

> `this.f = this.SZP_TABLE[this.a ^= this.a];`
>
> is optimized to:
>
> `this.f = this.SZP_TABLE[this.a = 0];`

## Static Recompiler

This part is launched at load time and tries to generate as many JavaScript functions as possible. Because of its complexity, the recompiler is split into several modules.

### 1. Parser

Given an entry point, the parser parses instructions in a ROM sequentially.

The entry point is first added to a stack and processed.

* If the next address can be determined statically, it is added to the stack.
* If the jump target can be determined statically, it is added to the stack.

Then, the next addressed in the stack is popped and processed.

Parsing stops when the stack is empty.

The parser returns a sparse array of opcodes objects including optional operands and jump targets.

(TODO) In debug mode, each parsed address in the binary is marked as being instruction or data.

For ROMs over 32KB, parsing is limited to the actual memory pages:

* 0x0000 - 0x4000
* 0x4001 - 0x8000
* 0x8001 - 0xC000

### 2. Analyzer

(TODO) Rearrange parsed instructions to make use of JavaScript control flow constructs (`if`, `else if`, `while`, `break`...).

It breaks the instructions into functions, on specific cases like:

* When the instruction is a jump target, then a new function starts.
* If the instruction does a unconditional jump, then the current function stops.

This step adds JavaScript AST to each instruction, and, in debug mode, add human readable opcode string (like `LD B,C` or `LD H,0x00`...).

### 3. Optimizer

The branches are transferred to the optimizer that scans the AST for patterns and apply optimizations (inlining values, replace registers by local variables...).

The optimizer is the single reason why we manipulate AST in the first place. However, it can be deactivated safely, it is not absolutely required at runtime.

The original prototype located in `src/debugger.js` generated static code that was impossible to optimize in a clean and powerful way.

The AST is compatible with Esprima, so in theory, we can reuse optimization passes developed for projects like [esmangle](https://github.com/Constellation/esmangle/tree/master/lib/pass). In the future, we hope to generate more natural code by mapping the internal Z80 logic to JavaScript native functions (ex: `Math.max`...).

### 4. Generator

The generator outputs JavaScript code from the branches AST. The resulting strings are evaluated through `new Function()` and added to JSSMS.Z80. They are given the name of their entry point address.

Once the static recompiling stage is completed, the generated JavaScript is ready to be ran.

## Dynamic Recompiler

During runtime, when a unparsed instruction is reached, the dynamic recompiling happens. Most of its logic and code are shared with the static recompiler.

### 1. Parser

When a new opcode is reached, its instructions are parsed until:

* A jump instruction is found.
* An unconditional jump is performed.

Essentially, the dynamic recompiler only parses a single function. This is done to reduce latency in generating new functions.

(TODO) Try to parse as many functions as possible.

### 2. Analyzer

The analyzer works like in static recompiling mode.

(TODO) If an instruction called is located in the middle of a generated function, 2 new ones should be generated and the old one deleted.

### 3. Optimizer

On dynamic recompilation, the optimizer only performs local optimizations.

### 4. Generator

The new JavaScript function is generated and added to the pool of branches, then it is executed.
