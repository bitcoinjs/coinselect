var coinBreak = require('../break')
var fixtures = require('./fixtures/break')
var tape = require('tape')
var utils = require('./_utils')
var defaultOpts = require('../defaultOpts')
var defaultOptsObj = defaultOpts.defaultOpts

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = defaultOptsObj.changeInputLengthEstimate
    var outputLength = defaultOptsObj.changeOutputLength

    var inputs = utils.expand(f.inputs, false, inputLength)
    var outputs = utils.expand([f.output], false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinBreak(inputs, outputs[0], f.feeRate)

    t.same(actual, expected)
    t.end()
  })
})
