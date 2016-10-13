'use-strict'

const utils = require('./utils')

// O(n * n)
module.exports = function blackjack (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)
  const threshold = utils.dustThreshold({}, feeRate)

  // accumulate inputs until we bust
  let inAccum = 0
  let bytesAccum = utils.transactionBytes([], outputs)
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const input = utxos[i]
    const inputBytes = utils.inputBytes(input)
    const fee = feeRate * (bytesAccum + inputBytes)

    // would it waste value?
    if ((inAccum + input.value) > (outAccum + fee + threshold)) continue

    bytesAccum += inputBytes
    inAccum += input.value
    inputs.push(input)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  const fee = feeRate * bytesAccum
  return { fee }
}
