var coinSplit = require('../split')
var fixtures = require('./fixtures/split')
var tape = require('tape')
var utils = require('./_utils')
var processOptions = require('../defaultOpts')
var processOptionsFunc = processOptions.processOptions

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    const options = processOptionsFunc()
    var inputLength = options.changeInputLengthEstimate
    var outputLength = options.changeOutputLength

    var inputs = utils.expand(f.inputs, false, inputLength)
    var outputs = utils.expand(f.outputs.concat(), false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinSplit(inputs, outputs, f.feeRate)

    t.same(actual, expected)
    if (actual.inputs) {
      var feedback = coinSplit(inputs, actual.outputs, f.feeRate)
      t.same(feedback, expected)
    }

    t.end()
  })
})
