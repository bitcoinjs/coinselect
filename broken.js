let utils = require('./utils')

module.exports = function broken (utxos, output, feeRate) {
  if (!isFinite(output.value)) throw new TypeError('Expected Satoshi value, got ' + output.value)

  let inAccum = utxos.reduce(function (a, x) { return a + x.value }, 0)
  let bytesAccum = utils.transactionBytes(utxos, [])
  const outputBytes = utils.outputBytes(output)
  const value = output.value

  let outputs = []
  let fee = inAccum

  while (inAccum >= value) {
    bytesAccum += outputBytes

    fee = feeRate * bytesAccum
    if ((inAccum - value - fee) < 0) break

    inAccum -= value
    outputs.push({ value })
  }

  // did we bust before we split anything?
  if (outputs.length === 0) return { fee }

  // is it worth an extra output [for change]?
  {
    const fee = feeRate * (bytesAccum + outputBytes)
    const valueExtra = inAccum - fee

    if (valueExtra > utils.dustThreshold({}, feeRate)) {
      outputs.push({ value: valueExtra })
      inAccum -= valueExtra
    }
  }

  return { inputs: utxos, outputs, fee: inAccum }
}
