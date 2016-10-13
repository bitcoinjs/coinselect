'use-strict'

const coinBreak = require('../broken')
const fixtures = require('./fixtures/broken')
const tape = require('tape')
const utils = require('./_utils')

fixtures.forEach(function (f, k) {
  tape(f.description, function (t) {
    const inputs = utils.valuesToObjects(f.inputs)
    const output = Object.assign({}, f.output.value ? f.output : { value: f.output })
    const result = coinBreak(inputs, output, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)

    // drop unneeded data for result comparison
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

tape('fails for non-finite value', function (t) {
  t.plan(2)
  t.throws(function () {
    coinBreak([], { value: NaN }, 20)
  })

  t.throws(function () {
    coinBreak([], {}, 20)
  })
})
