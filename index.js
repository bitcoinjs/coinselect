var accumulative = require('./accumulative')
var blackjack = require('./blackjack')

// TODO
// function groupByRelation (utxos) {
//   var txoMap = {}
//   var result = []
//
//   // group by address/script
//   utxos.forEach((utxo) => {
//     var key = utxo.address || utxo.script
//
//     // no relation known, use as is
//     if (!key) return result.push(utxo)
//
//     // else, append relation via key
//     if (!txoMap[key]) txoMap[key] = []
//     txoMap[key].push(utxo)
//   })
//
//   for (var key in txoMap) {
//     var group = txoMap[key]
//
//     // summate 'grouping' value
//     group.value = group.reduce((a, x) => a + x.value, 0)
//     result.push(group)
//   }
//
//   return result
// }

module.exports = function coinSelect (utxos, outputs, feeRate) {
  // order by descending value
  utxos = utxos.concat().sort(function (a, b) {
    return b.value - a.value
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}
