var utils = require('./utils')

var maxTries = 1000000

function calculateEffectiveValues (utxos, feeRate) {
  return utxos.map(function (utxo) {
    if (isNaN(utils.uintOrNaN(utxo.value))) {
      return {
        utxo: utxo,
        effectiveValue: 0
      }
    }

    var effectiveFee = utils.inputBytes(utxo) * feeRate
    var effectiveValue = utxo.value - effectiveFee
    return {
      utxo: utxo,
      effectiveValue: effectiveValue
    }
  })
}

module.exports = function branchAndBound (utxos, outputs, feeRate, factor) {
  if (!isFinite(utils.uintOrNaN(feeRate))) return {}

  var costPerOutput = utils.outputBytes({}) * feeRate
  var costPerInput = utils.inputBytes({}) * feeRate
  var costOfChange = Math.floor((costPerInput + costPerOutput) * factor)

  var outAccum = utils.sumOrNaN(outputs) + utils.transactionBytes([], outputs) * feeRate

  var effectiveUtxos = calculateEffectiveValues(utxos, feeRate).filter(function (x) {
    return x.effectiveValue > 0
  }).sort(function (a, b) {
    return b.effectiveValue - a.effectiveValue
  })

  var selected = search(effectiveUtxos, outAccum, costOfChange)
  if (selected != null) {
    var inputs = []

    for (var i = 0; i < effectiveUtxos.length; i++) {
      if (selected[i]) {
        inputs.push(effectiveUtxos[i].utxo)
      }
    }

    return utils.finalize(inputs, outputs, feeRate)
  } else {
    const fee = feeRate * utxos.reduce(function (a, x) {
      return a + utils.inputBytes(x)
    }, 0)

    return {
      fee: fee
    }
  }
}

// Depth first search
// Inclusion branch first (Largest First Exploration), then exclusion branch
function search (effectiveUtxos, target, costOfChange) {
  if (effectiveUtxos.length === 0) {
    return
  }

  var tries = maxTries

  var selected = [] // true -> select the utxo at this index
  var selectedAccum = 0 // sum of effective values

  var traversingExclusion = [] // true -> traversing exclusion branch at this index

  var done = false
  var backtrack = false

  var remaining = effectiveUtxos.reduce(function (a, x) {
    return a + x.effectiveValue
  }, 0)

  var depth = 0
  while (!done) {
    if (tries <= 0) { // Too many tries, exit
      return
    } else if (selectedAccum > target + costOfChange) { // Selected value is out of range, go back and try other branch
      backtrack = true
    } else if (selectedAccum >= target) { // Selected value is within range
      done = true
    } else if (depth >= effectiveUtxos.length) { // Reached a leaf node, no solution here
      backtrack = true
    } else if (selectedAccum + remaining < target) { // Cannot possibly reach target with amount remaining
      if (depth === 0) { // At the first utxo, no possible selections, so exit
        return
      } else {
        backtrack = true
      }
    } else { // Continue down this branch
      // Remove this utxo from the remaining utxo amount
      remaining -= effectiveUtxos[depth].effectiveValue
      // Inclusion branch first (Largest First Exploration)
      selected[depth] = true
      selectedAccum += effectiveUtxos[depth].effectiveValue
      depth++
    }

    // Step back to the previous utxo and try the other branch
    if (backtrack) {
      backtrack = false // Reset
      depth--

      // Walk backwards to find the first utxo which has not has its second branch traversed
      while (traversingExclusion[depth]) {
        // Reset this utxo's selection
        if (selected[depth]) {
          selectedAccum -= effectiveUtxos[depth].effectiveValue
        }
        selected[depth] = false
        traversingExclusion[depth] = false
        remaining += effectiveUtxos[depth].effectiveValue

        // Step back one
        depth--

        if (depth < 0) { // We have walked back to the first utxo and no branch is untraversed. No solution, exit.
          return
        }
      }

      if (!done) {
        // Now traverse the second branch of the utxo we have arrived at.
        traversingExclusion[depth] = true

        // These were always included first, try excluding now
        selected[depth] = false
        selectedAccum -= effectiveUtxos[depth].effectiveValue
        depth++
      }
    }
    tries--
  }

  return selected
}
