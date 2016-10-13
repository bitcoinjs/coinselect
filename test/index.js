'use-strict'

const coinSelect = require('../')
const fixtures = require('./fixtures')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach((f) => {
  tape(f.description, (t) => {
    const inputs = utils.valuesToObjects(f.inputs, true)
    const outputs = utils.valuesToObjects(f.outputs)
    const result = coinSelect(inputs, outputs, f.feeRate)

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
