var utils = require('./utils')

module.exports = function split (utxos, outputs, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes(utxos, outputs)
  var fee = feeRate * bytesAccum
  if (outputs.length === 0) return { fee: fee }

  var inAccum = utils.sumOrNaN(utxos)
  var outAccum = utils.sumForgiving(outputs)
  var remaining = inAccum - outAccum - fee
  if (!isFinite(remaining) || remaining <= 0) return { fee: fee }

  var splitOutputsCount = outputs.reduce(function (a, x) {
    return a + !x.value
  }, 0)
  var splitValue = (remaining / splitOutputsCount) >>> 0

  // ensure every output is either user defined, or over the threshold
  if (!outputs.every(function (x) {
    return x.value !== undefined || (splitValue > utils.dustThreshold(x, feeRate))
  })) return { fee: fee }

  // assign splitValue to outputs not user defined
  outputs = outputs.map(function (x) {
    if (x.value !== undefined) return x

    // not user defined, but still copy over any non-value fields
    var y = {
      value: splitValue
    }

    for (var k in x) y[k] = x[k]
    return y
  })

  return utils.finalize(utxos, outputs, feeRate)
}
