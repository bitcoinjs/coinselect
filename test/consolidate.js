var consolidate = require('../consolidate')
var fixtures = require('./fixtures/consolidate.json')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var actual = consolidate(inputs, f.outputs, f.feeRate)

    t.same(actual, f.expected)
    if (actual.inputs) {
      var feedback = consolidate(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
