const coinBreak = require('../break')
const fixtures = require('./fixtures/break')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    const finputs = utils.expand(f.inputs)
    const foutputs = utils.expand([f.output])
    const actual = coinBreak(finputs, foutputs[0], f.feeRate)

    t.same(actual, f.expected)
    t.end()
  })
})
