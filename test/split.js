var coinSplit = require('../split')
var fixtures = require('./fixtures/split')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = f.inputLength
    var outputLength = f.outputLength

    var inputs = utils.expand(f.inputs, false, inputLength)
    var outputs = utils.expand(f.outputs.concat(), false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinSplit(inputs, outputs, f.feeRate, inputLength, outputLength)

    t.same(actual, expected)
    if (actual.inputs) {
      var feedback = coinSplit(inputs, actual.outputs, f.feeRate, inputLength, outputLength)
      t.same(feedback, expected)
    }

    t.end()
  })
})
