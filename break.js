var utils = require('./utils')

module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes(utxos, [])
  var value = utils.uintOrNaN(output.value)
  var inAccum = utils.sumOrNaN(utxos)
  if (!isFinite(value) ||
      !isFinite(inAccum)) return { fee: feeRate * bytesAccum }

  var outputBytes = utils.outputBytes(output)
  var outAccum = 0
  var outputs = []

  while (true) {
    var fee = feeRate * (bytesAccum + outputBytes)

    // did we bust?
    if (inAccum < (outAccum + fee + value)) {
      // premature?
      if (outAccum === 0) return { fee: fee }

      break
    }

    bytesAccum += outputBytes
    outAccum += value
    outputs.push(output)
  }

  return utils.finalize(utxos, outputs, feeRate)
}
