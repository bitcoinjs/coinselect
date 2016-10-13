'use-strict'

// baseline estimates, used to improve performance
const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 106
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25

function inputBytes () {
  return TX_INPUT_BASE + TX_INPUT_PUBKEYHASH
}

function outputBytes (output) {
  return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
}

function dustThreshold (output, feeRate) {
  /* ... classify the output for input estimate  */
  return inputBytes() * feeRate
}

function transactionBytes (inputs, outputs) {
  return TX_EMPTY_SIZE +
    inputs.reduce(function (a, x) { return a + inputBytes(x) }, 0) +
    outputs.reduce(function (a, x) { return a + outputBytes(x) }, 0)
}

function sum (range) {
  return range.reduce(function (a, x) { return a + x.value }, 0)
}

const BLANK_OUTPUT = outputBytes({})

function worthChange (inputs, outputs, feeRate) {
  const bytesAccum = transactionBytes(inputs, outputs)
  const fee = feeRate * (bytesAccum + BLANK_OUTPUT)
  const remainder = sum(inputs) - (sum(outputs) + fee)

  if (remainder <= dustThreshold({}, feeRate)) return null
  return { value: remainder }
}

function finalize (inputs, outputs, feeRate) {
  // was too much left over?
  const change = worthChange(inputs, outputs, feeRate)
  if (change) outputs = outputs.concat(change)

  return {
    inputs: inputs,
    outputs: outputs,
    fee: sum(inputs) - sum(outputs)
  }
}

module.exports = {
  dustThreshold: dustThreshold,
  finalize: finalize,
  inputBytes: inputBytes,
  outputBytes: outputBytes,
  transactionBytes: transactionBytes
}
