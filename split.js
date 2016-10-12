let utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  const inAccum = utxos.reduce(function (a, x) { return a + x.value }, 0)
  const bytesAccum = utils.transactionBytes(utxos, outputs)
  const fee = bytesAccum * feeRate
  if (outputs.length === 0) return { fee }

  let outAccum = outputs.reduce(function (a, x) { return a + (x.value | 0) }, 0)
  const remaining = inAccum - outAccum - fee
  if (remaining <= 0) return { fee }

  const wildOutputsCount = outputs.reduce(function (a, x) {
    return a + (x.value === undefined)
  }, 0)
  const wildValue = (remaining / wildOutputsCount) | 0

  if (!outputs.every(function (x) {
    if (x.value !== undefined) return true

    return wildValue > utils.dustThreshold(x, feeRate)
  })) return { fee }

  outputs = outputs.map(function (x) {
    return Object.assign({ value: wildValue }, x)
  })

  const actualFee = inAccum - outputs.reduce(function (a, x) { return a + x.value }, 0)
  return { inputs: utxos, outputs, fee: actualFee }
}
