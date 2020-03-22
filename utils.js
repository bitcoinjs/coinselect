// baseline estimates, used to improve performance
var TX_EMPTY_SIZE = 4 + 1 + 1 + 4
var TX_INPUT_BASE = 32 + 4 + 1 + 4
var TX_OUTPUT_BASE = 8 + 1

function inputBytes (input) {
  return TX_INPUT_BASE + input.script.length
}

function outputBytes (output) {
  return TX_OUTPUT_BASE + output.script.length
}

function dustThreshold (feeRate, inputLenghtEstimate) {
  return inputBytes({ script: { length: inputLenghtEstimate } }) * feeRate
}

function transactionBytes (inputs, outputs) {
  return TX_EMPTY_SIZE +
    inputs.reduce(function (a, x) { return a + inputBytes(x) }, 0) +
    outputs.reduce(function (a, x) { return a + outputBytes(x) }, 0)
}

function uintOrNaN (v) {
  if (typeof v !== 'number') return NaN
  if (!isFinite(v)) return NaN
  if (Math.floor(v) !== v) return NaN
  if (v < 0) return NaN
  return v
}

function sumForgiving (range) {
  return range.reduce(function (a, x) { return a + (isFinite(x.value) ? x.value : 0) }, 0)
}

function sumOrNaN (range) {
  return range.reduce(function (a, x) { return a + uintOrNaN(x.value) }, 0)
}

function finalize (inputs, outputs, feeRate, options) {
  var bytesAccum = transactionBytes(inputs, outputs)
  var blankOutputBytes = outputBytes({ script: { length: options.changeOutputLength } })
  var feeAfterExtraOutput = feeRate * (bytesAccum + blankOutputBytes)
  var remainderAfterExtraOutput = sumOrNaN(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput)

  // is it worth a change output?
  if (remainderAfterExtraOutput > dustThreshold(feeRate, options.changeInputLengthEstimate)) {
    outputs = outputs.concat({ value: remainderAfterExtraOutput, script: { length: options.changeOutputLength } })
  }

  var fee = sumOrNaN(inputs) - sumOrNaN(outputs)
  if (!isFinite(fee)) return { fee: feeRate * bytesAccum }

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
  uintOrNaN: uintOrNaN
}
