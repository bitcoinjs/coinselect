let accum = require('../accum')

// proximal? in some sense
module.exports = function proximal (utxos, outputs, feeRate) {
  const outAccum = outputs.reduce((a, x) => a + x.value, 0)

  utxos = utxos.concat().sort((a, b) => {
    let aa = a.value - outAccum
    let bb = b.value - outAccum

    return aa - bb
  })

  return accum(utxos, outputs, feeRate)
}
