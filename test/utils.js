var tape = require('tape')
var utils = require('../utils')
var BN = require('bn.js')
var ext = require('../bn-extensions')

tape('utils', function (t) {
  t.test('uintOrNull', function (t) {
    t.plan(8)
    t.ok(utils.uintOrNull(new BN(1)).cmp(ext.BN_ONE) === 0)
    t.equal(!utils.uintOrNull(''), true)
    t.equal(!utils.uintOrNull(Infinity), true)
    t.equal(!utils.uintOrNull(NaN), true)
    t.equal(!utils.uintOrNull('1'), true)
    t.equal(!utils.uintOrNull('1.1'), true)
    t.equal(!utils.uintOrNull(1.1), true)
    t.equal(!utils.uintOrNull(-1), true)
  })

  t.end()
})
