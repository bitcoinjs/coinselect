var coinSelect = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var outputs = f.outputs.map(function (value) { return { value } })
    var unspents = f.unspents.map(function (value, i) { return { i, value } })
    var result = coinSelect(unspents, outputs, f.feeRate)

    // drop non-index related input data for easy result comparison
    if (result.inputs) {
      result.inputs = result.inputs.map(function (input) { return input.i })
    }

    t.deepEqual(result, f.expected)
    t.end()
  })
})
