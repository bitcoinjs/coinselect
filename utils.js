var BN = require('bn.js')
const BN_ZERO = new BN(0)
const BN_ONE = new BN(1)

// baseline estimates, used to improve performance
var TX_BASE_SIZE = new BN('10')

var TX_INPUT_SIZE = {
  LEGACY: new BN('148'),
  P2SH: new BN('92'),
  BECH32: new BN('69')
}

var TX_OUTPUT_SIZE = {
  LEGACY: new BN('34'),
  P2SH: new BN('32'),
  BECH32: new BN('31')
}

function inputBytes (input) {
  return TX_INPUT_SIZE[input.type] || TX_INPUT_SIZE.LEGACY
}

function outputBytes (output) {
  return TX_OUTPUT_SIZE[output.type] || TX_OUTPUT_SIZE.LEGACY
}

function dustThreshold (output, feeRate) {
  /* ... classify the output for input estimate  */
  if (!BN.isBN(feeRate)) return NaN
  return inputBytes({}).mul(feeRate)
}

function transactionBytes (inputs, outputs) {
  return TX_BASE_SIZE
    .add(inputs.reduce(function (a, x) {
      return a.add(inputBytes(x))
    }, BN_ZERO))
    .add(outputs.reduce(function (a, x) {
      return a.add(outputBytes(x))
    }, BN_ZERO))
}

function bnOrNaN (v) {
  if (isNaN(v)) return NaN
  if (!BN.isBN(v)) return NaN
  if (v.isNeg()) return NaN
  return v
}

function sumForgiving (range) {
  return range.reduce(function (a, x) {
    return a.add((BN.isBN(x.value) ? x.value : BN_ZERO))
  },
  BN_ZERO)
}

function sumOrNaN (range) {
  return range.reduce(function (a, x) {
    var result = bnOrNaN(x.value)
    if (isNaN(result)) return NaN
    return a.add(result)
  }, BN_ZERO)
}

var BLANK_OUTPUT = outputBytes({})

function finalize (inputs, outputs, feeRate) {
  var remainderAfterExtraOutput = NaN
  var feeAfterExtraOutput = NaN
  var fee = NaN

  var bytesAccum = transactionBytes(inputs, outputs)

  // convert to BN or NaN
  if (BN.isBN(feeRate)) feeAfterExtraOutput = feeRate.mul((bytesAccum.add(BLANK_OUTPUT)))
  else feeAfterExtraOutput = NaN

  var inputSumOrNaN = sumOrNaN(inputs)
  var outputSumOrNaN = sumOrNaN(outputs)
  var dustThresholdOrNaN = dustThreshold({}, feeRate)

  if (!isNaN(inputSumOrNaN) && !isNaN(outputSumOrNaN) && !isNaN(feeAfterExtraOutput)) {
    remainderAfterExtraOutput = inputSumOrNaN.sub(outputSumOrNaN.add(feeAfterExtraOutput))
  }
  // is it worth a change output?
  if (!isNaN(dustThresholdOrNaN) && !isNaN(remainderAfterExtraOutput) && remainderAfterExtraOutput.gt(dustThresholdOrNaN)) {
    outputs = outputs.concat({
      value: remainderAfterExtraOutput
    })
    outputSumOrNaN = sumOrNaN(outputs) // recalculate
  }

  fee = (!isNaN(inputSumOrNaN) && !isNaN(outputSumOrNaN)) ? inputSumOrNaN.sub(outputSumOrNaN) : NaN

  if (isNaN(fee)) {
    return {
      fee: feeRate.mul(bytesAccum)
    }
  }

  return {
    inputs: inputs,
    outputs: outputs,
    fee: fee
  }
}

module.exports = {
  dustThresholdOrNan: dustThreshold,
  finalize: finalize,
  inputBytes: inputBytes,
  outputBytes: outputBytes,
  sumOrNaN: sumOrNaN,
  sumForgiving: sumForgiving,
  transactionBytes: transactionBytes,
  bnOrNaN: bnOrNaN,
  BN_ONE: BN_ONE,
  BN_ZERO: BN_ZERO
}
