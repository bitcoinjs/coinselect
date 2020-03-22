var utils = require('./utils')
var defaultOpts = require('./defaultOpts')
var defaultOptsObj = defaultOpts.defaultOpts
// only add inputs if they don't bust the target value (aka, exact match)
// worst-case: O(n)
module.exports = function blackjack (utxos, outputs, feeRate, options = defaultOptsObj) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes([], outputs)

  var inAccum = 0
  var inputs = []
  var outAccum = utils.sumOrNaN(outputs)
  var threshold = utils.dustThreshold(feeRate, options.changeInputLengthEstimate)

  for (var i = 0; i < utxos.length; ++i) {
    var input = utxos[i]
    var inputBytes = utils.inputBytes(input)
    var fee = feeRate * (bytesAccum + inputBytes)
    var inputValue = utils.uintOrNaN(input.value)

    // would it waste value?
    if ((inAccum + inputValue) > (outAccum + fee + threshold)) continue

    bytesAccum += inputBytes
    inAccum += inputValue
    inputs.push(input)

    // go again?
    if (inAccum < outAccum + fee) continue

    return utils.finalize(inputs, outputs, feeRate, options)
  }

  return { fee: feeRate * bytesAccum }
}
