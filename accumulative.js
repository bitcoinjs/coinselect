var utils = require('./utils')

// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  if (isNaN(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes([], outputs)
  var inAccum = utils.BN_ZERO
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)

  for (var i = 0; i < utxos.length; ++i) {
    var utxo = utxos[i]
    var utxoBytes = utils.inputBytes(utxo)
    var utxoFee = feeRate.mul(utxoBytes)
    var utxoValue = utils.bnOrNaN(utxo.value)

    // skip detrimental input
    if (!isNaN(utxoValue) && utxoFee.gt(utxoValue)) {
      if (i === utxos.length - 1) {
        return {
          fee: feeRate.mul((bytesAccum.add(utxoBytes)))
        }
      }
      continue
    }

    inAccum = !isNaN(utxoValue) ? inAccum.add(utxoValue) : NaN
    bytesAccum = bytesAccum.add(utxoBytes)
    inputs.push(utxo)

    var fee = feeRate.mul(bytesAccum)

    // go again?
    if (!isNaN(inAccum) && !isNaN(outAccum) && inAccum.lt(outAccum.add(fee))) continue

    return utils.finalize(inputs, outputs, feeRate)
  }

  return {
    fee: feeRate.mul(bytesAccum)
  }
}
