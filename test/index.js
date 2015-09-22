/* global beforeEach, describe, it */

var assert = require('assert')

var coinSelect = require('../')
var fixtures = require('./fixtures')

describe('coinSelect', function () {
  fixtures.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value) { return { value: value } })
    })

    it(f.description, function () {
      var result = coinSelect(unspents, outputs, f.feePerKb)

      // ensure a solution was found
      if (!f.expected) return assert.equal(result, undefined)

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
})
