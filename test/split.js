const coinSplit = require('../split')
const fixtures = require('./fixtures/split')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    const finputs = utils.expand(f.inputs)
    const foutputs = f.outputs.concat()
    const actual = coinSplit(finputs, foutputs, f.feeRate)

    t.same(actual, f.expected)
    if (actual.inputs) {
      const feedback = coinSplit(finputs, actual.outputs, f.feeRate)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
