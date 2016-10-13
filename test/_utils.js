function valuesToObjects (values, indices) {
  if (indices) {
    return values.map(function (x, i) {
      return (x.value || x.script) ? Object.assign({ i: i }, x) : { i: i, value: x }
    })
  }

  return values.map(function (x, i) {
    return (x.value || x.script) ? x : { value: x }
  })
}

function objectsToValues (objects) {
  return objects.map(function (x) {
    return x.script ? x : x.value
  })
}

function indicesOnly (objects) {
  return objects.map(function (x) {
    return x.i
  })
}

module.exports = {
  indicesOnly: indicesOnly,
  objectsToValues: objectsToValues,
  valuesToObjects: valuesToObjects
}
