let Simulation = require('./simulation')
let modules = require('./strategies')
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD

let results = []

for (var name in modules) {
  let f = modules[name]
  let simulation = new Simulation(name, f, 56)

  // 10 UTXOs, min 10 USD, max 10000 USD
  let utxos = Simulation.generateTxos(20, min * 100, max * 10)
  utxos.forEach(x => simulation.addUTXO(x))

  // 500 transactions, min 0.1USD, max 500 USD
  for (let i = 0; i < 500; ++i) {
    let outputs = Simulation.generateTxos(1, min, max / 2)
    outputs.forEach(x => (x.address = 'A'))

    simulation.run(outputs)
  }

  results.push(simulation)
}

function pad (i) {
  if (typeof i === 'number') i = Math.round(i * 1000) / 1000
  return ('          ' + i).slice(-10)
}

// sort by transactions ASCENDING
// then fees DESCENDING
results.sort((a, b) => {
  if (a.stats.transactions !== a.stats.transactions) return a.stats.transactions - b.stats.transactions
  return b.stats.fees - a.stats.fees
}).forEach(x => {
  let { stats } = x
  let nIT = stats.inputs / stats.transactions
  let nOT = stats.outputs / stats.transactions
  let fT = stats.failed / (stats.failed + stats.transactions)

  console.log(
    pad(stats.name),
    '| fA', pad('' + stats.fees),
    '| NIT', pad(nIT),
    '| NOT', pad(nOT),
    '| DNF', Math.round(100 * fT) + '%'
  )
})
