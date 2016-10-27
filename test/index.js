var coinSelect = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  var e = f.expected

  tape(f.description, function (t) {
    var inputs = utils.expand(f.inputs, true)
    var outputs = utils.expand(f.outputs)
    var a = coinSelect(inputs, outputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)
    t.equal(outputs.length, f.outputs.length)

    utils.testValues(t, a.inputs, e.inputs)
    utils.testValues(t, a.outputs, e.outputs)
    t.equal(a.fee, e.fee)
    t.end()
  })
})
