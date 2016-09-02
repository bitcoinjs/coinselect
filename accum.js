let utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)
  let inAccum = 0
  let bytesAccum = utils.transactionBytes([], outputs)

  // accumulate inputs
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]

    inAccum += utxo.value
    bytesAccum += utils.inputBytes(utxo)
    inputs.push(utxo)

    const fee = feeRate * bytesAccum
    if (inAccum >= (outAccum + fee)) break
  }

  // did we bust?
  const fee = feeRate * bytesAccum
  if (inAccum < (outAccum + fee)) return { fee }

  // is it worth an extra output [for change]?
  const feeExtra = feeRate * (bytesAccum + utils.outputBytes({}))
  const remainder = inAccum - outAccum - feeExtra

  if (remainder > utils.dustThreshold({}, feeRate)) {
    outputs.push({ value: remainder })

    return { inputs, outputs, fee: feeExtra }
  }

  // ignore it
  const feeFinal = inAccum - outAccum
  return { inputs, outputs, fee: feeFinal }
}
