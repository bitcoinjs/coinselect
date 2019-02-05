var utils = require('./utils')
var BN = require('bn.js')

// only add inputs if they don't bust the target value (aka, exact match)
// worst-case: O(n)
module.exports = function blackjack (utxos, outputs, feeRate) {
  if (isNaN(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes([], outputs)
  var inAccum = utils.BN_ZERO
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)
  var threshold = utils.dustThresholdOrNan({}, feeRate)

  for (var i = 0; i < utxos.length; ++i) {
    var input = utxos[i]
    var inputBytes = utils.inputBytes(input)
    var inputValue = utils.bnOrNaN(input.value)
    var fee = BN.isBN(feeRate) ? feeRate.mul(bytesAccum.add(inputBytes)) : NaN

    // would it waste value?
    if (!isNaN(outAccum) &&
      !isNaN(inputValue) &&
      !isNaN(threshold) &&
      !isNaN(fee) &&
      (inAccum.add(inputValue)).gt((outAccum.add(fee).add(threshold)))) continue

    bytesAccum = bytesAccum.add(inputBytes)
    inAccum = !isNaN(inputValue) ? inAccum.add(inputValue) : NaN
    inputs.push(input)

    // go again?
    if (!isNaN(outAccum) && !isNaN(fee) && inAccum.lt(outAccum.add(fee))) continue

    return utils.finalize(inputs, outputs, feeRate)
  }
  return {
    fee: feeRate.mul(bytesAccum)
  }
}
