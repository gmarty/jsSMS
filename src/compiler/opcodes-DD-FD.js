/* global o, opcodeTableDDCB, opcodeTableFDCB */

'use strict';

function generateIndexTable(index) {
  var register = index.substring(1, 2).toLowerCase();
  var registerH = 'i' + register + 'H';
  var registerL = 'i' + register + 'L';

  return {
    0x09: {
      name: 'ADD ' + index + ',BC',
      ast: o.ADD16(registerH, registerL, 'b', 'c'),
    },
    0x19: {
      name: 'ADD ' + index + ',DE',
      ast: o.ADD16(registerH, registerL, 'd', 'e'),
    },
    0x21: {
      name: 'LD ' + index + ',nn',
      ast: o.LD16(registerH, registerL),
    },
    0x22: {
      name: 'LD (nn),' + index,
      ast: o.LD_NN(registerH, registerL),
    },
    0x23: {
      name: 'INC ' + index,
      ast: o.INC16(registerH, registerL),
    },
    0x2a: {
      name: 'LD ' + index + ',(nn)',
      ast: o.LD16(registerH, registerL, 'n', 'n'),
    },
    0x2b: {
      name: 'DEC ' + index,
      ast: o.DEC16(registerH, registerL),
    },
    0x34: {
      name: 'INC (' + index + '+d)',
      ast: o.INC_X(registerH, registerL),
    },
    0x35: {
      name: 'DEC (' + index + '+d)',
      ast: o.DEC_X(registerH, registerL),
    },
    0x36: {
      name: 'LD (' + index + '+d),n',
      ast: o.LD_X(registerH, registerL),
    },
    0x39: {
      name: 'ADD ' + index + ',SP',
      ast: o.ADD16(registerH, registerL, 'sp'),
    },
    0x46: {
      name: 'LD B,(' + index + '+d)',
      ast: o.LD8_D('b', registerH, registerL),
    },
    0x4e: {
      name: 'LD C,(' + index + '+d)',
      ast: o.LD8_D('c', registerH, registerL),
    },
    0x54: {
      name: ' LD D,' + index + 'H *',
      ast: o.LD8('d', registerH),
    },
    0x56: {
      name: 'LD D,(' + index + '+d)',
      ast: o.LD8_D('d', registerH, registerL),
    },
    0x5d: {
      name: 'LD E,' + index + 'L *',
      ast: o.LD8('e', registerL),
    },
    0x5e: {
      name: 'LD E,(' + index + '+d)',
      ast: o.LD8_D('e', registerH, registerL),
    },
    0x60: {
      name: 'LD ' + index + 'H,B',
      ast: o.LD8(registerH, 'b'),
    },
    0x61: {
      name: 'LD ' + index + 'H,C',
      ast: o.LD8(registerH, 'c'),
    },
    0x62: {
      name: 'LD ' + index + 'H,D',
      ast: o.LD8(registerH, 'd'),
    },
    0x63: {
      name: 'LD ' + index + 'H,E',
      ast: o.LD8(registerH, 'e'),
    },
    0x64: {
      name: 'LD ' + index + 'H,' + index + 'H',
      ast: o.NOOP(),
    },
    0x65: {
      name: 'LD ' + index + 'H,' + index + 'L *',
      ast: o.LD8_D(registerH, registerL),
    },
    0x66: {
      name: 'LD H,(' + index + '+d)',
      ast: o.LD8_D('h', registerH, registerL),
    },
    0x67: {
      name: 'LD ' + index + 'H,A',
      ast: o.LD8(registerH, 'a'),
    },
    0x68: {
      name: 'LD ' + index + 'L,B',
      ast: o.LD8(registerL, 'b'),
    },
    0x69: {
      name: 'LD ' + index + 'L,C',
      ast: o.LD8(registerL, 'c'),
    },
    0x6a: {
      name: 'LD ' + index + 'L,D',
      ast: o.LD8(registerL, 'd'),
    },
    0x6b: {
      name: 'LD ' + index + 'L,E',
      ast: o.LD8(registerL, 'e'),
    },
    0x6c: {
      name: 'LD ' + index + 'L,' + index + 'H',
      ast: o.LD8_D(registerL, registerH),
    },
    0x6d: {
      name: 'LD ' + index + 'L,' + index + 'L *',
      ast: o.NOOP(),
    },
    0x6e: {
      name: 'LD L,(' + index + '+d)',
      ast: o.LD8_D('l', registerH, registerL),
    },
    0x6f: {
      name: 'LD ' + index + 'L,A *',
      ast: o.LD8(registerL, 'a'),
    },
    0x70: {
      name: 'LD (' + index + '+d),B',
      ast: o.LD_X('b', registerH, registerL),
    },
    0x71: {
      name: 'LD (' + index + '+d),C',
      ast: o.LD_X('c', registerH, registerL),
    },
    0x72: {
      name: 'LD (' + index + '+d),D',
      ast: o.LD_X('d', registerH, registerL),
    },
    0x73: {
      name: 'LD (' + index + '+d),E',
      ast: o.LD_X('e', registerH, registerL),
    },
    0x74: {
      name: 'LD (' + index + '+d),H',
      ast: o.LD_X('h', registerH, registerL),
    },
    0x75: {
      name: 'LD (' + index + '+d),L',
      ast: o.LD_X('l', registerH, registerL),
    },
    0x76: {
      name: 'LD (' + index + '+d),B',
      ast: o.LD_X('b', registerH, registerL),
    },
    0x77: {
      name: 'LD (' + index + '+d),A',
      ast: o.LD_X('a', registerH, registerL),
    },
    0x7e: {
      name: 'LD A,(' + index + '+d)',
      ast: o.LD8_D('a', registerH, registerL),
    },
    0x7c: {
      name: 'LD A,' + index + 'H',
      ast: o.LD8('a', registerH),
    },
    0x7d: {
      name: 'LD A,' + index + 'L',
      ast: o.LD8('a', registerL),
    },
    0x84: {
      name: 'ADD A,' + index + 'H',
      ast: o.ADD(registerL),
    },
    0x85: {
      name: 'ADD A,' + index + 'L',
      ast: o.ADD(registerL),
    },
    0x86: {
      name: 'ADD A,(' + index + '+d)',
      ast: o.ADD_X(registerH, registerL),
    },
    0x8c: {
      name: 'ADC A,' + index + 'H',
      ast: o.ADC(registerL),
    },
    0x8d: {
      name: 'ADC A,' + index + 'L',
      ast: o.ADC(registerL),
    },
    0x8e: {
      name: 'ADC A,(' + index + '+d)',
      ast: o.ADC_X(registerH, registerL),
    },
    0x94: {
      name: 'SUB A,' + index + 'H',
      ast: o.SUB(registerL),
    },
    0x95: {
      name: 'SUB A,' + index + 'L',
      ast: o.SUB(registerL),
    },
    0x96: {
      name: 'SUB A,(' + index + '+d)',
      ast: o.SUB_X(registerH, registerL),
    },
    0x9c: {
      name: 'SBC A,' + index + 'H',
      ast: o.SBC(registerL),
    },
    0x9d: {
      name: 'SBC A,' + index + 'L',
      ast: o.SBC(registerL),
    },
    0x9e: {
      name: 'SBC A,(' + index + '+d)',
      ast: o.SBC_X(registerH, registerL),
    },
    0xa6: {
      name: 'AND A,(' + index + '+d)',
      ast: o.AND_X(registerH, registerL),
    },
    0xae: {
      name: 'XOR A,(' + index + '+d)',
      ast: o.XOR_X(registerH, registerL),
    },
    0xb6: {
      name: 'OR A,(' + index + '+d)',
      ast: o.OR_X(registerH, registerL),
    },
    0xbe: {
      name: 'CP (' + index + '+d)',
      ast: o.CP_X(registerH, registerL),
    },
    0xcb: index === 'IX' ? opcodeTableDDCB : opcodeTableFDCB,
    0xe1: {
      name: 'POP ' + index,
      ast: o.POP(registerH, registerL),
    },
    0xe3: {
      name: 'EX SP,(' + index + ')',
      ast: o.EX_SP_X(registerH, registerL),
    },
    0xe5: {
      name: 'PUSH ' + index,
      ast: o.PUSH(registerH, registerL),
    },
    0xe9: {
      name: 'JP (' + index + ')',
      ast: o.JP_X(registerH, registerL),
    },
    0xf9: {
      name: 'LD SP,' + index,
      ast: o.LD_SP(registerH, registerL),
    },
  };
}
