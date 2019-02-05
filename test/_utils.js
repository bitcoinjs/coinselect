var BN = require('bn.js')

function expand (values, indices) {
  if (indices) {
    return values.map(function (x, i) {
      if (BN.isBN(x)) {
        return {
          i: i,
          value: x
        }
      }
      var y = {
        i: i
      }
      for (var k in x) y[k] = x[k]
      return y
    })
  }

  return values.map(function (x, i) {
    return (typeof x === 'object' && !BN.isBN(x)) ? x : {
      value: x
    }
  })
}

function testValues (t, actual, expected) {
  t.equal(typeof actual, typeof expected, 'types match')
  if (!expected) return

  t.equal(actual.length, expected.length, 'lengths match')

  actual.forEach(function (ai, i) {
    var ei = expected[i]

    if (ai.i !== undefined) {
      t.equal(ai.i, ei, 'indexes match')
    } else if (typeof ei === 'number') {
      t.equal(ai.value, ei, 'values match')
    } else {
      t.same(ai, ei, 'objects match')
    }
  })
}

module.exports = {
  expand: expand,
  testValues: testValues
}
