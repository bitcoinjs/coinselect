const accumulative = require('./accumulative')
const blackjack = require('./blackjack')
const utils = require('./utils')

// order by descending value, minus the inputs approximate fee
function utxoScore (x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

module.exports = function coinSelect (utxos, outputs, feeRate, minFee = 0) {
  utxos = utxos.concat().sort(function (a, b) {
    return utxoScore(b, feeRate) - utxoScore(a, feeRate)
  })

  // attempt to use the blackjack strategy first (no change output)
  const base = blackjack(utxos, outputs, feeRate, minFee)
  if (base.inputs) {
    console.error('blackjack solved')
    return base
  }

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate, minFee)
}
