let minimalSelect = require('../minimal')
let fixtures = require('./fixtures/minimal')
let tape = require('tape')

fixtures.forEach((f) => {
  tape(f.description, (t) => {
    let inputs = f.inputs.map((x, i) => ({ i, value: x }))
    let outputs = f.outputs.map(x => x.script ? x : { value: x })
    let result = minimalSelect(inputs, outputs, f.feeRate)

    // drop non-index related input data for easy result comparison
    if (result.inputs) {
      result.inputs = result.inputs.map(input => input.i)
    }

    if (result.outputs) {
      result.outputs = result.outputs.map(x => x.script ? x : x.value)
    }

    t.deepEqual(result, f.expected)
    t.end()
  })
})
