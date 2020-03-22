var accumulative = require('./accumulative')
var blackjack = require('./blackjack')
var utils = require('./utils')
var processOptions = require('./defaultOpts')
var processOptionsFunc = processOptions.processOptions
// order by descending value, minus the inputs approximate fee
function utxoScore (x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

module.exports = function coinSelect (utxos, outputs, feeRate, options) {
  options = processOptionsFunc()
  utxos = utxos.concat().sort(function (a, b) {
    return utxoScore(b, feeRate) - utxoScore(a, feeRate)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack(utxos, outputs, feeRate, options)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate, options)
}
