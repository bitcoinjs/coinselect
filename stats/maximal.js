let accum = require('../accum')

module.exports = function maximal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  return accum(utxos, outputs, feeRate)
}
