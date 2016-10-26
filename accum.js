var utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  var bytesAccum = utils.transactionBytes([], outputs)

  // accumulate inputs until we reach the target or run out
  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]

    bytesAccum += utils.inputBytes(utxo)
    inAccum += utils.uintOrNaN(utxo.value)
    inputs.push(utxo)

    var fee = feeRate * bytesAccum

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  return { fee: feeRate * bytesAccum }
}
