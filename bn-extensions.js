var BN = require('bn.js')
var slice = Array.prototype.slice

var BN_ZERO = new BN(0)
var BN_ONE = new BN(1)

function add () {
  var args = slice.call(arguments)
  return args.reduce(_add)
}

function _add (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return null
  return a.add(b)
}

function sub () {
  var args = slice.call(arguments)
  return args.reduce(_sub)
}

function _sub (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return null
  return a.sub(b)
}

function mul () {
  var args = slice.call(arguments)
  return args.reduce(_mul)
}

function _mul (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return null
  return a.mul(b)
}

function div () {
  var args = slice.call(arguments)
  return args.reduce(_div)
}

function _div (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return null
  if (b.isZero()) return null
  return a.div(b)
}

function isZero (v) {
  if (!BN.isBN(v)) return false
  return v.isZero()
}

function eq (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return false
  return a.eq(b)
}

function lt (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return false
  return a.lt(b)
}

function gt (a, b) {
  if (!BN.isBN(a) || !BN.isBN(b)) return false
  return a.gt(b)
}

module.exports = {
  mul: mul,
  div: div,
  add: add,
  sub: sub,
  isZero: isZero,
  eq: eq,
  lt: lt,
  gt: gt,
  BN_ZERO: BN_ZERO,
  BN_ONE: BN_ONE
}
