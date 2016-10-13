'use-strict'

const utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  const outAccum = utils.sum(outputs)

  // accumulators
  var bytesAccum = utils.transactionBytes([], outputs)
  var inAccum = 0
  var inputs = []

  for (var i = 0; i < utxos.length; ++i) {
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
  return { fee: fee }
}
