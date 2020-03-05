const utils = require('./utils')

// only add inputs if they don't bust the target value (aka, exact match)
// worst-case: O(n)
module.exports = function blackjack (utxos, outputs, feeRate, minFee = 0, extraBytes = 0) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}
  if (!isFinite(utils.uintOrNaN(minFee))) return {}
  if (!isFinite(utils.uintOrNaN(extraBytes))) return {}

  let bytesAccum = utils.transactionBytes([], outputs) + extraBytes

  let inAccum = 0
  const inputs = []
  const outAccum = utils.sumOrNaN(outputs)
  const threshold = utils.dustThreshold({}, feeRate)

  for (let i = 0; i < utxos.length; ++i) {
    const input = utxos[i]
    const inputBytes = utils.inputBytes(input)
    const fee = feeRate * (bytesAccum + inputBytes)
    const inputValue = utils.uintOrNaN(input.value)

    // would it waste value?
    if ((inAccum + inputValue) > (outAccum + (fee > minFee ? fee : minFee) + threshold)) continue

    bytesAccum += inputBytes
    inAccum += inputValue
    inputs.push(input)

    // go again?
    if (inAccum < outAccum + (fee > minFee ? fee : minFee)) continue

    return utils.finalize(inputs, outputs, feeRate, minFee)
  }

  const fee = feeRate * bytesAccum
  return { fee: fee > minFee ? fee : minFee }
}
