var coinBreak = require('../break')
var fixtures = require('./fixtures/break')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var finputs = utils.expand(f.inputs)
    var foutputs = utils.expand([f.output])
    var actual = coinBreak(finputs, foutputs[0], f.feeRate)

    t.same(actual, f.expected)
    t.end()
  })
})
