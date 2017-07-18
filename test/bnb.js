var bnb = require('../branchandbound')
var fixtures = require('./fixtures/bnb')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var outputs = utils.expand(f.outputs)
    var actual = bnb(inputs, outputs, f.feeRate, 0.5)

    t.same(actual, f.expected)
    if (actual.inputs) {
      var feedback = bnb(actual.inputs, actual.outputs, f.feeRate, 0.5)
      t.same(feedback, f.expected)
    }

    t.end()
  })
})
