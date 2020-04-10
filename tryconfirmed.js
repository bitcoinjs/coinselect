function filterUtxos (utxos, minConfOwn, minConfOther, minConfCoinbase) {
  var usable = []
  var unusable = []

  for (var i = 0; i < utxos.length; i++) {
    var utxo = utxos[i]
    if (utxo.coinbase == null || utxo.own == null || utxo.confirmations == null) {
      console.log(utxo)
      throw new Error('Missing information.')
    }

    var isUsed

    if (utxo.coinbase) {
      isUsed = utxo.confirmations >= minConfCoinbase
    } else if (utxo.own) {
      isUsed = utxo.confirmations >= minConfOwn
    } else {
      isUsed = utxo.confirmations >= minConfOther
    }

    if (isUsed) {
      usable.push(utxo)
    } else {
      unusable.push(utxo)
    }
  }
  return {
    usable: usable,
    unusable: unusable
  }
}

module.exports = function tryConfirmed (algorithm, options) {
  options = options || {}
  var own = options.own || 1
  var other = options.other || 6
  var coinbase = options.coinbase || 100

  return function (utxos, outputs, feeRate) {
    if (utxos.length === 0) {
      return {}
    }

    var trials = []

    var i
    // first - let's keep others at options.other and let's try decrease own, but not to 0
    for (i = own; i > 0; i--) {
      trials.push({other: other, own: i})
    }

    // if that did not work, let's try to decrease other, keeping own at 1
    for (i = other - 1; i > 0; i--) {
      trials.push({other: i, own: 1})
    }

    // if that did not work, first allow own unconfirmed, then all unconfirmed
    trials.push({other: 1, own: 0})
    trials.push({other: 0, own: 0})

    var unusable = utxos
    var usable = []

    for (i = 0; i < trials.length; i++) {
      var trial = trials[i]

      // since the restrictions are always loosening, we can just filter the unusable so far
      var filterResult = filterUtxos(unusable, trial.own, trial.other, coinbase)

      // and we can try the algorithm only if there are some newly usable utxos
      if (filterResult.usable.length > 0) {
        usable = usable.concat(filterResult.usable)
        unusable = filterResult.unusable

        var result = algorithm(usable, outputs, feeRate)
        if (result.inputs) {
          return result
        }

        // we tried all inputs already
        if (unusable.length === 0) {
          return result
        }
      }
    }

    // we should never end here
    throw new Error('Unexpected unreturned result')
  }
}
