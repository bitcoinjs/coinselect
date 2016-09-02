let accumulative = require('../accum')
let blackjack = require('../blackjack')
let shuffle = require('fisher-yates')

module.exports = function blackmin (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}
