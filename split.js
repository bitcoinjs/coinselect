var utils = require('./utils')
var BN = require('bn.js')

// split utxos between each output, ignores outputs with .value defined
module.exports = function split (utxos, outputs, feeRate) {
  if (isNaN(utils.bnOrNaN(feeRate))) return {}

  var bytesAccum = utils.transactionBytes(utxos, outputs)
  var fee = feeRate.mul(bytesAccum)

  // Error for bad non big number utxos
  var invalidUtxos = !utxos.every(function (x) {
    if (typeof x.value === 'number') return false
    return true
  })

  // Error for non big number outputs
  var invalidOutputs = !outputs.every(function (x) {
    if (typeof x.value === 'number') return false
    return true
  })

  if (invalidUtxos || invalidOutputs) {
    return {
      fee: fee
    }
  }

  if (outputs.length === 0) {
    return {
      fee: fee
    }
  }

  var inAccum = utils.sumOrNaN(utxos)
  var outAccum = utils.sumForgiving(outputs)
  var remaining = inAccum.sub(outAccum).sub(fee)

  if (isNaN(remaining) || remaining.lt(utils.BN_ZERO)) {
    return {
      fee: fee
    }
  }

  var unspecified = outputs.reduce(function (a, x) {
    var nonValue = BN.isBN(x.value) ? 0 : 1
    return a + nonValue
  }, 0)

  if (remaining.cmp(utils.BN_ZERO) === 0 && unspecified === 0) return utils.finalize(utxos, outputs, feeRate)

  // Counts the number of split outputs left
  var splitOutputsCount = new BN(outputs.reduce(function (a, x) {
    return a + !x.value
  }, 0))

  // any number / 0 = infinity (shift right = 0)
  var splitValue = (splitOutputsCount.cmp(utils.BN_ZERO) === 0) ? 0 : remaining.div(splitOutputsCount).shrn(0)

  // ensure every output is either user defined, or over the threshold
  if (!outputs.every(function (x) {
    if (x.value !== undefined) return true
    var dustThresholdOrNaN = utils.dustThresholdOrNan(x, feeRate)
    if (!isNaN(dustThresholdOrNaN) && splitValue.gt(dustThresholdOrNaN)) return true
    return false
  })) {
    return {
      fee: fee
    }
  }

  // assign splitValue to outputs not user defined
  outputs = outputs.map(function (x) {
    if (x.value !== undefined) return x

    // not user defined, but still copy over any non-value fields
    var y = {}
    for (var k in x) y[k] = x[k]
    y.value = splitValue
    return y
  })

  return utils.finalize(utxos, outputs, feeRate)
}
