const utils = require('./utils')

module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(output.value)) throw new TypeError('Expected Satoshi value, got ' + output.value)

  const inAccum = utxos.reduce((a, x) => a + x.value, 0)
  const outputBytes = utils.outputBytes(output)
  const value = output.value

  let bytesAccum = utils.transactionBytes(utxos, [])
  let outAccum = 0
  let outputs = []

  while (true) {
    const fee = feeRate * (bytesAccum + outputBytes)

    // did we bust?
    if (inAccum < (outAccum + value + fee)) {
      // did we bust before we split anything?
      if (outputs.length === 0) return { fee }
      break
    }

    bytesAccum += outputBytes
    outAccum += value
    outputs.push({ value })
  }

  return utils.finalize(utxos, outputs, feeRate)
}
