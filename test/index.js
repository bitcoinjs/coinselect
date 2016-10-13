var coinSelect = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputs = utils.valuesToObjects(f.inputs, true)
    var outputs = utils.valuesToObjects(f.outputs)
    var result = coinSelect(inputs, outputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)
    t.equal(outputs.length, f.outputs.length)

    // drop non-index related input data for easy result comparison
    if (result.inputs) {
      result.inputs = utils.indicesOnly(result.inputs)
    }

    if (result.outputs) {
      result.outputs = utils.objectsToValues(result.outputs)
    }

    t.deepEqual(result, f.expected)
    t.end()
  })
})
