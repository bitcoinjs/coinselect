var tape = require('tape')
var utils = require('../utils')
var BN = require('bn.js')

tape('utils', function (t) {
  t.test('bnOrNaN', function (t) {
    t.plan(8)
    t.ok(utils.bnOrNaN(new BN(1)).cmp(utils.BN_ONE) === 0)
    t.equal(isNaN(utils.bnOrNaN('')), true)
    t.equal(isNaN(utils.bnOrNaN(Infinity)), true)
    t.equal(isNaN(utils.bnOrNaN(NaN)), true)
    t.equal(isNaN(utils.bnOrNaN('1')), true)
    t.equal(isNaN(utils.bnOrNaN('1.1')), true)
    t.equal(isNaN(utils.bnOrNaN(1.1)), true)
    t.equal(isNaN(utils.bnOrNaN(-1)), true)
  })

  t.end()
})
