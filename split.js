const utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  const bytesAccum = utils.transactionBytes(utxos, outputs)
  const inAccum = utxos.reduce((a, x) => a + x.value, 0)
  const fee = feeRate * bytesAccum
  if (outputs.length === 0) return { fee }

  const outAccum = outputs.reduce((a, x) => a + (x.value | 0), 0)
  const remaining = inAccum - outAccum - fee
  if (remaining <= 0) return { fee }

  const splitOutputsCount = outputs.reduce((a, x) => a + !x.value, 0)
  const splitValue = (remaining / splitOutputsCount) | 0

  // ensure every output is either user defined, or over the threshold
  if (!outputs.every((x) => x.value || (splitValue > utils.dustThreshold(x, feeRate)))) return { fee }
  outputs = outputs.map(x => Object.assign({ value: splitValue }, x))

  return utils.finalize(utxos, outputs, feeRate)
}
