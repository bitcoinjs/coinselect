var coinAccum = require('../accumulative')
var fixtures = require('./fixtures/accumulative')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var outputs = utils.expand(f.outputs)
    var actual = coinAccum(inputs, outputs, f.feeRate)

    t.same(actual, f.expected)
    if (actual.inputs) {
      var feedback = coinAccum(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
