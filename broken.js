'use-strict'

const utils = require('./utils')

module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(output.value)) throw new TypeError('Expected Satoshi value, got ' + output.value)

  const inAccum = utils.sum(utxos)
  const outputBytes = utils.outputBytes(output)
  const value = output.value

  var bytesAccum = utils.transactionBytes(utxos, [])
  var outAccum = 0
  var outputs = []

  while (true) {
    const fee = feeRate * (bytesAccum + outputBytes)

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
