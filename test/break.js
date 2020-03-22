var coinBreak = require('../break')
var fixtures = require('./fixtures/break')
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
    var outputs = utils.expand([f.output], false, outputLength)
    var expected = utils.addScriptLengthToExpected(f.expected, inputLength, outputLength)

    var actual = coinBreak(inputs, outputs[0], f.feeRate)

    t.same(actual, expected)
    t.end()
  })
})
