let coinSplit = require('../split')
let fixtures = require('./fixtures/split')
let tape = require('tape')

fixtures.forEach((f, k) => {
  tape(f.description, (t) => {
    let inputs = f.inputs.map((x, i) => x.value ? x : { value: x })
    let outputs = f.outputs

    // avoid useless information in the fixtures
    if (typeof outputs === 'number') {
      outputs = []
      for (var i = 0; i < f.outputs; ++i) outputs.push({})
    }

    let result = coinSplit(inputs, outputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)
    t.equal(outputs.length, f.outputs.length || f.outputs)

    // drop non-index related input data for easy result comparison
    if (result.inputs) {
      t.equal(result.inputs, inputs)
      result.inputs = true
    }

    if (result.outputs) {
      result.outputs = result.outputs.map(x => x.script ? x : x.value)
    }

    t.deepEqual(result, f.expected)
    t.end()
  })
})
