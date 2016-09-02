let accum = require('../accum')
let shuffleInplace = require('fisher-yates/inplace')

module.exports = function bestof (utxos, outputs, feeRate, n) {
  n = n || 100

  let utxosCopy = utxos.concat()
  let best = { fee: Infinity }

  while (n) {
    shuffleInplace(utxosCopy)

    let result = accum(utxos, outputs, feeRate)
    if (result.inputs && result.fee < best.fee) {
      best = result
    }

    --n
  }

  return best
}
