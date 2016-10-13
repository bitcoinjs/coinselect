'use-strict'

const coinSplit = require('../split')
const fixtures = require('./fixtures/split')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach((f, k) => {
  tape(f.description, (t) => {
    const inputs = utils.valuesToObjects(f.inputs)
    var outputs = f.outputs

    // avoid useless information in the fixtures
    if (typeof outputs === 'number') {
      outputs = []
      for (var i = 0; i < f.outputs; ++i) outputs.push({})
    }

    const result = coinSplit(inputs, outputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)
    t.equal(outputs.length, f.outputs.length || f.outputs)

    // drop non-index related input data for easy result comparison
    if (result.inputs) {
      t.equal(result.inputs, inputs)
      result.inputs = true
    }

    if (result.outputs) {
      result.outputs = utils.objectsToValues(result.outputs)
    }

    t.deepEqual(result, f.expected)
    t.end()
  })
})
