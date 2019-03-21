var utils = require('./utils')
var ext = require('./bn-extensions')

// break utxos into the maximum number of 'output' possible
module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes(utxos, [])
  var value = utils.bnOrNaN(output.value)
  var inAccum = utils.sumOrNaN(utxos)

  if (!isFinite(value) ||
      !isFinite(inAccum)) return { fee: feeRate.mul(bytesAccum) }

  var outputBytes = utils.outputBytes(output)
  var outAccum = ext.BN_ZERO
  var outputs = []

  while (true) {
    // feeRate * (bytesAccum + outputBytes)
    var fee = ext.mul(feeRate, ext.add(bytesAccum, outputBytes))

    // did we bust?
    if (ext.lt(inAccum, ext.add(outAccum, fee, value))) {
      var isZero = ext.isZero(outAccum)
      // premature?
      if (isZero) {
        return {
          fee: fee
        }
      }
      break
    }

    bytesAccum = ext.add(bytesAccum, outputBytes)
    outAccum = ext.add(outAccum, value)
    outputs.push(output)
  }

  return utils.finalize(utxos, outputs, feeRate)
}
