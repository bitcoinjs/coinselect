var coinSelect = require('../witness')
var fixtures = require('./fixtures/witness')
var tape = require('tape')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    if (f.shouldThrow) {
      t.throws(() => {
        coinSelect({
          utxos: f.inputs,
          outputs: f.outputs,
          feeRate: f.feeRate,
          network: f.network,
          changeAddress: f.changeAddress
        })
      },
        new RegExp(f.expected),
        f.description
      )
      t.end()
    } else {
      var actual = coinSelect({
        utxos: f.inputs,
        outputs: f.outputs,
        feeRate: f.feeRate,
        network: f.network,
        changeAddress: f.changeAddress
      })

      // Restore the order of outputs according to outputsPermutation
      const reorderOutputs = (outputs, permutation) => {
        return permutation.map(index => outputs[index]);
      };

      actual.outputs = reorderOutputs(actual.outputs, actual.outputsPermutation);
      f.expected.outputs = reorderOutputs(f.expected.outputs, f.expected.outputsPermutation);
      
      t.same(actual.type, f.expected.type)
      t.same(actual.fee, f.expected.fee)
      t.same(actual.feePerByte, f.expected.feePerByte)
      t.same(actual.bytes, f.expected.bytes)
      t.same(actual.max, f.expected.max)
      t.same(actual.totalSpent, f.expected.totalSpent)
      t.same(actual.inputs, f.expected.inputs)
      t.same(actual.outputs, f.expected.outputs)
      t.end()
    }
  })
})
