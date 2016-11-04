let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD

let results = []
let utxos = Simulation.generateTxos(15, min, max)

// n samples
for (var j = 0; j < 100; ++j) {
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

// sort by transactions ASCENDING
// then fees DESCENDING
// top 20 only
results.sort((a, b) => {
  if (a.stats.transactions !== a.stats.transactions) return a.stats.transactions - b.stats.transactions
  return b.stats.fees - a.stats.fees
}).slice(0, 20).forEach(x => {
  let { stats } = x
  let nInputs = stats.inputs / stats.transactions
  let nOutputs = stats.outputs / stats.transactions
  let failedRatio = stats.failed / (stats.failed + stats.transactions)
  let feeRateAverage = Math.floor(stats.fees / stats.bytes)
  let feeAverage = Math.floor(stats.fees / stats.transactions)

  console.log(
    pad(stats.name),
    '| fee', pad('' + feeAverage),
    '| feeRate', pad('' + feeRateAverage),
    '| nInputs', pad(nInputs),
    '| nOutputs', pad(nOutputs),
    '| DNF', Math.round(100 * failedRatio) + '%'
  )
})
