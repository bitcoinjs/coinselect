let utils = require('./utils')
let fDustThreshold = utils.dustThreshold
let fInputBytes = utils.inputBytes
let fOutputBytes = utils.outputBytes
let fTransactionBytes = utils.transactionBytes
let DEFAULT_OPTIONS = {
  comparator: (a, b) => b.value - a.value
}

module.exports = function select (utxos, outputs, feeRate, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  let orderedInputs = utxos.concat().sort(options.comparator)
  let inAccum = 0
  let bytesAccum = fTransactionBytes([], outputs)
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  let i = 0
  while (i < orderedInputs.length) {
    const input = orderedInputs[i]

    inAccum += input.value
    bytesAccum += fInputBytes(input)

    const fee = feeRate * bytesAccum
    if (inAccum >= (outAccum + fee)) break

    ++i
  }

  // did we bust?
  const fee = feeRate * bytesAccum
  if (inAccum < (outAccum + fee)) return { fee }

  const inputs = orderedInputs.slice(0, i + 1)

  // is it worth an extra output [for change]?
  const feeExtra = feeRate * (bytesAccum + fOutputBytes({}))
  const changeAccum = inAccum - outAccum - feeExtra

  if (changeAccum > fDustThreshold({}, feeRate)) {
    outputs.push({ value: changeAccum })

    return { inputs, outputs, fee: feeExtra }
  }

  // ignore it
  const feeFinal = inAccum - outAccum
  return { inputs, outputs, fee: feeFinal }
}
