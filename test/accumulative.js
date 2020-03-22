var coinAccum = require('../accumulative')
var fixtures = require('./fixtures/accumulative')
var tape = require('tape')
var utils = require('./_utils')
var defaultOpts = require('../defaultOpts')
var defaultOptsObj = defaultOpts.defaultOpts

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = defaultOptsObj.changeInputLengthEstimate
    var outputLength = defaultOptsObj.changeOutputLength

    var inputs = utils.expand(f.inputs, true, inputLength)
    var outputs = utils.expand(f.outputs, false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinAccum(inputs, outputs, f.feeRate)

    t.same(actual, expected)
    if (actual.inputs) {
      var feedback = coinAccum(actual.inputs, actual.outputs, f.feeRate)
      t.same(feedback, expected)
    }

    t.end()
  })
})
