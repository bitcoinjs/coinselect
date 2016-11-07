let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD
let feeRate = 56 * 100
let results = []

// n samples
for (var j = 0; j < 100; ++j) {
  if (j % 200 === 0) console.log('Iteration', j)

  let stages = []

  for (var i = 1; i < 4; ++i) {
    let utxos = Simulation.generateTxos(20 / i, min, max)
    let txos = Simulation.generateTxos(80 / i, min, max / 3)

    stages.push({ utxos, txos })
  }

  // for each strategy
  for (var name in modules) {
    let f = modules[name]
    let simulation = new Simulation(name, f, feeRate)

    stages.forEach((stage) => {
      // supplement our UTXOs
      stage.utxos.forEach(x => simulation.addUTXO(x))

      // now, run stage.txos.length transactions
      stage.txos.forEach((txo) => simulation.run([txo]))
    })

    results.push(simulation)
  }
}

function pad (i) {
  if (typeof i === 'number') i = Math.round(i * 1000) / 1000
  return ('          ' + i).slice(-10)
}

function merge (results) {
  let resultMap = {}

  results.forEach(({ stats }) => {
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
    } else {
      resultMap[stats.name] = Object.assign({}, stats)
    }
  })

  return Object.keys(resultMap).map(k => ({ stats: resultMap[k] }))
}

merge(results).sort((a, b) => {
  if (a.stats.transactions !== b.stats.transactions) return b.stats.transactions - a.stats.transactions
  return a.stats.fees - b.stats.fees

// top 20 only
}).slice(0, 20).forEach((x, i) => {
  let { stats } = x
  let DNF = stats.failed / (stats.transactions + stats.failed)

  console.log(
    pad(i),
    pad(stats.name),
    '| transactions', pad('' + stats.transactions),
    '| fee', pad('' + stats.average.fee),
    '| feeRate', pad('' + stats.average.feeRate),
    '| nInputs', pad(stats.average.nInputs),
    '| nOutputs', pad(stats.average.nOutputs),
    '| DNF', (100 * DNF).toFixed(2) + '%'
  )
})
