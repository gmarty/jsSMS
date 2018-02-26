/* global o */

'use strict';

var opcodeTableED = {
  0x40: {
    name: 'IN B,(C)',
    ast: o.IN('b', 'c'),
  },
  0x42: {
    name: 'SBC HL,BC',
    ast: o.SBC16('b', 'c'),
  },
  0x41: {
    name: 'OUT (C),B',
    ast: o.OUT('c', 'b'),
  },
  0x43: {
    name: 'LD (nn),BC',
    ast: o.LD_NN('b', 'c'),
  },
  0x44: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x45: {
    name: 'RETN / RETI',
    ast: o.RETN_RETI(),
  },
  0x46: {
    name: 'IM 0',
    ast: o.IM(0),
  },
  0x48: {
    name: 'IN C,(C)',
    ast: o.IN('c', 'c'),
  },
  0x49: {
    name: 'OUT (C),C',
    ast: o.OUT('c', 'c'),
  },
  0x4a: {
    name: 'ADC HL,BC',
    ast: o.ADC16('b', 'c'),
  },
  0x4b: {
    name: 'LD BC,(nn)',
    ast: o.LD16('b', 'c', 'n', 'n'),
  },
  0x4c: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x4d: {
    name: 'RETN / RETI',
    ast: o.RETN_RETI(),
  },
  0x4e: {
    name: 'IM 0',
    ast: o.IM(0),
  },
  0x4f: {
    name: 'LD R,A',
    ast: o.LD8('r', 'a'),
  },
  0x50: {
    name: 'IN D,(C)',
    ast: o.IN('d', 'c'),
  },
  0x51: {
    name: 'OUT (C),D',
    ast: o.OUT('c', 'd'),
  },
  0x52: {
    name: 'SBC HL,DE',
    ast: o.SBC16('d', 'e'),
  },
  0x53: {
    name: 'LD (nn),DE',
    ast: o.LD_NN('d', 'e'),
  },
  0x54: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x55: {
    name: 'RETN / RETI',
    ast: o.RETN_RETI(),
  },
  0x56: {
    name: 'IM 1',
    ast: o.IM(1),
  },
  0x57: {
    name: 'LD A,I',
    ast: o.LD8('a', 'i'),
  },
  0x58: {
    name: 'IN E,(C)',
    ast: o.IN('e', 'c'),
  },
  0x59: {
    name: 'OUT (C),E',
    ast: o.OUT('c', 'e'),
  },
  0x5a: {
    name: 'ADC HL,DE',
    ast: o.ADC16('d', 'e'),
  },
  0x5b: {
    name: 'LD DE,(nn)',
    ast: o.LD16('d', 'e', 'n', 'n'),
  },
  0x5c: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x5f: {
    name: 'LD A,R',
    ast: o.LD8('a', 'r'),
  },
  0x60: {
    name: 'IN H,(C)',
    ast: o.IN('h', 'c'),
  },
  0x61: {
    name: 'OUT (C),H',
    ast: o.OUT('c', 'h'),
  },
  0x62: {
    name: 'SBC HL,HL',
    ast: o.SBC16('h', 'l'),
  },
  0x63: {
    name: 'LD (nn),HL',
    ast: o.LD_NN('h', 'l'),
  },
  0x64: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x66: {
    name: 'IM 0',
    ast: o.IM(0),
  },
  0x67: {
    name: 'RRD',
    ast: o.RRD(),
  },
  0x68: {
    name: 'IN L,(C)',
    ast: o.IN('l', 'c'),
  },
  0x69: {
    name: 'OUT (C),L',
    ast: o.OUT('c', 'l'),
  },
  0x6a: {
    name: 'ADC HL,HL',
    ast: o.ADC16('h', 'l'),
  },
  0x6b: {
    name: 'LD HL,(nn)',
    ast: o.LD16('h', 'l', 'n', 'n'),
  },
  0x6c: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x6e: {
    name: 'IM 0',
    ast: o.IM(0),
  },
  0x6f: {
    name: 'RLD',
    ast: o.RLD(),
  },
  0x73: {
    name: 'LD (nn),SP',
    ast: o.LD_NN('sp'),
  },
  0x74: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0x76: {
    name: 'IM 1',
    ast: o.IM(1),
  },
  0x78: {
    name: 'IN A,(C)',
    ast: o.IN('a', 'c'),
  },
  0x79: {
    name: 'OUT (C),A',
    ast: o.OUT('c', 'a'),
  },
  0x7a: {
    name: 'ADC HL,SP',
    ast: o.ADC16('sp'),
  },
  0x7b: {
    name: 'LD SP,(nn)',
    ast: o.LD_SP('n', 'n'),
  },
  0x7c: {
    name: 'NEG',
    ast: o.NEG(),
  },
  0xa0: {
    name: 'LDI',
    ast: o.LDI(),
  },
  0xa1: {
    name: 'CPI',
    ast: o.CPI(),
  },
  0xa2: {
    name: 'INI',
    ast: o.INI(),
  },
  0xa3: {
    name: 'OUTI',
    ast: o.OUTI(),
  },
  0xa8: {
    name: 'LDD',
    ast: o.LDD(),
  },
  0xab: {
    name: 'OUTD',
    ast: o.OUTD(),
  },
  0xb0: {
    name: 'LDIR',
    ast: o.LDIR(),
  },
  0xb1: {
    name: 'CPIR',
    ast: o.CPIR(),
  },
  0xb3: {
    name: 'OTIR',
    ast: o.OTIR(),
  },
  0xb8: {
    name: 'LDDR',
    ast: o.LDDR(),
  },
  0xbb: {
    name: 'OTDR',
    ast: o.OTDR(),
  },
};
