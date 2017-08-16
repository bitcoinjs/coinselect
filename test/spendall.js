var spendAll = require('../spendall')
var fixtures = require('./fixtures/spendall')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var finputs = utils.expand(f.inputs)
    var actual = spendAll(finputs, f.feeRate)

    t.same(actual, f.expected)

    t.end()
  })
})
