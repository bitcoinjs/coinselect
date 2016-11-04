let Simulation = require('./simulation')
let strategies = [
  'bestof', 'maximal', 'minimal', 'random', 'proximal', // plain accumulative
  'blackmax', 'blackmin', 'blackrand', // blackjack & accumulative
  '../blackjack', '../accum', '../split', '../'
]

let modules = strategies.map(name => ({ name, f: require('./' + name) }))
let min = 14226 // 0.1 USD
let max = 142251558 // 1000 USD

let results = []
modules.forEach(({ name, f }) => {
  let simulation = new Simulation(name, f, 56)
  let utxos = Simulation.generateTxos(1000, min * 10, max * 10)
  utxos.forEach(x => simulation.addUTXO(x))

  // 100 rounds
  for (let i = 0; i < 100; ++i) {
    let outputs = Simulation.generateTxos(1, min, max / 4)
    outputs.forEach(x => (x.address = 'A'))

    simulation.run(outputs)
  }

  results.push(simulation)
})

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
  let fT = stats.failed / stats.transactions

  console.log(
    pad(stats.name),
    '| fA', pad('' + stats.fees),
    '| NIT', pad(nIT),
    '| NOT', pad(nOT),
    '| DNF', Math.round(100 * fT) + '%'
  )
})
