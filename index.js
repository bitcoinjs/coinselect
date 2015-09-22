// TODO: integrate privacy calculations, group by address, avoid linking multiple addresses together
// XXX: There may be better optimization techniques available here, may, be.
// TODO: integrate priority calculations
// var COIN = 100000000
// var freeThreshold = COIN * 144 / 250
// var isFree = inputs.reduce(function (accum, input) { return accum + priority(input) }, 0)  >  freeThreshold
//
// function priority(unspent) {
//   // unlike bitcoind, we assume priority is calculated for _right_ now
//   // not the next block
//   return unspent.value * unspent.confirmations
// }

// XXX: these are based on pubKeyHash estimates, the information is ignored so pre-calculated placeholders are used to improve performance
var TX_EMPTY_SIZE = 8
var TX_PUBKEYHASH_INPUT = 40 + 2 + 106
var TX_PUBKEYHASH_OUTPUT = 8 + 2 + 25

function estimateRelayFee (byteLength, feePerKb) {
  return Math.ceil(byteLength / 1000) * feePerKb
}

module.exports = function coinSelect (unspents, outputs, feePerKb) {
  // sort by descending value
  var sorted = unspents.concat().sort(function (o1, o2) {
    return o2.value - o1.value
  })

  var byteLength = TX_EMPTY_SIZE
  var target = 0

  outputs.forEach(function (output) {
    byteLength += output.script ? output.script.length : TX_PUBKEYHASH_OUTPUT
    target += output.value
  })

  var accum = 0
  var baseFee = estimateRelayFee(byteLength, feePerKb)
  var total = target + baseFee

  for (var i = 0; i < sorted.length; ++i) {
    var unspent = sorted[i]

    // TODO: an estimate is used because of missing signature data
    byteLength += TX_PUBKEYHASH_INPUT
    accum += unspent.value

    // ignore fees until we have the minimum amount
    if (accum < target) continue

    baseFee = estimateRelayFee(byteLength, feePerKb)
    total = target + baseFee

    // continue until we can afford the base fee
    if (accum < total) continue
    var inputs = sorted.slice(0, i + 1)

    var feeWithChange = estimateRelayFee(byteLength + TX_PUBKEYHASH_OUTPUT, feePerKb)
    var totalWithChange = target + feeWithChange

    // can we afford a change output?
    if (accum >= totalWithChange) {
      var remainderWithChange = accum - totalWithChange

      return {
        fee: feeWithChange,
        inputs: inputs,
        remainder: remainderWithChange
      }
    }

    var remainder = accum - total

    return {
      fee: baseFee + remainder,
      inputs: inputs,
      remainder: 0
    }
  }

  return {
    fee: baseFee
  }
}
