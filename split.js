var utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  var bytesAccum = utils.transactionBytes(utxos, outputs)
  var fee = feeRate * bytesAccum
  if (outputs.length === 0) return { fee: fee }

  var inAccum = utils.sum(utxos)
  var outAccum = utils.sum(outputs)
  var remaining = inAccum - outAccum - fee
  if (remaining <= 0) return { fee: fee }

  var splitOutputsCount = outputs.reduce(function (a, x) {
    return a + !x.value
  }, 0)
  var splitValue = (remaining / splitOutputsCount) | 0

  // ensure every output is either user defined, or over the threshold
  if (outputs.some(function (x) {
    return !isFinite(x.value) && (splitValue <= utils.dustThreshold(x, feeRate))
  })) return { fee: fee }

  // assign splitValue to outputs not user defined
  outputs = outputs.map(function (x) {
    if (isFinite(x.value)) return x

    return { value: splitValue }
  })

  return utils.finalize(utxos, outputs, feeRate)
}
