let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD
let feeRate = 56 * 100
let results = []

let walletType = 'p2pkh' // set to either p2pkh or p2sh

// data from blockchaing from ~august 2015 - august 2017
// see https://gist.github.com/runn1ng/8e2881e5bb44e01748e46b3d1c549038
// these are 2-of-3 lengths, most common p2sh (66%), percs changed so they add to 100
let scripthashScriptLengthData = {
  prob: 0.16,
  inLengthPercs: {
    252: 25.29,
    253: 49.77,
    254: 24.94
  },
  outLength: 23
}

// these are compressed key length (90% of p2pkh inputs)
// percs changed so they add to 100
let pubkeyhashScriptLengthData = {
  prob: 0.84,
  inLengthPercs: {
    105: 0.4,
    106: 50.7,
    107: 48.81,
    108: 0.09
  },
  outLength: 25
}

let selectedData = walletType === 'p2pkh' ? pubkeyhashScriptLengthData : scripthashScriptLengthData
let inLengthProbs = selectedData.inLengthPercs

let outLengthProbs = {};
[scripthashScriptLengthData, pubkeyhashScriptLengthData].forEach(({prob, outLength}) => {
  outLengthProbs[outLength] = prob
})

// n samples
for (var j = 0; j < 100; ++j) {
  if (j % 200 === 0) console.log('Iteration', j)

  let stages = []

  for (var i = 1; i < 4; ++i) {
    let utxos = Simulation.generateTxos(20 / i, min, max, inLengthProbs)
    let txos = Simulation.generateTxos(80 / i, min, max / 3, outLengthProbs)
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
      stage.txos.forEach((txo) => simulation.runQueued([txo]))
    })

    simulation.finish()
    results.push(simulation)
  }
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
      result.utxos += stats.utxos
      result.average = {
        nInputs: result.inputs / result.transactions,
        nOutputs: result.outputs / result.transactions,
        fee: Math.round(result.fees / result.transactions),
        feeRate: Math.round(result.fees / result.bytes)
      }
      result.totalCost += stats.totalCost
    } else {
      resultMap[stats.name] = Object.assign({}, stats)
    }
  })

  return Object.keys(resultMap).map(k => ({ stats: resultMap[k] }))
}

function pad (i) {
  if (typeof i === 'number') i = Math.round(i * 1000) / 1000
  return ('          ' + i).slice(-10)
}

merge(results).sort((a, b) => {
  if (a.stats.transactions !== b.stats.transactions) return b.stats.transactions - a.stats.transactions
  return a.stats.totalCost - b.stats.totalCost

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
    '| DNF', (100 * DNF).toFixed(2) + '%',
    '| totalCost', pad('' + Math.round(stats.totalCost / 1000)),
    '| utxos', pad('' + stats.utxos)
  )
})
