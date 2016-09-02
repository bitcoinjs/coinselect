let accum = require('../accum')

module.exports = function minimal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => b.value - a.value)

  return accum(utxos, outputs, feeRate)
}
