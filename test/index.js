/* global beforeEach, describe, it */

var assert = require('assert')

var coinSelect = require('../')
var fixtures = require('./fixtures')

describe('coinSelect', function () {
  fixtures.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value, i) { return { i: i, value: value } })
    })

    it(f.description, function () {
      var result = coinSelect(unspents, outputs, f.feePerKb)

      // map to indexes for fixture comparison
      if (result.inputs) {
        result.inputs = result.inputs.map(function (input) { return input.i })
      }

      assert.deepEqual(result, f.expected)
    })
  })
})
