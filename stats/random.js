let accum = require('../accum')
let shuffle = require('fisher-yates')

module.exports = function random (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  return accum(utxos, outputs, feeRate)
}
