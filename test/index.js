let coinSelect = require('../')
let fixtures = require('./fixtures')
let tape = require('tape')

fixtures.forEach((f) => {
  tape(f.description, (t) => {
    let inputs = f.inputs.map((x, i) => x.value ? Object.assign({ i }, x) : { i, value: x })
    let outputs = f.outputs.map(x => x.script ? x : { value: x })
    let result = coinSelect(inputs, outputs, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)
    t.equal(outputs.length, f.outputs.length)

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
