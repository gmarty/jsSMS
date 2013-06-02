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

/** @const */ var UINT8 = 1;
/** @const */ var INT8 = 2;
/** @const */ var UINT16 = 3;

// List of high level node types. Think of it as basic blocks of AST.
var n = {
  'IfStatement': function(test, consequent, alternate) {
    if (alternate == undefined) alternate = null;
    return {
      'type': 'IfStatement',
      'test': test,
      'consequent': consequent,
      'alternate': alternate
    };
  },
  'BlockStatement': function(body) {
    if (body == undefined) body = [];
    return {
      'type': 'BlockStatement',
      'body': body
    };
  },
  'ExpressionStatement': function(expression) {
    return {
      'type': 'ExpressionStatement',
      'expression': expression
    };
  },
  // This is not a real AST block, but it's convenient for manipulating registers in optimizer.
  'Register': function(name) {
    return {
      'type': 'Register',
      'name': name
    };
  },
  'Identifier': function(name) {
    return {
      'type': 'Identifier',
      'name': name
    };
  },
  'Literal': function(value) {
    return {
      'type': 'Literal',
      'value': value
    };
  },
  'CallExpression': function(callee, args) {
    if (args == undefined) args = [];
    if (!Array.isArray(args)) args = [args];
    return {
      'type': 'CallExpression',
      'callee': n.Identifier(callee),
      'arguments': args
    };
  },
  'AssignmentExpression': function(operator, left, right) {
    return {
      'type': 'AssignmentExpression',
      'operator': operator,
      'left': left,
      'right': right
    };
  },
  'BinaryExpression': function(operator, left, right) {
    return {
      'type': 'BinaryExpression',
      'operator': operator,
      'left': left,
      'right': right
    };
  }
};

// List of common operations for the Z80.
// Each entry returns a function accepting an optional parameter.
var o = {
  'NOOP': function() {
    return function() {
      return;
    }
  },
  'LD8': function(srcRegister, dstRegister1, dstRegister2) {
    if (dstRegister1 == undefined && dstRegister2 == undefined)
      // Direct value assignment (ex: `LD B,n`).
      return function(value) {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register(srcRegister), n.Literal(value))
        );
      };
    else if (dstRegister2 == undefined)
      // Register assignment (ex: `LD B,C`).
      return function() {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register(srcRegister), n.Register(dstRegister1))
        );
      };
    else if (dstRegister1 == 'n' && dstRegister2 == 'n')
      // Direct address value assignment (ex: `LD A,(nn)`).
      return function(value) {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register(srcRegister), o.READ_MEM8(n.Literal(value)))
        );
      };
    else
      // Register address value assignment (ex: `LD A,(BC)`).
      return function() {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register(srcRegister),
            o.READ_MEM8(n.CallExpression('get' + (dstRegister1 + dstRegister2).toUpperCase()))
            )
        );
      };
  },
  'LD16': function(srcRegister1, srcRegister2, dstRegister1, dstRegister2) {
    if (dstRegister1 == undefined && dstRegister2 == undefined)
      // Direct value assignment (ex: `LD HL,nn`).
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('set' + (srcRegister1 + srcRegister2).toUpperCase(), n.Literal(value))
        );
      };
    else if (dstRegister1 == 'n' && dstRegister2 == 'n')
      // Direct address value assignment (ex: `LD HL,(nn)`).
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('set' + (srcRegister1 + srcRegister2).toUpperCase(), o.READ_MEM16(n.Literal(value)))
        );
      };
    else
      throw Error('Wrong parameters number');
  },
  'LD_WRITE_MEM': function(srcRegister1, srcRegister2, dstRegister1, dstRegister2) {
    if (dstRegister1 == undefined && dstRegister2 == undefined)
      // Direct value assignment (ex: `LD (HL),n`).
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('writeMem', [n.CallExpression('get' + (srcRegister1 + srcRegister2).toUpperCase()), n.Literal(value)])
        );
      };
    else if (srcRegister1 == 'n' && srcRegister2 == 'n' && dstRegister2 == undefined)
      // Direct address assignment (ex: `LD (nn),A`).
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('writeMem', [n.Literal(value), n.Register(dstRegister1)])
        );
      };
    else if (srcRegister1 == 'n' && srcRegister2 == 'n')
      // Direct address assignment (ex: `LD (nn),HL`).
      return function(value) {
        return [
          n.ExpressionStatement(
              n.CallExpression('writeMem', [n.Literal(value), n.Register(dstRegister2)])
          ),
          n.ExpressionStatement(
              n.CallExpression('writeMem', [n.Literal(value + 1), n.Register(dstRegister1)])
          )
        ];
      };
    else
      // Register assignment (ex: `LD (BC),a`).
      return function() {
        return n.ExpressionStatement(
            n.CallExpression('writeMem', [n.CallExpression('get' + (srcRegister1 + srcRegister2).toUpperCase()), n.Register(dstRegister1)])
        );
      };
  },
  'LD_SP': function() {
    return function(value) {
      return n.ExpressionStatement(
          n.AssignmentExpression('=', n.Identifier('sp'), n.Literal(value))
      );
    };
  },
  'INC8': function(register) {
    return function() {
      return n.ExpressionStatement(
          n.AssignmentExpression('=', n.Register(register), n.CallExpression('inc8', n.Register(register)))
      );
    };
  },
  'INC16': function(register1, register2) {
    return function() {
      return n.ExpressionStatement(
          n.CallExpression('inc' + (register1 + register2).toUpperCase())
      );
    };
  },
  'DEC8': function(register) {
    return function() {
      return n.ExpressionStatement(
          n.AssignmentExpression('=', n.Register(register), n.CallExpression('dec8', n.Register(register)))
      );
    };
  },
  'DEC16': function(register1, register2) {
    return function() {
      return n.ExpressionStatement(
          n.CallExpression('dec' + (register1 + register2).toUpperCase())
      );
    };
  },
  'ADD16': function(register1, register2, register3, register4) {
    //this.setHL(this.add16(this.getHL(), this.getBC()));
    return function() {
      return n.ExpressionStatement(
          n.CallExpression('set' + (register1 + register2).toUpperCase(),
          n.CallExpression('add16',
          [n.CallExpression('get' + (register1 + register2).toUpperCase()),
           n.CallExpression('get' + (register3 + register4).toUpperCase())]
          )
          )
      );
    };
  },
  'RLA': function() {
    return function() {
      return n.ExpressionStatement(
          n.CallExpression('rla_a')
      );
    };
  },
  'RRA': function() {
    return function() {
      return n.ExpressionStatement(
          n.CallExpression('rra_a')
      );
    };
  },
  'ADD': function(register1, register2) {
    if (register1 == undefined && register2 == undefined)
      // 0 arguments.
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('add_a', n.Literal(value))
        );
      };
    if (register2 == undefined)
      // 1 argument.
      return function() {
        return n.ExpressionStatement(
            n.CallExpression('add_a', n.Register(register1))
        );
      };
    else
      // 2 arguments.
      return function() {
        return n.ExpressionStatement(
            n.CallExpression('add_a', o.READ_MEM8(n.CallExpression('get' + (register1 + register2).toUpperCase())))
        );
      };
  },
  'JR': function(test) {
    return function(value) {
      // if (test) {
      //   pc = 0x00FF;
      //   tstates -= 5;
      // }
      return n.IfStatement(
          test,
          n.BlockStatement([
            n.ExpressionStatement(n.AssignmentExpression('=', n.Identifier('pc'), n.Literal(value))),
            n.ExpressionStatement(n.AssignmentExpression('=', n.Identifier('tstates'), n.Literal(5)))
          ])
      );
    };
  },
  'DJNZ': function() {
    return function(value) {
      return [
        // b = (b - 1) & 0xFF;
        n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register('b'), n.BinaryExpression('&', n.BinaryExpression('-', n.Register('b'), n.Literal(1)), n.Literal(0xFF)))
        ),
        // b != 0
        o.JR(n.BinaryExpression('!=', n.Register('b'), n.Literal(0)))(value)
      ];
    };
  },
  // Below these point, properties can't be called from outside object `n`.
  // Move to object `o`? Mark as private?
  'READ_MEM8': function(value) {
    return n.CallExpression('readMem', value);
  },
  'READ_MEM16': function(value) {
    return n.CallExpression('readMemWord', value);
  }
};

var opcodeTable = [
  //0x00:
  {
    name: 'NOP',
    ast: o.NOOP()
  },
  //0x01:
  {
    name: 'LD BC,nn',
    ast: o.LD16('b', 'c'),
    operand: UINT16
  },
  //0x02:
  {
    name: 'LD (BC),A',
    ast: o.LD_WRITE_MEM('b', 'c', 'a')
  },
  //0x03:
  {
    name: 'INC BC',
    ast: o.INC16('b', 'c')
  },
  //0x04:
  {
    name: 'INC B',
    ast: o.INC8('b')
  },
  //0x05:
  {
    name: 'DEC B',
    ast: o.DEC8('b')
  },
  //0x06:
  {
    name: 'LD B,n',
    ast: o.LD8('b'),
    operand: UINT8
  },
  //0x07:
  {
    name: 'RLCA'
  },
  //0x08:
  {
    name: 'EX AF AF\''
  },
  //0x09:
  {
    name: 'ADD HL,BC',
    ast: o.ADD16('h', 'l', 'b', 'c')
  },
  //0x0A:
  {
    name: 'LD A,(BC)',
    ast: o.LD8('a', 'b', 'c')
  },
  //0x0B:
  {
    name: 'DEC BC',
    ast: o.DEC16('b', 'c')
  },
  //0x0C:
  {
    name: 'INC C',
    ast: o.INC8('c')
  },
  //0x0D:
  {
    name: 'DEC C',
    ast: o.DEC8('c')
  },
  //0x0E:
  {
    name: 'LD C,n',
    ast: o.LD8('c'),
    operand: UINT8
  },
  //0x0F:
  {
    name: 'RRCA'
  },
  //0x10:
  {
    name: 'DJNZ (PC+e)',
    ast: o.DJNZ(),
    operand: INT8
  },
  //0x11:
  {
    name: 'LD DE,nn',
    ast: o.LD16('d', 'e'),
    operand: UINT16
  },
  //0x12:
  {
    name: 'LD (DE),A',
    ast: o.LD_WRITE_MEM('d', 'e', 'a')
  },
  //0x13:
  {
    name: 'INC DE',
    ast: o.INC16('d', 'e')
  },
  //0x14:
  {
    name: 'INC D',
    ast: o.INC8('d')
  },
  //0x15:
  {
    name: 'DEC D',
    ast: o.DEC8('d')
  },
  //0x16:
  {
    name: 'LD D,n',
    ast: o.LD8('d'),
    operand: UINT8
  },
  //0x17:
  {
    name: 'RLA',
    ast: o.RLA()
  },
  //0x18:
  {
    name: 'JR (PC+e)',
    operand: INT8
  },
  //0x19:
  {
    name: 'ADD HL,DE',
    ast: o.ADD16('h', 'l', 'd', 'e')
  },
  //0x1A
  {
    name: 'LD A,(DE)',
    ast: o.LD8('a', 'd', 'e')
  },
  //0x1B
  {
    ame: 'DEC DE',
    ast: o.DEC16('d', 'e')
  },
  //0x1C
  {
    name: 'INC E',
    ast: o.INC8('e')
  },
  //0x1D
  {
    name: 'DEC E',
    ast: o.DEC8('e')
  },
  //0x1E
  {
    name: 'LD E,n',
    ast: o.LD8('e'),
    operand: UINT8
  },
  //0x1F
  {
    name: 'RRA',
    ast: o.RRA()
  },
  //0x20
  {
    name: 'JR NZ,(PC+e)',
    operand: INT8
  },
  //0x21
  {
    name: 'LD HL,nn',
    ast: o.LD16('h', 'l'),
    operand: UINT16
  },
  //0x22
  {
    name: 'LD (nn),HL',
    ast: o.LD_WRITE_MEM('n', 'n', 'h', 'l'),
    operand: UINT16
  },
  //0x23
  {
    name: 'INC HL',
    ast: o.INC16('h', 'l')
  },
  //0x24
  {
    name: 'INC H'
  },
  //0x25
  {
    name: 'DEC H'
  },
  //0x26
  {
    name: 'LD H,n',
    ast: o.LD8('h'),
    operand: UINT8
  },
  //0x27
  {
    name: 'DAA'
  },
  //0x28
  {
    name: 'JR Z,(PC+e)',
    operand: INT8
  },
  //0x29
  {
    name: 'ADD HL,HL',
    ast: o.ADD16('h', 'l', 'h', 'l')
  },
  //0x2A
  {
    name: 'LD HL,(nn)',
    ast: o.LD16('h', 'l', 'n', 'n'),
    operand: UINT16
  },
  //0x2B
  {
    name: 'DEC HL'
  },
  //0x2C
  {
    name: 'INC L'
  },
  //0x2D
  {
    name: 'DEC L'
  },
  //0x2E
  {
    name: 'LD L,n',
    ast: o.LD8('l'),
    operand: UINT8
  },
  //0x2F
  {
    name: 'CPL'
  },
  //0x30
  {
    name: 'JR NC,(PC+e)',
    operand: INT8
  },
  //0x31
  {
    name: 'LD SP,nn',
    ast: o.LD_SP(),
    operand: UINT16
  },
  //0x32
  {
    name: 'LD (nn),A',
    ast: o.LD_WRITE_MEM('n', 'n', 'a'),
    operand: UINT16
  },
  //0x33
  {
    name: 'INC SP'
  },
  //0x34
  {
    name: 'INC (HL)'
  },
  //0x35
  {
    name: 'DEC (HL)'
  },
  //0x36
  {
    name: 'LD (HL),n',
    ast: o.LD_WRITE_MEM('h', 'l'),
    operand: UINT8
  },
  //0x37
  {
    name: 'SCF'
  },
  //0x38
  {
    name: 'JR C,(PC+e)',
    operand: INT8
  },
  //0x39
  {
    name: 'ADD HL,SP'
  },
  //0x3A
  {
    name: 'LD A,(nn)',
    ast: o.LD8('a', 'n', 'n'),
    operand: UINT16
  },
  //0x3B
  {
    name: 'DEC SP'
  },
  //0x3C
  {
    name: 'INC A',
    ast: o.INC8('a')
  },
  //0x3D
  {
    name: 'DEC A',
    ast: o.DEC8('a')
  },
  //0x3E
  {
    name: 'LD A,n',
    ast: o.LD8('a'),
    operand: UINT8
  },
  //0x3F
  {
    name: 'CCF'
  },
  //0x40
  {
    name: 'LD B,B',
    ast: o.NOOP(),
    operand: UINT8
  },
  //0x41
  {
    name: 'LD B,C',
    ast: o.LD8('b', 'c')
  },
  //0x42
  {
    name: 'LD B,D',
    ast: o.LD8('b', 'd')
  },
  //0x43
  {
    name: 'LD B,E',
    ast: o.LD8('b', 'e')
  },
  //0x44
  {
    name: 'LD B,H',
    ast: o.LD8('b', 'h')
  },
  //0x45
  {
    name: 'LD B,L',
    ast: o.LD8('b', 'l')
  },
  //0x46
  {
    name: 'LD B,(HL)'
  },
  //0x47
  {
    name: 'LD B,A',
    ast: o.LD8('b', 'a')
  },
  //0x48
  {
    name: 'LD C,B',
    ast: o.LD8('c', 'b')
  },
  //0x49
  {
    name: 'LD C,C',
    ast: o.NOOP()
  },
  //0x4A
  {
    name: 'LD C,D',
    ast: o.LD8('c', 'd')
  },
  //0x4B
  {
    name: 'LD C,E',
    ast: o.LD8('c', 'e')
  },
  //0x4C
  {
    name: 'LD C,H',
    ast: o.LD8('c', 'h')
  },
  //0x4D
  {
    name: 'LD C,L',
    ast: o.LD8('c', 'l')
  },
  //0x4E
  {
    name: 'LD C,(HL)'
  },
  //0x4F
  {
    name: 'LD C,A',
    ast: o.LD8('c', 'a')
  },
  //0x50
  {
    name: 'LD D,B',
    ast: o.LD8('d', 'b')
  },
  //0x51
  {
    name: 'LD D,C',
    ast: o.LD8('d', 'c')
  },
  //0x52
  {
    name: 'LD D,D',
    ast: o.NOOP()
  },
  //0x53
  {
    name: 'LD D,E',
    ast: o.LD8('d', 'e')
  },
  //0x54
  {
    name: 'LD D,H',
    ast: o.LD8('d', 'h')
  },
  //0x55
  {
    name: 'LD D,L',
    ast: o.LD8('d', 'l')
  },
  //0x56
  {
    name: 'LD D,(HL)'
  },
  //0x57
  {
    name: 'LD D,A',
    ast: o.LD8('d', 'a')
  },
  //0x58
  {
    name: 'LD E,B',
    ast: o.LD8('e', 'b')
  },
  //0x59
  {
    name: 'LD E,C',
    ast: o.LD8('e', 'c')
  },
  //0x5A
  {
    name: 'LD E,D',
    ast: o.LD8('e', 'd')
  },
  //0x5B
  {
    name: 'LD E,E',
    ast: o.NOOP()
  },
  //0x5C
  {
    name: 'LD E,H',
    ast: o.LD8('e', 'h')
  },
  //0x5D
  {
    name: 'LD E,L',
    ast: o.LD8('e', 'l')
  },
  //0x5E
  {
    name: 'LD E,(HL)'
  },
  //0x5F
  {
    name: 'LD E,A',
    ast: o.LD8('e', 'a')
  },
  //0x60
  {
    name: 'LD H,B',
    ast: o.LD8('h', 'b')
  },
  //0x61
  {
    name: 'LD H,C',
    ast: o.LD8('h', 'c')
  },
  //0x62
  {
    name: 'LD H,D',
    ast: o.LD8('h', 'd')
  },
  //0x63
  {
    name: 'LD H,E',
    ast: o.LD8('h', 'e')
  },
  //0x64
  {
    name: 'LD H,H',
    ast: o.NOOP()
  },
  //0x65
  {
    name: 'LD H,L',
    ast: o.LD8('h', 'l')
  },
  //0x66
  {
    name: 'LD H,(HL)'
  },
  //0x67
  {
    name: 'LD H,A',
    ast: o.LD8('h', 'a')
  },
  //0x68
  {
    name: 'LD L,B',
    ast: o.LD8('l', 'b')
  },
  //0x69
  {
    name: 'LD L,C',
    ast: o.LD8('l', 'c')
  },
  //0x6A
  {
    name: 'LD L,D',
    ast: o.LD8('l', 'd')
  },
  //0x6B
  {
    name: 'LD L,E',
    ast: o.LD8('l', 'e')
  },
  //0x6C
  {
    name: 'LD L,H',
    ast: o.LD8('l', 'h')
  },
  //0x6D
  {
    name: 'LD L,L',
    ast: o.NOOP()
  },
  //0x6E
  {
    name: 'LD L,(HL)'
  },
  //0x6F
  {
    name: 'LD L,A',
    ast: o.LD8('l', 'a')
  },
  //0x70
  {
    name: 'LD (HL),B'
  },
  //0x71
  {
    name: 'LD (HL),C'
  },
  //0x72
  {
    name: 'LD (HL),D'
  },
  //0x73
  {
    name: 'LD (HL),E'
  },
  //0x74
  {
    name: 'LD (HL),H'
  },
  //0x75
  {
    name: 'LD (HL),L'
  },
  //0x76
  {
    name: 'HALT'
  },
  //0x77
  {
    name: 'LD (HL),A'
  },
  //0x78
  {
    name: 'LD A,B',
    ast: o.LD8('a', 'b')
  },
  //0x79
  {
    name: 'LD A,C',
    ast: o.LD8('a', 'c')
  },
  //0x7A
  {
    name: 'LD A,D',
    ast: o.LD8('a', 'd')
  },
  //0x7B
  {
    name: 'LD A,E',
    ast: o.LD8('a', 'e')
  },
  //0x7C
  {
    name: 'LD A,H',
    ast: o.LD8('a', 'h')
  },
  //0x7D
  {
    name: 'LD A,L',
    ast: o.LD8('a', 'l')
  },
  //0x7E
  {
    name: 'LD A,(HL)',
    ast: o.LD8('a', 'h', 'l')
  },
  //0x7F
  {
    name: 'LD A,A',
    ast: o.NOOP()
  },
  //0x80
  {
    name: 'ADD A,B',
    ast: o.ADD('b')
  },
  //0x81
  {
    name: 'ADD A,C',
    ast: o.ADD('c')
  },
  //0x82
  {
    name: 'ADD A,D',
    ast: o.ADD('d')
  },
  //0x83
  {
    name: 'ADD A,E',
    ast: o.ADD('e')
  },
  //0x84
  {
    name: 'ADD A,H',
    ast: o.ADD('h')
  },
  //0x85
  {
    name: 'ADD A,L',
    ast: o.ADD('l')
  },
  //0x86
  {
    name: 'ADD A,(HL)'
  },
  //0x87
  {
    name: 'ADD A,A',
    ast: o.ADD('a')
  },
  //0x88
  {
    name: 'ADC A,B'
  },
  //0x89
  {
    name: 'ADC A,C'
  },
  //0x8A
  {
    name: 'ADC A,D'
  },
  //0x8B
  {
    name: 'ADC A,E'
  },
  //0x8C
  {
    name: 'ADC A,H'
  },
  //0x8D
  {
    name: 'ADC A,L'
  },
  //0x8E
  {
    name: 'ADC A,(HL)'
  },
  //0x8F
  {
    name: 'ADC A,A'
  }
];
