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
    for (let i = 0; i < 15; ++i) {
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
      result.average = {
        nInputs: result.inputs / result.transactions,
        nOutputs: result.outputs / result.transactions,
        fee: Math.round(result.fees / result.transactions),
        feeRate: Math.round(result.fees / result.bytes)
      }
      result.DNF = stats.failed / (stats.failed + stats.transactions)
    } else {
      resultMap[stats.name] = Object.assign({}, stats)
    }
  })

  return Object.keys(resultMap).map(k => ({ stats: resultMap[k] }))
}

// top 20 only
merge(results).sort((a, b) => {
  if (a.stats.DNF !== b.stats.DNF) return a.stats.DNF - b.stats.DNF
  return a.stats.fees - b.stats.fees
}).slice(0, 20).forEach(x => {
  let { stats } = x

  console.log(
    pad(stats.name),
    '| fee', pad('' + stats.average.fee),
    '| feeRate', pad('' + stats.average.feeRate),
    '| nInputs', pad(stats.average.nInputs),
    '| nOutputs', pad(stats.average.nOutputs),
    '| DNF', Math.round(100 * stats.DNF) + '%'
  )
})
