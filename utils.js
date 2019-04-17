var BN = require('bn.js')
var ext = require('./bn-extensions')

// baseline estimates, used to improve performance
var TX_BASE_SIZE = new BN(10)

var TX_INPUT_SIZE = {
  LEGACY: new BN(148),
  P2SH: new BN(92),
  BECH32: new BN(69)
}

var TX_OUTPUT_SIZE = {
  LEGACY: new BN(34),
  P2SH: new BN(32),
  BECH32: new BN(31)
}

function inputBytes (input) {
  return TX_INPUT_SIZE[input.type] || TX_INPUT_SIZE.LEGACY
}

function outputBytes (output) {
  return TX_OUTPUT_SIZE[output.type] || TX_OUTPUT_SIZE.LEGACY
}

function dustThreshold (output, feeRate) {
  /* ... classify the output for input estimate  */
  return ext.mul(inputBytes({}), feeRate)
}

function transactionBytes (inputs, outputs) {
  return TX_BASE_SIZE
    .add(inputs.reduce(function (a, x) {
      return ext.add(a, inputBytes(x))
    }, ext.BN_ZERO))
    .add(outputs.reduce(function (a, x) {
      return ext.add(a, outputBytes(x))
    }, ext.BN_ZERO))
}

function uintOrNull (v) {
  if (!BN.isBN(v)) return null
  if (v.isNeg()) return null
  return v
}

function sumForgiving (range) {
  return range.reduce(function (a, x) {
    var valueOrZero = BN.isBN(x.value) ? x.value : ext.BN_ZERO
    return ext.add(a, valueOrZero)
  },
  ext.BN_ZERO)
}

function sumOrNaN (range) {
  return range.reduce(function (a, x) {
    return ext.add(a, uintOrNull(x.value))
  }, ext.BN_ZERO)
}

var BLANK_OUTPUT = outputBytes({})

function finalize (inputs, outputs, feeRate) {
  var bytesAccum = transactionBytes(inputs, outputs)
  var feeAfterExtraOutput = ext.mul(feeRate, ext.add(bytesAccum, BLANK_OUTPUT))
  var remainderAfterExtraOutput = ext.sub(sumOrNaN(inputs), ext.add(sumOrNaN(outputs), feeAfterExtraOutput))

  // is it worth a change output?
  if (ext.gt(remainderAfterExtraOutput, dustThreshold({}, feeRate))) {
    outputs = outputs.concat({ value: remainderAfterExtraOutput })
  }

  var fee = ext.sub(sumOrNaN(inputs), sumOrNaN(outputs))
  if (!fee) return { fee: ext.mul(feeRate, bytesAccum) }

  return {
    inputs: inputs,
    outputs: outputs,
    fee: fee
  }
}

module.exports = {
  dustThreshold: dustThreshold,
  finalize: finalize,
  inputBytes: inputBytes,
  outputBytes: outputBytes,
  sumOrNaN: sumOrNaN,
  sumForgiving: sumForgiving,
  transactionBytes: transactionBytes,
  uintOrNull: uintOrNull
}
