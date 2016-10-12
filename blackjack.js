const utils = require('./utils')

// O(n * n)
module.exports = function blackjack (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)
  const threshold = utils.dustThreshold({}, feeRate)

  let inAccum = 0
  let bytesAccum = utils.transactionBytes([], outputs)

  // accumulate inputs until we bust
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]
    const bytesAfter = utils.inputBytes(utxo)
    const feeAfter = feeRate * (bytesAccum + bytesAfter)

    // are we wasting value?
    if (inAccum + utxo.value > outAccum + feeAfter + threshold) continue

    inAccum += utxo.value
    bytesAccum += bytesAfter
    inputs.push(utxo)

    // go again?
    if (inAccum < outAccum + feeAfter) continue

    const fee = inAccum - outAccum
    return { inputs, outputs, fee }
  }

  return {
    fee: feeRate * utils.transactionBytes(inputs, outputs)
  }
}
