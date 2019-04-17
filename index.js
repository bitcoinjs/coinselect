var accumulative = require('./accumulative')
var blackjack = require('./blackjack')
var utils = require('./utils')
var ext = require('./bn-extensions')

// order by descending value, minus the inputs approximate fee
function utxoScore (x, feeRate) {
  return ext.sub(x.value, ext.mul(feeRate, utils.inputBytes(x)))
}

module.exports = function coinSelect (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort(function (a, b) {
    return ext.sub(utxoScore(b, feeRate), utxoScore(a, feeRate))
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}
