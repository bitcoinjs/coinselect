const utils = require('./utils')

// break utxos into the maximum number of 'output' possible
module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  let bytesAccum = utils.transactionBytes(utxos, [])
  const value = utils.uintOrNaN(output.value)
  const inAccum = utils.sumOrNaN(utxos)
  if (!isFinite(value) ||
      !isFinite(inAccum)) return { fee: feeRate * bytesAccum }

  const outputBytes = utils.outputBytes(output)
  let outAccum = 0
  const outputs = []

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
