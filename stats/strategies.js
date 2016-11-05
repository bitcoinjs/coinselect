let accumulative = require('../accumulative')
let blackjack = require('../blackjack')
let shuffle = require('fisher-yates')
let shuffleInplace = require('fisher-yates/inplace')

function blackmax (utxos, outputs, feeRate) {
  // order by ascending value
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function blackmin (utxos, outputs, feeRate) {
  // order by descending value
  utxos = utxos.concat().sort((a, b) => b.value - a.value)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function blackrand (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  // attempt to use the blackjack strategy first (no change output)
  let base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}

function maximal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => a.value - b.value)

  return accumulative(utxos, outputs, feeRate)
}

function minimal (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort((a, b) => b.value - a.value)

  return accumulative(utxos, outputs, feeRate)
}

function FIFO (utxos, outputs, feeRate) {
  utxos = utxos.concat().reverse()

  return accumulative(utxos, outputs, feeRate)
}

function proximal (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  utxos = utxos.concat().sort((a, b) => {
    let aa = a.value - outAccum
    let bb = b.value - outAccum

    return aa - bb
  })

  return accumulative(utxos, outputs, feeRate)
}

// similar to bitcoind
function random (utxos, outputs, feeRate) {
  utxos = shuffle(utxos)

  return accumulative(utxos, outputs, feeRate)
}

function bestof (utxos, outputs, feeRate) {
  let n = 100
  let utxosCopy = utxos.concat()
  let best = { fee: Infinity }

  while (n) {
    shuffleInplace(utxosCopy)

    let result = accumulative(utxos, outputs, feeRate)
    if (result.inputs && result.fee < best.fee) {
      best = result
    }

    --n
  }

  return best
}

module.exports = {
  accumulative,
  bestof,
  blackjack,
  blackmax,
  blackmin,
  blackrand,
  FIFO,
  maximal,
  minimal,
  proximal,
  random
}
