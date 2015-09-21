/* global beforeEach, describe, it */

var assert = require('assert')

var coinSelect = require('../')
var fixtures = require('./fixtures')

describe('coinSelect', function () {
  fixtures.valid.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value) { return { value: value } })
    })

    it(f.description, function () {
      var result = coinSelect(unspents, outputs, f.feePerKb)

      // ensure remainder is correctly calculated
      assert.equal(result.remainder, f.expected.remainder, 'Invalid remainder: ' + result.remainder + ' !== ' + f.expected.remainder)

      // ensure fee is correctly calculated
      assert.equal(result.fee, f.expected.fee, 'Invalid fee: ' + result.fee + ' !== ' + f.expected.fee)

      // ensure all expected inputs are found
      f.expected.inputs.forEach(function (i, j) {
        assert.equal(result.inputs[j], unspents[i])
      })

      // ensure no other inputs exist
      assert.equal(result.inputs.length, f.expected.inputs.length)
    })
  })

  fixtures.invalid.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value) { return { value: value } })
    })

    it('throws on ' + f.exception, function () {
      assert.throws(function () {
        coinSelect(unspents, outputs, f.feePerKb)
      }, new RegExp(f.exception))
    })
  })
})
