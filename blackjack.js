let utils = require('./utils')

// O(n * n)
module.exports = function blackjack (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)
  const threshold = utils.dustThreshold({}, feeRate)

  let inAccum = 0
  let bytesAccum = utils.transactionBytes([], outputs)

  // accumulate inputs unless we bust
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]
    const inputBytes = utils.inputBytes(utxo)
    const fee = feeRate * (bytesAccum + inputBytes)
    const needed = outAccum + fee

    // would we bust?
    if (inAccum + utxo.value > needed + threshold) continue

    inAccum += utxo.value
    bytesAccum += inputBytes
    inputs.push(utxo)

    // go again?
    if (inAccum < needed) continue

    return { inputs, outputs, fee }
  }

  return {
    fee: feeRate * utils.transactionBytes(inputs, outputs)
  }
}
