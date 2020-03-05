const tape = require('tape')
const utils = require('../utils')

tape('utils', function (t) {
  t.test('uintOrNaN', function (t) {
    t.plan(8)

    t.equal(utils.uintOrNaN(1), 1)
    t.equal(isNaN(utils.uintOrNaN('')), true)
    t.equal(isNaN(utils.uintOrNaN(Infinity)), true)
    t.equal(isNaN(utils.uintOrNaN(NaN)), true)
    t.equal(isNaN(utils.uintOrNaN('1')), true)
    t.equal(isNaN(utils.uintOrNaN('1.1')), true)
    t.equal(isNaN(utils.uintOrNaN(1.1)), true)
    t.equal(isNaN(utils.uintOrNaN(-1)), true)
  })

  t.end()
})
