function generate (target, range) {
  let arr = []

  while (target > 0) {
    let value = Math.floor(Math.random() * range)
    target -= value
    arr.push({ value })
  }

  return arr
}

function pad (i) {
  if (typeof i === 'number') {
    i = Math.round(i * 1000) / 1000
  }

  return ('          ' + i).slice(-10)
}

//
let strategies = [
  'bestof', 'maximal', 'minimal', 'random', 'proximal', // plain accumulative
  'blackmax', 'blackmin', 'blackrand', // blackjack & accumulative
  '../blackjack', '../accum', '../split', '../'
]

let modules = strategies.map(name => ({ name, f: require('./' + name) }))

function evaluate (algorithm, utxos, targets, feeRate) {
  const nTransactions = targets.length
  let cnc = targets.length
  let feeAccum = 0
  let nOutputs = 0
  let nInputs = 0
  let o = 0

  let utxoMap = {}

  function addUtxo (txo) {
    if (txo.external) return
    utxoMap[o] = { id: o, value: txo.value }

    ++o
    ++nOutputs
  }

  utxos.forEach(addUtxo)

  targets.forEach((target) => {
    let nowUtxos = []
    for (var id in utxoMap) {
      nowUtxos.push(utxoMap[id])
    }

    let { inputs, outputs, fee } = algorithm(nowUtxos, [target], feeRate)
    if (!inputs) return
    feeAccum += fee
    --cnc

    inputs.forEach(x => {
      ++nInputs
      delete utxoMap[x.id]
    })
    outputs.forEach(addUtxo)
  })

  return { feeAccum, nTransactions, nInputs, nOutputs, cnc }
}

let resultMap = {}

for (var m = 1; m < 5; ++m) {
  for (var l = 1; l < 3; ++l) {
    for (var k = 1; k < 3; ++k) {
      let feeRate = 56 / l
      let amount = 300000000 // 3BTC
      let utxos = generate(amount, 20000000 * k) // 0.2BTC max
      let outputs = generate(amount, 2000000 / m) // spend ~54USD max
      outputs.forEach(x => (x.external = true))

      console.log('UTXOS', utxos.length, 'Transactions', outputs.length)

      modules.forEach(({ name, f }) => {
        let x = evaluate(f, utxos, outputs, feeRate)

        if (!resultMap[name]) {
          resultMap[name] = x
          return
        }

        let y = resultMap[name]
        y.feeAccum += x.feeAccum
        y.nTransactions += x.nTransactions
        y.nInputs += x.nInputs
        y.nOutputs += x.nOutputs
        y.cnc += x.cnc
      })
    }
  }
}

let results = []
for (let name in resultMap) {
  let x = resultMap[name]

  x.name = name
  x.nTC = x.nTransactions - x.cnc
  x.nIT = x.nInputs / x.nTC
  x.nOT = x.nOutputs / x.nTC
  x.DNF = x.cnc / x.nTransactions

  results.push(x)
}

results.sort((a, b) => {
  return b.feeAccum - a.feeAccum
})

results.forEach(x => {
  console.log(pad(x.name), '| fA', pad('' + x.feeAccum), '| NIT', pad(x.nIT), '| NOT', pad(x.nOT), '| DNF', Math.round(100 * x.DNF) + '%')
})
