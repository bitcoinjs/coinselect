var utils = require('./utils')

// similar to accumulative but add all inputs
module.exports = function consolidate (utxos, outputs, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    var utxoBytes = utils.inputBytes(utxo)
    var utxoFee = feeRate * utxoBytes
    var utxoValue = utils.uintOrNaN(utxo.value)

    // skip detrimental input
    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1) return { fee: feeRate * (bytesAccum + utxoBytes) }
      continue
    }

    bytesAccum += utxoBytes
    inAccum += utxoValue
    inputs.push(utxo)

    var fee = feeRate * bytesAccum
  }

  // if we can satisfy requirements we finalize it
  if (inAccum >= outAccum + fee) return utils.finalize(inputs, outputs, feeRate)

  // otherwise, fail. return only fee
  return { fee: feeRate * bytesAccum }
}
