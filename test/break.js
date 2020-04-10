var coinBreak = require('../break')
var fixtures = require('./fixtures/break')
var tape = require('tape')
var utils = require('./_utils')

fixtures.forEach(function (f) {
  tape(f.description, function (t) {
    var inputLength = f.inputLength
    var outputLength = f.outputLength

    var inputs = utils.expand(f.inputs, false, inputLength)
    var outputs = utils.expand([f.output], false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinBreak(inputs, outputs[0], f.feeRate, inputLength, outputLength)

    t.same(actual, expected)
    t.end()
  })
})
