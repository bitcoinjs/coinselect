var utils = require('./utils')
var ext = require('./bn-extensions')

// only add inputs if they don't bust the target value (aka, exact match)
// worst-case: O(n)
module.exports = function blackjack (utxos, outputs, feeRate) {
  if (!isFinite(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = ext.BN_ZERO
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)
  var threshold = utils.dustThreshold({}, feeRate)

  for (var i = 0; i < utxos.length; ++i) {
    var input = utxos[i]
    var inputBytes = utils.inputBytes(input)
    var fee = ext.mul(feeRate, ext.add(bytesAccum, inputBytes))
    var inputValue = utils.bnOrNaN(input.value)

    // would it waste value?
    var totalInputs = ext.add(inAccum, inputValue)
    var outputsAndFee = ext.add(outAccum, fee)
    var totalOutputs = ext.add(outputsAndFee, threshold)
    var inputsAreGreaterThanOutputs = ext.gt(totalInputs, totalOutputs)

    if (inputsAreGreaterThanOutputs) continue

    bytesAccum = ext.add(bytesAccum, inputBytes)
    inAccum = ext.add(inAccum, inputValue)
    inputs.push(input)

    // go again?
    if (ext.lt(inAccum, outputsAndFee)) continue

    return utils.finalize(inputs, outputs, feeRate)
  }
  return {
    fee: feeRate.mul(bytesAccum)
  }
}
