let utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  let outAccum = outputs.reduce((a, x) => a + x.value, 0)
  let inAccum = 0
  let bytesAccum = utils.transactionBytes([], outputs)

  // accumulate inputs
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]

    inAccum += utxo.value
    bytesAccum += utils.inputBytes(utxo)
    inputs.push(utxo)

    const feeWanted = feeRate * bytesAccum
    if (inAccum >= outAccum + feeWanted) break
  }

  // did we bust?
  const feeAccum = feeRate * bytesAccum
  if (inAccum < outAccum + feeAccum) return { fee: feeAccum }

  // is it worth an extra output [for change]?
  {
    const bytesExtra = utils.outputBytes({})
    const feeExtra = feeRate * (bytesAccum + bytesExtra)
    const valueExtra = inAccum - outAccum - feeExtra

    if (valueExtra > utils.dustThreshold({}, feeRate)) {
      outAccum += valueExtra
      outputs.push({ value: valueExtra })

      const fee = inAccum - outAccum
      return { inputs, outputs, fee }
    }
  }

  // ignore it
  const fee = inAccum - outAccum
  return { inputs, outputs, fee }
}
