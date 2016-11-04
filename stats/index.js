let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD

let results = []
let utxos = Simulation.generateTxos(15, min, max)

// n samples
for (var j = 0; j < 1000; ++j) {
  // for each strategy
  for (var name in modules) {
    let f = modules[name]
    let simulation = new Simulation(name, f, 56)
    utxos.forEach(x => simulation.addUTXO(x))

    // n transactions
    for (let i = 0; i < 50; ++i) {
      let outputs = Simulation.generateTxos(1, min, max)
      outputs.forEach(x => (x.address = 'A'))

      simulation.run(outputs)
    }

    results.push(simulation)
  }
}

function pad (i) {
  if (typeof i === 'number') i = Math.round(i * 1000) / 1000
  return ('          ' + i).slice(-10)
}

function merge (results) {
  let resultMap = {}

  results.forEach(x => {
    let { stats } = x
    let result = resultMap[stats.name]

    if (result) {
      result.inputs += stats.inputs
      result.outputs += stats.outputs
      result.transactions += stats.transactions
      result.failed += stats.failed
      result.fees += stats.fees
      result.bytes += stats.bytes
    } else {
      resultMap[stats.name] = Object.assign({}, stats)
    }
  })

  return Object.keys(resultMap).map(k => ({ stats: resultMap[k] }))
}

// sort by transactions ASCENDING
// then fees DESCENDING
// top 20 only
merge(results).sort((a, b) => {
  let aDNF = a.stats.failed / (a.stats.failed + a.stats.transactions)
  let bDNF = b.stats.failed / (b.stats.failed + b.stats.transactions)

  return aDNF - bDNF
}).slice(0, 20).forEach(x => {
  let { stats } = x
  let nInputs = stats.inputs / stats.transactions
  let nOutputs = stats.outputs / stats.transactions
  let DNF = stats.failed / (stats.failed + stats.transactions)
  let feeRateAverage = Math.floor(stats.fees / stats.bytes)
  let feeAverage = Math.floor(stats.fees / stats.transactions)

  console.log(
    pad(stats.name),
    '| fee', pad('' + feeAverage),
    '| feeRate', pad('' + feeRateAverage),
    '| nInputs', pad(nInputs),
    '| nOutputs', pad(nOutputs),
    '| DNF', Math.round(100 * DNF) + '%'
  )
})
