var split = require('./split')

module.exports = function spendAll (utxos, feeRate) {
  return split(utxos, [{}], feeRate)
}
