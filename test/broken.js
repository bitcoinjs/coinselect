let coinBreak = require('../broken')
let fixtures = require('./fixtures/broken')
let tape = require('tape')

fixtures.forEach((f, k) => {
  tape(f.description, (t) => {
    let inputs = f.inputs.map((x, i) => x.value ? x : { value: x })
    let output = Object.assign({}, f.output.value ? f.output : { value: f.output })
    let result = coinBreak(inputs, output, f.feeRate)

    // ensure arguments were not modified
    t.equal(inputs.length, f.inputs.length)

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

tape('fails for non-finite value', (t) => {
  t.plan(2)
  t.throws(() => {
    coinBreak([], { value: NaN }, 20)
  })

  t.throws(() => {
    coinBreak([], {}, 20)
  })
})
