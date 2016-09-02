let accumulative = require('../accum')
let blackjack = require('../blackjack')

module.exports = function blackmin (utxos, outputs, feeRate) {
  // order by descending value
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}
