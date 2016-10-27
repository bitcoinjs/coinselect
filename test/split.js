var coinSplit = require('../split')
var fixtures = require('./fixtures/split')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  var e = f.expected

  tape(f.description, function (t) {
    var finputs = utils.expand(f.inputs)
    var foutputs = f.outputs.concat()
    var a = coinSplit(finputs, foutputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(finputs.length, f.inputs.length)
    t.equal(foutputs.length, f.outputs.length)

    utils.testValues(t, a.inputs, e.inputs)
    utils.testValues(t, a.outputs, e.outputs)
    t.equal(a.fee, e.fee)
    t.end()
  })
})
