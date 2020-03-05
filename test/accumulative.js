const coinAccum = require('../accumulative')
const fixtures = require('./fixtures/accumulative')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    const inputs = utils.expand(f.inputs, true)
    const outputs = utils.expand(f.outputs)
    const minFee = f.minFee ? f.minFee : 0

    const actual = coinAccum(inputs, outputs, f.feeRate, minFee)

    t.same(actual, f.expected)
    if (actual.inputs) {
      const feedback = coinAccum(actual.inputs, actual.outputs, f.feeRate, minFee)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
