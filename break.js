var utils = require('./utils')
var ext = require('./bn-extensions')

// break utxos into the maximum number of 'output' possible
module.exports = function broken (utxos, output, feeRate) {
  if (!utils.uintOrNull(feeRate)) return {}

  var bytesAccum = utils.transactionBytes(utxos, [])
  var value = utils.uintOrNull(output.value)
  var inAccum = utils.sumOrNaN(utxos)

  if (!value || !inAccum) return { fee: ext.mul(feeRate, bytesAccum) }

  var outputBytes = utils.outputBytes(output)
  var outAccum = ext.BN_ZERO
  var outputs = []

  while (true) {
    var fee = ext.mul(feeRate, ext.add(bytesAccum, outputBytes))

    // did we bust?
    if (ext.lt(inAccum, ext.add(outAccum, fee, value))) {
      // premature?
      if (ext.isZero(outAccum)) return { fee: fee }
      break
    }

    bytesAccum = ext.add(bytesAccum, outputBytes)
    outAccum = ext.add(outAccum, value)
    outputs.push(output)
  }

  return utils.finalize(utxos, outputs, feeRate)
}
