var utils = require('./utils')

// break utxos into the maximum number of 'output' possible
module.exports = function broken (utxos, output, feeRate) {
  if (isNaN(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes(utxos, [])
  var value = utils.bnOrNaN(output.value)
  var inAccum = utils.sumOrNaN(utxos)

  if (isNaN(value) || isNaN(inAccum)) {
    return {
      fee: feeRate.mul(bytesAccum)
    }
  }

  var outputBytes = utils.outputBytes(output)
  var outAccum = utils.BN_ZERO
  var outputs = []

  while (true) {
    var fee = feeRate.mul((bytesAccum.add(outputBytes)))

    // did we bust?
    if (inAccum.lt((outAccum.add(fee).add(value)))) {
      // premature?
      if (outAccum.cmp(utils.BN_ZERO) === 0) {
        return {
          fee: fee
        }
      }
      break
    }

    bytesAccum = bytesAccum.add(outputBytes)
    outAccum = outAccum.add(value)
    outputs.push(output)
  }

  return utils.finalize(utxos, outputs, feeRate)
}
