const coinAccum = require('../accumulative')
const fixtures = require('./fixtures/accumulative')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    const inputs = utils.expand(f.inputs, true)
    const outputs = utils.expand(f.outputs)
    const actual = coinAccum(inputs, outputs, f.feeRate)

    t.same(actual, f.expected)
    if (actual.inputs) {
      const feedback = coinAccum(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
