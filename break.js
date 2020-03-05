const utils = require('./utils')

// break utxos into the maximum number of 'output' possible
module.exports = function broken (utxos, output, feeRate, minFee = 0, extraBytes = 0) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  if (!isFinite(utils.uintOrNaN(minFee))) return {}
  if (!isFinite(utils.uintOrNaN(extraBytes))) return {}

  let bytesAccum = utils.transactionBytes(utxos, []) + extraBytes
  const value = utils.uintOrNaN(output.value)
  const inAccum = utils.sumOrNaN(utxos)
  if (!isFinite(value) || !isFinite(inAccum)) {
    let fee = feeRate * bytesAccum
    fee = fee > minFee ? fee : minFee
    return { fee: fee }
  }

  const outputBytes = utils.outputBytes(output)
  let outAccum = 0
  const outputs = []

  while (true) {
    let fee = feeRate * (bytesAccum + outputBytes)
    fee = fee > minFee ? fee : minFee
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

  return utils.finalize(utxos, outputs, feeRate, minFee)
}
