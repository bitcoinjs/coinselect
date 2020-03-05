const utils = require('./utils')

// add inputs until we reach or surpass the target value (or deplete)
// worst-case: O(n)
module.exports = function accumulative (utxos, outputs, feeRate, minFee = 0, extraBytes = 0) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  if (!isFinite(utils.uintOrNaN(minFee))) return {}
  if (!isFinite(utils.uintOrNaN(extraBytes))) return {}

  let bytesAccum = utils.transactionBytes([], outputs) + extraBytes

  let inAccum = 0
  const inputs = []
  const outAccum = utils.sumOrNaN(outputs)

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]
    const utxoBytes = utils.inputBytes(utxo)
    const utxoFee = feeRate * utxoBytes
    const utxoValue = utils.uintOrNaN(utxo.value)

    // skip detrimental input
    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1) {
        let fee = feeRate * (bytesAccum + utxoBytes)
        fee = fee > minFee ? fee : minFee
        return { fee: fee }
      }
      continue
    }

    bytesAccum += utxoBytes
    inAccum += utxoValue
    inputs.push(utxo)

    const fee = feeRate * bytesAccum

    // go again?
    if (inAccum < outAccum + (fee > minFee ? fee : minFee)) continue

    return utils.finalize(inputs, outputs, feeRate, minFee)
  }

  const fee = feeRate * bytesAccum
  return { fee: fee > minFee ? fee : minFee }
}
