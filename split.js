let utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  const inAccum = utxos.reduce((a, x) => a + x.value, 0)
  const bytesAccum = utils.transactionBytes(utxos, outputs)
  const fee = bytesAccum * feeRate
  if (outputs.length === 0) return { fee }

  let outAccum = outputs.reduce((a, x) => a + (x.value | 0), 0)
  const remaining = inAccum - outAccum - fee
  if (remaining <= 0) return { fee }

  const wildOutputsCount = outputs.reduce((a, x) => a + (x.value === undefined), 0)
  const wildValue = (remaining / wildOutputsCount) | 0

  if (!outputs.every((x) => (x.value !== undefined) || (wildValue > utils.dustThreshold(x, feeRate)))) {
    return { fee }
  }

  outputs = outputs.map(x => Object.assign({ value: wildValue }, x))
  const actualFee = inAccum - outputs.reduce((a, x) => a + x.value, 0)

  return { inputs: utxos, outputs, fee: actualFee }
}
