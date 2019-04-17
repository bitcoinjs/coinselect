var coinAccum = require('../accumulative')
var fixtures = require('./fixtures/accumulative')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var outputs = utils.expand(f.outputs)
    var actual = coinAccum(inputs, outputs, f.feeRate)

    t.same(actual.inputs, f.expected.inputs)
    t.same(actual.outputs, f.expected.outputs)
    if (f.expected.fee) t.ok(actual.fee.eq(f.expected.fee))
    else t.ok(actual.fee === f.expected.fee)

    if (actual.inputs) {
      var feedback = coinAccum(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback.inputs, f.expected.inputs)
      t.same(feedback.outputs, f.expected.outputs)
      if (f.expected.fee) t.ok(feedback.fee.eq(f.expected.fee))
      else t.ok(actual.fee === f.expected.fee)
    }

    t.end()
  })
})
