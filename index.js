let minimal = require('./minimal')

function coinSelect (unspents, outputs, feeRate) {
  // default order by descending value
  const ordered = unspents.concat().sort((a, b) => b.value - a.value)

  return minimal.select(ordered, outputs, feeRate)
}

module.exports = coinSelect
