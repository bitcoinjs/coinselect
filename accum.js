const utils = require('./utils')

// O(n)
module.exports = function accumulative (utxos, outputs, feeRate) {
  let bytesAccum = utils.transactionBytes([], outputs)
  let inAccum = 0
  let outAccum = outputs.reduce((a, x) => a + x.value, 0)

  // accumulate inputs
  let inputs = []

  for (let i = 0; i < utxos.length; ++i) {
    const utxo = utxos[i]

    bytesAccum += utils.inputBytes(utxo)
    inAccum += utxo.value
    inputs.push(utxo)

    const feeWanted = feeRate * bytesAccum
    if (inAccum >= outAccum + feeWanted) break
  }

  // did we bust?
  const feeAccum = feeRate * bytesAccum
  if (inAccum < outAccum + feeAccum) return { fee: feeAccum }

  // is it worth a change output?
  {
    const bytesExtra = utils.outputBytes({})
    const feeExtra = feeRate * (bytesAccum + bytesExtra)
    const valueExtra = inAccum - outAccum - feeExtra

    if (valueExtra > utils.dustThreshold({}, feeRate)) {
      outAccum += valueExtra
      outputs = outputs.concat({ value: valueExtra })

      const fee = inAccum - outAccum
      return { inputs, outputs, fee }
    }
  }

  // ignore it
  const fee = inAccum - outAccum
  return { inputs, outputs, fee }
}
