let utils = require('./utils')
let fDustThreshold = utils.dustThreshold
let fInputBytes = utils.inputBytes
let fOutputBytes = utils.outputBytes
let fTransactionBytes = utils.transactionBytes

module.exports = function select (prospectiveInputs, outputs, feeRate) {
  let inAccum = 0
  let bytesAccum = fTransactionBytes([], outputs)
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  let i = 0
  while (i < prospectiveInputs.length) {
    const input = prospectiveInputs[i]

    inAccum += input.value
    bytesAccum += fInputBytes(input)

    const fee = feeRate * bytesAccum
    if (inAccum >= (outAccum + fee)) break

    ++i
  }

  // did we bust?
  const fee = feeRate * bytesAccum
  if (inAccum < (outAccum + fee)) return { fee }

  const inputs = prospectiveInputs.slice(0, i + 1)

  // is it worth an extra output [for change]?
  const feeExtra = feeRate * (bytesAccum + fOutputBytes({}))
  const changeAccum = inAccum - outAccum - feeExtra

  if (changeAccum > fDustThreshold({}, feeRate)) {
    outputs.push({ value: changeAccum })

    return { inputs, outputs, fee: feeExtra }
  }

  // ignore it
  const feeFinal = inAccum - outAccum
  return { inputs, outputs, fee: feeFinal }
}
