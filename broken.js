var utils = require('./utils')

module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(output.value)) throw new TypeError('Expected Satoshi value, got ' + output.value)

  var inAccum = utils.sum(utxos)
  var outputBytes = utils.outputBytes(output)
  var value = output.value

  var bytesAccum = utils.transactionBytes(utxos, [])
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
