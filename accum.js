'use-strict'

const utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  // accumulators
  let bytesAccum = utils.transactionBytes([], outputs)
  let inAccum = 0
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]

    bytesAccum += utils.inputBytes(utxo)
    inAccum += utxo.value
    inputs.push(utxo)

    const fee = feeRate * bytesAccum

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  const fee = feeRate * bytesAccum
  return { fee }
}
