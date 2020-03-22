var coinSplit = require('../split')
var fixtures = require('./fixtures/split')
var tape = require('tape')
var utils = require('./_utils')
var defaultOpts = require('../defaultOpts')
var defaultOptsObj = defaultOpts.defaultOpts

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = defaultOptsObj.changeInputLengthEstimate
    var outputLength = defaultOptsObj.changeOutputLength

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
