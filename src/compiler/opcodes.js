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
  'LD8': function(left, right) {
    if (left == 'nn')
      return function(left) {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Literal(left), n.Register(right))
        );
      };
    if (right == 'n')
      return function(right) {
        return n.ExpressionStatement(
            n.AssignmentExpression('=', n.Register(left), n.Literal(right))
        );
      };
    return function() {
      return n.ExpressionStatement(
          n.AssignmentExpression('=', n.Register(left), n.Register(right))
      );
    };
  },
  'LD16': function(left1, left2, right1, right2) {
    if (left1 == 'n' && left2 == 'n')
      return function(address) {
        return n.ExpressionStatement(
            n.CallExpression(address, n.Literal(value))
        );
      };
    if (right1 == 'n' && right2 == 'n')
      return function(value) {
        return n.ExpressionStatement(
            n.CallExpression('set' + (left1 + left2).toUpperCase(), n.Literal(value))
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
    ast: o.LD16('b', 'c', 'n', 'n'),
    operand: UINT16
  },
  //0x02:
  {
    name: 'LD (BC),A'
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
    ast: o.LD8('b', 'n'),
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
    name: 'ADD HL,BC'
  },
  //0x0A:
  {
    name: 'LD A,(BC)'
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
    ast: o.LD8('c', 'n'),
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
    operand: UINT16
  },
  //0x12:
  {
    name: 'LD (DE),A'
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
    operand: UINT8
  },
  //0x17:
  {
    name: 'RLA'
  },
  //0x18:
  {
    name: 'JR (PC+e)',
    operand: INT8
  },
  //0x19:
  {
    name: 'ADD HL,DE'
  },
  //0x1A
  {
    name: 'LD A,(DE)'
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
    operand: UINT8
  },
  //0x1F
  {
    name: 'RRA'
  }
];
