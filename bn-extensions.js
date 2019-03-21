var BN = require('bn.js')

var BN_ZERO = new BN(0)
var BN_ONE = new BN(1)

function mul (multiplicand, multiplier) {
  if (!BN.isBN(multiplicand) || !BN.isBN(multiplier)) return NaN

  return multiplicand.mul(multiplier)
}

function div (dividend, divisor) {
  if (!BN.isBN(dividend) || !BN.isBN(divisor)) return NaN
  if (divisor.cmp(BN_ZERO) === 0) return Infinity

  return dividend.div(divisor)
}

function add (arg1, arg2, arg3) {
  // Add two items
  if (!BN.isBN(arg1) || !BN.isBN(arg2)) return NaN
  if (typeof arg3 === 'undefined') return arg1.add(arg2)

  // Add three items
  if (!BN.isBN(arg3)) return NaN
  return arg1.add(arg2).add(arg3)
}

function sub (arg1, arg2, arg3) {
  // Subtract two items
  if (!BN.isBN(arg1) || !BN.isBN(arg2)) return NaN
  if (typeof arg3 === 'undefined') return arg1.sub(arg2)

  // Subtract three items
  if (!BN.isBN(arg3)) return NaN
  return arg1.sub(arg2).sub(arg3)
}

function shrn (argument, shiftBy) {
  if (!BN.isBN(argument)) return NaN
  if (BN.isBN(shiftBy)) shiftBy = shiftBy.toNumber()
  if (typeof shiftBy !== 'number') return NaN

  return argument.shrn(shiftBy)
}

function isZero (argument) {
  if (!BN.isBN(argument)) return false
  if (argument.cmp(BN_ZERO) === 0) return true
  return false
}

function lt (subject, argument) {
  if (!BN.isBN(argument) || !BN.isBN(subject)) return false
  return subject.lt(argument)
}

function gt (subject, argument) {
  if (!BN.isBN(argument) || !BN.isBN(subject)) return false
  return subject.gt(argument)
}

module.exports = {
  mul: mul,
  div: div,
  add: add,
  sub: sub,
  shrn: shrn,
  isZero: isZero,
  lt: lt,
  gt: gt,
  BN_ZERO: BN_ZERO,
  BN_ONE: BN_ONE
}
