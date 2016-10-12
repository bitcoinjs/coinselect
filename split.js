let utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  const inAccum = utxos.reduce(function (a, x) { return a + x.value }, 0)
  const bytesAccum = utils.transactionBytes(utxos, outputs)
  const fee = bytesAccum * feeRate
  if (outputs.length === 0) return { fee }

  const remaining = inAccum - fee
  if (remaining <= 0) return { fee }

  const valuePerOutput = (remaining / outputs.length) | 0
  if (valuePerOutput <= utils.dustThreshold({}, feeRate)) {
    return { fee }
  }

  outputs = outputs.map(function (output) {
    return Object.assign({
      value: valuePerOutput
    }, output)
  })

  const outAccum = outputs.reduce(function (a, x) { return a + x.value }, 0)
  const actualFee = inAccum - outAccum
  if (actualFee < fee) return { fee }

  return { inputs: utxos, outputs, fee: actualFee }
}
