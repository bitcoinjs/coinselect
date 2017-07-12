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

    simulation.finish()
    results.push(simulation)
  }
}

Simulation.printResults(Simulation.mergeResults(results))
