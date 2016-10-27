var coinBreak = require('../break')
var fixtures = require('./fixtures/break')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  var e = f.expected

  tape(f.description, function (t) {
    var finputs = utils.expand(f.inputs)
    var foutput = utils.expand([f.output])[0]
    var a = coinBreak(finputs, foutput, f.feeRate)

    // ensure arguments were not modified
    t.equal(finputs.length, f.inputs.length)
    if (a.inputs) t.same(a.inputs, finputs)

    utils.testValues(t, a.outputs, e.outputs)
    t.equal(a.fee, e.fee)
    t.end()
  })
})
