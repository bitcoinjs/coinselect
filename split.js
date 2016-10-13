const utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  const bytesAccum = utils.transactionBytes(utxos, outputs)
  const fee = feeRate * bytesAccum
  if (outputs.length === 0) return { fee }

  const inAccum = utils.sum(utxos)
  const outAccum = utils.sum(outputs)
  const remaining = inAccum - outAccum - fee
  if (remaining <= 0) return { fee }

  const splitOutputsCount = outputs.reduce(function (a, x) {
    return a + !x.value
  }, 0)
  const splitValue = (remaining / splitOutputsCount) | 0

  // ensure every output is either user defined, or over the threshold
  if (outputs.some(function (x) {
    return !x.value && (splitValue > utils.dustThreshold(x, feeRate))
  })) return { fee: fee }

  // assign splitValue to outputs not user defined
  outputs = outputs.map(function (x) {
    return Object.assign({ value: splitValue }, x)
  })

  return utils.finalize(utxos, outputs, feeRate)
}
