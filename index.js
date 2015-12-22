// TODO: integrate privacy calculations, group by address, avoid linking multiple addresses together

// XXX: these are based on pubKeyHash estimates, used to improve performance
var TX_EMPTY_SIZE = 8
var TX_INPUT_BASE = 40 + 2
var TX_INPUT_PUBKEYHASH = 106
var TX_OUTPUT_BASE = 8 + 1
var TX_OUTPUT_PUBKEYHASH = 25

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
    byteLength += TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
    target += output.value
  })

  var accum = 0

  for (var i = 0; i < sorted.length; ++i) {
    var unspent = sorted[i]

    // TODO: an estimate is used because of missing signature data
    byteLength += TX_INPUT_BASE + TX_INPUT_PUBKEYHASH
    accum += unspent.value

    // ignore fees until we have the minimum amount
    if (accum < target) continue

    var baseFee = estimateRelayFee(byteLength, feePerKb)
    var total = target + baseFee

    // continue until we can afford the base fee
    if (accum < total) continue
    var inputs = sorted.slice(0, i + 1)

    var feeWithChange = estimateRelayFee(byteLength + TX_OUTPUT_BASE + TX_OUTPUT_PUBKEYHASH, feePerKb)
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
    fee: estimateRelayFee(byteLength, feePerKb),
    inputs: null
  }
}
