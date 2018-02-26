/* global o, opcodeTableCB, opcodeTableED, generateIndexTable, F_CARRY, F_PARITY, F_ZERO, F_SIGN */

'use strict';

var opcodeTable = [
  //0x00
  {
    name: 'NOP',
    ast: o.NOOP(),
  },
  //0x01
  {
    name: 'LD BC,nn',
    ast: o.LD16('b', 'c'),
  },
  //0x02
  {
    name: 'LD (BC),A',
    ast: o.LD_WRITE_MEM('b', 'c', 'a'),
  },
  //0x03
  {
    name: 'INC BC',
    ast: o.INC16('b', 'c'),
  },
  //0x04
  {
    name: 'INC B',
    ast: o.INC8('b'),
  },
  //0x05
  {
    name: 'DEC B',
    ast: o.DEC8('b'),
  },
  //0x06
  {
    name: 'LD B,n',
    ast: o.LD8('b'),
  },
  //0x07
  {
    name: 'RLCA',
    ast: o.RLCA(),
  },
  //0x08
  {
    name: "EX AF AF'",
    ast: o.EX_AF(),
  },
  //0x09
  {
    name: 'ADD HL,BC',
    ast: o.ADD16('h', 'l', 'b', 'c'),
  },
  //0x0A
  {
    name: 'LD A,(BC)',
    ast: o.LD8('a', 'b', 'c'),
  },
  //0x0B
  {
    name: 'DEC BC',
    ast: o.DEC16('b', 'c'),
  },
  //0x0C
  {
    name: 'INC C',
    ast: o.INC8('c'),
  },
  //0x0D
  {
    name: 'DEC C',
    ast: o.DEC8('c'),
  },
  //0x0E
  {
    name: 'LD C,n',
    ast: o.LD8('c'),
  },
  //0x0F
  {
    name: 'RRCA',
    ast: o.RRCA(),
  },
  //0x10
  {
    name: 'DJNZ (PC+e)',
    ast: o.DJNZ(),
  },
  //0x11
  {
    name: 'LD DE,nn',
    ast: o.LD16('d', 'e'),
  },
  //0x12
  {
    name: 'LD (DE),A',
    ast: o.LD_WRITE_MEM('d', 'e', 'a'),
  },
  //0x13
  {
    name: 'INC DE',
    ast: o.INC16('d', 'e'),
  },
  //0x14
  {
    name: 'INC D',
    ast: o.INC8('d'),
  },
  //0x15
  {
    name: 'DEC D',
    ast: o.DEC8('d'),
  },
  //0x16
  {
    name: 'LD D,n',
    ast: o.LD8('d'),
  },
  //0x17
  {
    name: 'RLA',
    ast: o.RLA(),
  },
  //0x18
  {
    name: 'JR (PC+e)',
    ast: o.JR(),
  },
  //0x19
  {
    name: 'ADD HL,DE',
    ast: o.ADD16('h', 'l', 'd', 'e'),
  },
  //0x1A
  {
    name: 'LD A,(DE)',
    ast: o.LD8('a', 'd', 'e'),
  },
  //0x1B
  {
    name: 'DEC DE',
    ast: o.DEC16('d', 'e'),
  },
  //0x1C
  {
    name: 'INC E',
    ast: o.INC8('e'),
  },
  //0x1D
  {
    name: 'DEC E',
    ast: o.DEC8('e'),
  },
  //0x1E
  {
    name: 'LD E,n',
    ast: o.LD8('e'),
  },
  //0x1F
  {
    name: 'RRA',
    ast: o.RRA(),
  },
  //0x20
  {
    name: 'JR NZ,(PC+e)',
    ast: o.JRNZ(),
  },
  //0x21
  {
    name: 'LD HL,nn',
    ast: o.LD16('h', 'l'),
  },
  //0x22
  {
    name: 'LD (nn),HL',
    ast: o.LD_NN('h', 'l'),
  },
  //0x23
  {
    name: 'INC HL',
    ast: o.INC16('h', 'l'),
  },
  //0x24
  {
    name: 'INC H',
    ast: o.INC8('h'),
  },
  //0x25
  {
    name: 'DEC H',
    ast: o.DEC8('h'),
  },
  //0x26
  {
    name: 'LD H,n',
    ast: o.LD8('h'),
  },
  //0x27
  {
    name: 'DAA',
    ast: o.DAA(),
  },
  //0x28
  {
    name: 'JR Z,(PC+e)',
    ast: o.JRZ(),
  },
  //0x29
  {
    name: 'ADD HL,HL',
    ast: o.ADD16('h', 'l', 'h', 'l'),
  },
  //0x2A
  {
    name: 'LD HL,(nn)',
    ast: o.LD16('h', 'l', 'n', 'n'),
  },
  //0x2B
  {
    name: 'DEC HL',
    ast: o.DEC16('h', 'l'),
  },
  //0x2C
  {
    name: 'INC L',
    ast: o.INC8('l'),
  },
  //0x2D
  {
    name: 'DEC L',
    ast: o.DEC8('l'),
  },
  //0x2E
  {
    name: 'LD L,n',
    ast: o.LD8('l'),
  },
  //0x2F
  {
    name: 'CPL',
    ast: o.CPL(),
  },
  //0x30
  {
    name: 'JR NC,(PC+e)',
    ast: o.JRNC(),
  },
  //0x31
  {
    name: 'LD SP,nn',
    ast: o.LD_SP(),
  },
  //0x32
  {
    name: 'LD (nn),A',
    ast: o.LD_WRITE_MEM('n', 'n', 'a'),
  },
  //0x33
  {
    name: 'INC SP',
    ast: o.INC8('s', 'p'),
  },
  //0x34
  {
    name: 'INC (HL)',
    ast: o.INC8('h', 'l'),
  },
  //0x35
  {
    name: 'DEC (HL)',
    ast: o.DEC8('h', 'l'),
  },
  //0x36
  {
    name: 'LD (HL),n',
    ast: o.LD_WRITE_MEM('h', 'l'),
  },
  //0x37
  {
    name: 'SCF',
    ast: o.SCF(),
  },
  //0x38
  {
    name: 'JR C,(PC+e)',
    ast: o.JRC(),
  },
  //0x39
  {
    name: 'ADD HL,SP',
    ast: o.ADD16('h', 'l', 'sp'),
  },
  //0x3A
  {
    name: 'LD A,(nn)',
    ast: o.LD8('a', 'n', 'n'),
  },
  //0x3B
  {
    name: 'DEC SP',
    ast: o.DEC8('s', 'p'),
  },
  //0x3C
  {
    name: 'INC A',
    ast: o.INC8('a'),
  },
  //0x3D
  {
    name: 'DEC A',
    ast: o.DEC8('a'),
  },
  //0x3E
  {
    name: 'LD A,n',
    ast: o.LD8('a'),
  },
  //0x3F
  {
    name: 'CCF',
    ast: o.CCF(),
  },
  //0x40
  {
    name: 'LD B,B',
    ast: o.NOOP(),
  },
  //0x41
  {
    name: 'LD B,C',
    ast: o.LD8('b', 'c'),
  },
  //0x42
  {
    name: 'LD B,D',
    ast: o.LD8('b', 'd'),
  },
  //0x43
  {
    name: 'LD B,E',
    ast: o.LD8('b', 'e'),
  },
  //0x44
  {
    name: 'LD B,H',
    ast: o.LD8('b', 'h'),
  },
  //0x45
  {
    name: 'LD B,L',
    ast: o.LD8('b', 'l'),
  },
  //0x46
  {
    name: 'LD B,(HL)',
    ast: o.LD8('b', 'h', 'l'),
  },
  //0x47
  {
    name: 'LD B,A',
    ast: o.LD8('b', 'a'),
  },
  //0x48
  {
    name: 'LD C,B',
    ast: o.LD8('c', 'b'),
  },
  //0x49
  {
    name: 'LD C,C',
    ast: o.NOOP(),
  },
  //0x4A
  {
    name: 'LD C,D',
    ast: o.LD8('c', 'd'),
  },
  //0x4B
  {
    name: 'LD C,E',
    ast: o.LD8('c', 'e'),
  },
  //0x4C
  {
    name: 'LD C,H',
    ast: o.LD8('c', 'h'),
  },
  //0x4D
  {
    name: 'LD C,L',
    ast: o.LD8('c', 'l'),
  },
  //0x4E
  {
    name: 'LD C,(HL)',
    ast: o.LD8('c', 'h', 'l'),
  },
  //0x4F
  {
    name: 'LD C,A',
    ast: o.LD8('c', 'a'),
  },
  //0x50
  {
    name: 'LD D,B',
    ast: o.LD8('d', 'b'),
  },
  //0x51
  {
    name: 'LD D,C',
    ast: o.LD8('d', 'c'),
  },
  //0x52
  {
    name: 'LD D,D',
    ast: o.NOOP(),
  },
  //0x53
  {
    name: 'LD D,E',
    ast: o.LD8('d', 'e'),
  },
  //0x54
  {
    name: 'LD D,H',
    ast: o.LD8('d', 'h'),
  },
  //0x55
  {
    name: 'LD D,L',
    ast: o.LD8('d', 'l'),
  },
  //0x56
  {
    name: 'LD D,(HL)',
    ast: o.LD8('d', 'h', 'l'),
  },
  //0x57
  {
    name: 'LD D,A',
    ast: o.LD8('d', 'a'),
  },
  //0x58
  {
    name: 'LD E,B',
    ast: o.LD8('e', 'b'),
  },
  //0x59
  {
    name: 'LD E,C',
    ast: o.LD8('e', 'c'),
  },
  //0x5A
  {
    name: 'LD E,D',
    ast: o.LD8('e', 'd'),
  },
  //0x5B
  {
    name: 'LD E,E',
    ast: o.NOOP(),
  },
  //0x5C
  {
    name: 'LD E,H',
    ast: o.LD8('e', 'h'),
  },
  //0x5D
  {
    name: 'LD E,L',
    ast: o.LD8('e', 'l'),
  },
  //0x5E
  {
    name: 'LD E,(HL)',
    ast: o.LD8('e', 'h', 'l'),
  },
  //0x5F
  {
    name: 'LD E,A',
    ast: o.LD8('e', 'a'),
  },
  //0x60
  {
    name: 'LD H,B',
    ast: o.LD8('h', 'b'),
  },
  //0x61
  {
    name: 'LD H,C',
    ast: o.LD8('h', 'c'),
  },
  //0x62
  {
    name: 'LD H,D',
    ast: o.LD8('h', 'd'),
  },
  //0x63
  {
    name: 'LD H,E',
    ast: o.LD8('h', 'e'),
  },
  //0x64
  {
    name: 'LD H,H',
    ast: o.NOOP(),
  },
  //0x65
  {
    name: 'LD H,L',
    ast: o.LD8('h', 'l'),
  },
  //0x66
  {
    name: 'LD H,(HL)',
    ast: o.LD8('h', 'h', 'l'),
  },
  //0x67
  {
    name: 'LD H,A',
    ast: o.LD8('h', 'a'),
  },
  //0x68
  {
    name: 'LD L,B',
    ast: o.LD8('l', 'b'),
  },
  //0x69
  {
    name: 'LD L,C',
    ast: o.LD8('l', 'c'),
  },
  //0x6A
  {
    name: 'LD L,D',
    ast: o.LD8('l', 'd'),
  },
  //0x6B
  {
    name: 'LD L,E',
    ast: o.LD8('l', 'e'),
  },
  //0x6C
  {
    name: 'LD L,H',
    ast: o.LD8('l', 'h'),
  },
  //0x6D
  {
    name: 'LD L,L',
    ast: o.NOOP(),
  },
  //0x6E
  {
    name: 'LD L,(HL)',
    ast: o.LD8('l', 'h', 'l'),
  },
  //0x6F
  {
    name: 'LD L,A',
    ast: o.LD8('l', 'a'),
  },
  //0x70
  {
    name: 'LD (HL),B',
    ast: o.LD_WRITE_MEM('h', 'l', 'b'),
  },
  //0x71
  {
    name: 'LD (HL),C',
    ast: o.LD_WRITE_MEM('h', 'l', 'c'),
  },
  //0x72
  {
    name: 'LD (HL),D',
    ast: o.LD_WRITE_MEM('h', 'l', 'd'),
  },
  //0x73
  {
    name: 'LD (HL),E',
    ast: o.LD_WRITE_MEM('h', 'l', 'e'),
  },
  //0x74
  {
    name: 'LD (HL),H',
    ast: o.LD_WRITE_MEM('h', 'l', 'h'),
  },
  //0x75
  {
    name: 'LD (HL),L',
    ast: o.LD_WRITE_MEM('h', 'l', 'l'),
  },
  //0x76
  {
    name: 'HALT',
    ast: o.HALT(),
  },
  //0x77
  {
    name: 'LD (HL),A',
    ast: o.LD_WRITE_MEM('h', 'l', 'a'),
  },
  //0x78
  {
    name: 'LD A,B',
    ast: o.LD8('a', 'b'),
  },
  //0x79
  {
    name: 'LD A,C',
    ast: o.LD8('a', 'c'),
  },
  //0x7A
  {
    name: 'LD A,D',
    ast: o.LD8('a', 'd'),
  },
  //0x7B
  {
    name: 'LD A,E',
    ast: o.LD8('a', 'e'),
  },
  //0x7C
  {
    name: 'LD A,H',
    ast: o.LD8('a', 'h'),
  },
  //0x7D
  {
    name: 'LD A,L',
    ast: o.LD8('a', 'l'),
  },
  //0x7E
  {
    name: 'LD A,(HL)',
    ast: o.LD8('a', 'h', 'l'),
  },
  //0x7F
  {
    name: 'LD A,A',
    ast: o.NOOP(),
  },
  //0x80
  {
    name: 'ADD A,B',
    ast: o.ADD('b'),
  },
  //0x81
  {
    name: 'ADD A,C',
    ast: o.ADD('c'),
  },
  //0x82
  {
    name: 'ADD A,D',
    ast: o.ADD('d'),
  },
  //0x83
  {
    name: 'ADD A,E',
    ast: o.ADD('e'),
  },
  //0x84
  {
    name: 'ADD A,H',
    ast: o.ADD('h'),
  },
  //0x85
  {
    name: 'ADD A,L',
    ast: o.ADD('l'),
  },
  //0x86
  {
    name: 'ADD A,(HL)',
    ast: o.ADD('h', 'l'),
  },
  //0x87
  {
    name: 'ADD A,A',
    ast: o.ADD('a'),
  },
  //0x88
  {
    name: 'ADC A,B',
    ast: o.ADC('b'),
  },
  //0x89
  {
    name: 'ADC A,C',
    ast: o.ADC('c'),
  },
  //0x8A
  {
    name: 'ADC A,D',
    ast: o.ADC('d'),
  },
  //0x8B
  {
    name: 'ADC A,E',
    ast: o.ADC('e'),
  },
  //0x8C
  {
    name: 'ADC A,H',
    ast: o.ADC('h'),
  },
  //0x8D
  {
    name: 'ADC A,L',
    ast: o.ADC('l'),
  },
  //0x8E
  {
    name: 'ADC A,(HL)',
    ast: o.ADC('h', 'l'),
  },
  //0x8F
  {
    name: 'ADC A,A',
    ast: o.ADC('a'),
  },
  //0x90
  {
    name: 'SUB A,B',
    ast: o.SUB('b'),
  },
  //0x91
  {
    name: 'SUB A,C',
    ast: o.SUB('c'),
  },
  //0x92
  {
    name: 'SUB A,D',
    ast: o.SUB('d'),
  },
  //0x93
  {
    name: 'SUB A,E',
    ast: o.SUB('e'),
  },
  //0x94
  {
    name: 'SUB A,H',
    ast: o.SUB('h'),
  },
  //0x95
  {
    name: 'SUB A,L',
    ast: o.SUB('l'),
  },
  //0x96
  {
    name: 'SUB A,(HL)',
    ast: o.SUB('h', 'l'),
  },
  //0x97
  {
    name: 'SUB A,A',
    ast: o.SUB('a'),
  },
  //0x98
  {
    name: 'SBC A,B',
    ast: o.SBC('b'),
  },
  //0x99
  {
    name: 'SBC A,C',
    ast: o.SBC('c'),
  },
  //0x9A
  {
    name: 'SBC A,D',
    ast: o.SBC('d'),
  },
  //0x9B
  {
    name: 'SBC A,E',
    ast: o.SBC('e'),
  },
  //0x9C
  {
    name: 'SBC A,H',
    ast: o.SBC('h'),
  },
  //0x9D
  {
    name: 'SBC A,L',
    ast: o.SBC('l'),
  },
  //0x9E
  {
    name: 'SBC A,(HL)',
    ast: o.SBC('h', 'l'),
  },
  //0x9F
  {
    name: 'SBC A,A',
    ast: o.SBC('a'),
  },
  //0xA0
  {
    name: 'AND A,B',
    ast: o.AND('b'),
  },
  //0xA1
  {
    name: 'AND A,C',
    ast: o.AND('c'),
  },
  //0xA2
  {
    name: 'AND A,D',
    ast: o.AND('d'),
  },
  //0xA3
  {
    name: 'AND A,E',
    ast: o.AND('e'),
  },
  //0xA4
  {
    name: 'AND A,H',
    ast: o.AND('h'),
  },
  //0xA5
  {
    name: 'AND A,L',
    ast: o.AND('l'),
  },
  //0xA6
  {
    name: 'AND A,(HL)',
    ast: o.AND('h', 'l'),
  },
  //0xA7
  {
    name: 'AND A,A',
    ast: o.AND('a'),
  },
  //0xA8
  {
    name: 'XOR A,B',
    ast: o.XOR('b'),
  },
  //0xA9
  {
    name: 'XOR A,C',
    ast: o.XOR('c'),
  },
  //0xAA
  {
    name: 'XOR A,D',
    ast: o.XOR('d'),
  },
  //0xAB
  {
    name: 'XOR A,E',
    ast: o.XOR('e'),
  },
  //0xAC
  {
    name: 'XOR A,H',
    ast: o.XOR('h'),
  },
  //0xAD
  {
    name: 'XOR A,L',
    ast: o.XOR('l'),
  },
  //0xAE
  {
    name: 'XOR A,(HL)',
    ast: o.XOR('h', 'l'),
  },
  //0xAF
  {
    name: 'XOR A,A',
    ast: o.XOR('a'),
  },
  //0xB0
  {
    name: 'OR A,B',
    ast: o.OR('b'),
  },
  //0xB1
  {
    name: 'OR A,C',
    ast: o.OR('c'),
  },
  //0xB2
  {
    name: 'OR A,D',
    ast: o.OR('d'),
  },
  //0xB3
  {
    name: 'OR A,E',
    ast: o.OR('e'),
  },
  //0xB4
  {
    name: 'OR A,H',
    ast: o.OR('h'),
  },
  //0xB5
  {
    name: 'OR A,L',
    ast: o.OR('l'),
  },
  //0xB6
  {
    name: 'OR A,(HL)',
    ast: o.OR('h', 'l'),
  },
  //0xB7
  {
    name: 'OR A,A',
    ast: o.OR('a'),
  },
  //0xB8
  {
    name: 'CP A,B',
    ast: o.CP('b'),
  },
  //0xB9
  {
    name: 'CP A,C',
    ast: o.CP('c'),
  },
  //0xBA
  {
    name: 'CP A,D',
    ast: o.CP('d'),
  },
  //0xBB
  {
    name: 'CP A,E',
    ast: o.CP('e'),
  },
  //0xBC
  {
    name: 'CP A,H',
    ast: o.CP('h'),
  },
  //0xBD
  {
    name: 'CP A,L',
    ast: o.CP('l'),
  },
  //0xBE
  {
    name: 'CP A,(HL)',
    ast: o.CP('h', 'l'),
  },
  //0xBF
  {
    name: 'CP A,A',
    ast: o.CP('a'),
  },
  //0xC0
  {
    name: 'RET NZ',
    ast: o.RET('===', F_ZERO),
  },
  //0xC1
  {
    name: 'POP BC',
    ast: o.POP('b', 'c'),
  },
  //0xC2
  {
    name: 'JP NZ,(nn)',
    ast: o.JP('===', F_ZERO),
  },
  //0xC3
  {
    name: 'JP (nn)',
    ast: o.JP(),
  },
  //0xC4
  {
    name: 'CALL NZ (nn)',
    ast: o.CALL('===', F_ZERO),
  },
  //0xC5
  {
    name: 'PUSH BC',
    ast: o.PUSH('b', 'c'),
  },
  //0xC6
  {
    name: 'ADD A,n',
    ast: o.ADD(),
  },
  //0xC7
  {
    name: 'RST 0x00',
    ast: o.RST(0x00),
  },
  //0xC8
  {
    name: 'RET Z',
    ast: o.RET('!==', F_ZERO),
  },
  //0xC9
  {
    name: 'RET',
    ast: o.RET(),
  },
  //0xCA
  {
    name: 'JP Z,(nn)',
    ast: o.JP('!==', F_ZERO),
  },
  //0xCB
  opcodeTableCB,
  //0xCC
  {
    name: 'CALL Z (nn)',
    ast: o.CALL('!==', F_ZERO),
  },
  //0xCD
  {
    name: 'CALL (nn)',
    ast: o.CALL(),
  },
  //0xCE
  {
    name: 'ADC A,n',
    ast: o.ADC(),
  },
  //0xCF
  {
    name: 'RST 0x08',
    ast: o.RST(0x08),
  },
  //0xD0
  {
    name: 'RET NC',
    ast: o.RET('===', F_CARRY),
  },
  //0xD1
  {
    name: 'POP DE',
    ast: o.POP('d', 'e'),
  },
  //0xD2
  {
    name: 'JP NC,(nn)',
    ast: o.JP('===', F_CARRY),
  },
  //0xD3
  {
    name: 'OUT (n),A',
    ast: o.OUT('a'),
  },
  //0xD4
  {
    name: 'CALL NC (nn)',
    ast: o.CALL('===', F_CARRY),
  },
  //0xD5
  {
    name: 'PUSH DE',
    ast: o.PUSH('d', 'e'),
  },
  //0xD6
  {
    name: 'SUB n',
    ast: o.SUB(),
  },
  //0xD7
  {
    name: 'RST 0x10',
    ast: o.RST(0x10),
  },
  //0xD8
  {
    name: 'RET C',
    ast: o.RET('!==', F_CARRY),
  },
  //0xD9
  {
    name: 'EXX',
    ast: o.EXX(),
  },
  //0xDA
  {
    name: 'JP C,(nn)',
    ast: o.JP('!==', F_CARRY),
  },
  //0xDB
  {
    name: 'IN A,(n)',
    ast: o.IN('a'),
  },
  //0xDC
  {
    name: 'CALL C (nn)',
    ast: o.CALL('!==', F_CARRY),
  },
  //0xDD
  generateIndexTable('IX'),
  //0xDE
  {
    name: 'SBC A,n',
    ast: o.SBC(),
  },
  //0xDF
  {
    name: 'RST 0x18',
    ast: o.RST(0x18),
  },
  //0xE0
  {
    name: 'RET PO',
    ast: o.RET('===', F_PARITY),
  },
  //0xE1
  {
    name: 'POP HL',
    ast: o.POP('h', 'l'),
  },
  //0xE2
  {
    name: 'JP PO,(nn)',
    ast: o.JP('===', F_PARITY),
  },
  //0xE3
  {
    name: 'EX (SP),HL',
    ast: o.EX_SP_HL(),
  },
  //0xE4
  {
    name: 'CALL PO (nn)',
    ast: o.CALL('===', F_PARITY),
  },
  //0xE5
  {
    name: 'PUSH HL',
    ast: o.PUSH('h', 'l'),
  },
  //0xE6
  {
    name: 'AND (n)',
    ast: o.AND(),
  },
  //0xE7
  {
    name: 'RST 0x20',
    ast: o.RST(0x20),
  },
  //0xE8
  {
    name: 'RET PE',
    ast: o.RET('!==', F_PARITY),
  },
  //0xE9
  {
    name: 'JP (HL)',
    ast: o.JP('h', 'l'),
  },
  //0xEA
  {
    name: 'JP PE,(nn)',
    ast: o.JP('!==', F_PARITY),
  },
  //0xEB
  {
    name: 'EX DE,HL',
    ast: o.EX_DE_HL(),
  },
  //0xEC
  {
    name: 'CALL PE (nn)',
    ast: o.CALL('!==', F_PARITY),
  },
  //0xED
  opcodeTableED,
  //0xEE
  {
    name: 'XOR n',
    ast: o.XOR(),
  },
  //0xEF
  {
    name: 'RST 0x28',
    ast: o.RST(0x28),
  },
  //0xF0
  {
    name: 'RET P',
    ast: o.RET('===', F_SIGN),
  },
  //0xF1
  {
    name: 'POP AF',
    ast: o.POP('a', 'f'),
  },
  //0xF2
  {
    name: 'JP P,(nn)',
    ast: o.JP('===', F_SIGN),
  },
  //0xF3
  {
    name: 'DI',
    ast: o.DI(),
  },
  //0xF4
  {
    name: 'CALL P (nn)',
    ast: o.CALL('===', F_SIGN),
  },
  //0xF5
  {
    name: 'PUSH AF',
    ast: o.PUSH('a', 'f'),
  },
  //0xF6
  {
    name: 'OR n',
    ast: o.OR(),
  },
  //0xF7
  {
    name: 'RST 0x30',
    ast: o.RST(0x30),
  },
  //0xF8
  {
    name: 'RET M',
    ast: o.RET('!==', F_SIGN),
  },
  //0xF9
  {
    name: 'LD SP,HL',
    ast: o.LD_SP('h', 'l'),
  },
  //0xFA
  {
    name: 'JP M,(nn)',
    ast: o.JP('!==', F_SIGN),
  },
  //0xFB
  {
    name: 'EI',
    ast: o.EI(),
  },
  //0xFC
  {
    name: 'CALL M (nn)',
    ast: o.CALL('!==', F_SIGN),
  },
  //0xFD
  generateIndexTable('IY'),
  //0xFE
  {
    name: 'CP n',
    ast: o.CP(),
  },
  //0xFF
  {
    name: 'RST 0x38',
    ast: o.RST(0x38),
  },
];
