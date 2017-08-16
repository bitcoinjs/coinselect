var weighted = require('weighted')

function rayleight (a, b) {
  return a + b * Math.sqrt(-Math.log(uniform(0, 1)))
}

function uniform (min, max) {
  return min + (max - min) * Math.random()
}

function randomAddress () {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[(Math.random() * 26) >>> 0]
}

var utils = require('../utils')

function Simulation (name, algorithm, feeRate) {
  this.algorithm = algorithm
  this.feeRate = feeRate
  this.utxoMap = {}
  this.stats = {
    name,
    transactions: 0,
    inputs: 0,
    outputs: 0,
    fees: 0,
    bytes: 0,
    failed: 0
  }
  this.start = new Date()

  this.queue = []

  // used for tracking UTXOs (w/o transaction ids)
  this.k = 0
}

Simulation.generateTxos = function (n, min, max, scriptSizes) {
  let txos = []
  for (let i = 0; i < n; ++i) {
    let v = rayleight(min, max) >>> 0

    let s = parseInt(weighted.select(scriptSizes))

    txos.push({
      address: randomAddress(),
      value: v,
      script: {
        length: s
      }
    })
  }
  return txos
}

Simulation.prototype.addUTXO = function (utxo, change) {
  let k = this.k + 1
  if (this.utxoMap[k] !== undefined) throw new Error('Bad UTXO')

  this.utxoMap[k] = Object.assign({}, utxo, { id: k })
  this.k = k
  if (!change) {
    this.tryQueue()
  }
}

Simulation.prototype.useUTXO = function (utxo) {
  if (utxo.id === undefined) throw new Error('Bad UTXO')
  if (this.utxoMap[utxo.id] === undefined) throw new Error('Unknown UTXO')
  delete this.utxoMap[utxo.id]
}

Simulation.prototype.getUTXOs = function () {
  let utxos = []
  for (let k in this.utxoMap) utxos.push(this.utxoMap[k])
  return utxos
}

Simulation.prototype.runQueued = function (outputs) {
  this.queue.push(outputs)
  this.tryQueue()
}

Simulation.prototype.tryQueue = function () {
  while (this.queue.length > 0) {
    let outputs = this.queue[0]
    let utxos = this.getUTXOs()

    let { inputs, outputs: outputs2, fee } = this.algorithm(utxos, outputs, this.feeRate)

    if (!inputs) {
      return
    }

    this.queue.shift()

    this.useAlgorithmResult(inputs, outputs2, fee)
  }
}

Simulation.prototype.run = function (outputs) {
  let utxos = this.getUTXOs()

  let { inputs, outputs: outputs2, fee } = this.algorithm(utxos, outputs, this.feeRate)

  if (!inputs) {
    this.stats.failed += 1
    return
  }

  this.useAlgorithmResult(inputs, outputs2, fee)

  return true
}

Simulation.prototype.useAlgorithmResult = function (inputs, outputs, fee) {
  this.stats.transactions += 1
  this.stats.inputs += inputs.length
  this.stats.outputs += outputs.length
  this.stats.fees += fee
  this.stats.bytes += utils.transactionBytes(inputs, outputs, this.feeRate)
  this.stats.average = {
    nInputs: this.stats.inputs / this.stats.transactions,
    nOutputs: this.stats.outputs / this.stats.transactions,
    fee: Math.round(this.stats.fees / this.stats.transactions),
    feeRate: Math.round(this.stats.fees / this.stats.bytes)
  }

  inputs.forEach(x => this.useUTXO(x))

  // selected outputs w/ no script are change outputs, add them to the UTXO
  outputs.filter(x => x.script === undefined).forEach((x) => {
    // assign it a random address
    x.address = randomAddress()
    this.addUTXO(x, true)
  })
}

Simulation.prototype.finish = function () {
  let utxos = this.getUTXOs()
  this.stats.utxos = utxos.length
  let costToEmpty = utils.transactionBytes(utxos, []) * this.feeRate // output cost is negligible
  this.stats.totalCost = this.stats.fees + costToEmpty
  let end = new Date()
  this.stats.time = end.getTime() - this.start.getTime()
}

Simulation.mergeResults = function (results, sliceSize) {
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
      result.time += stats.time
      result.totalCost += stats.totalCost
    } else {
      result = Object.assign({}, stats)
      resultMap[stats.name] = result
    }

    result.average = {
      nInputs: result.inputs / result.transactions,
      nOutputs: result.outputs / result.transactions,
      fee: Math.round(result.fees / result.transactions),
      feeRate: Math.round(result.fees / result.bytes)
    }
  })

  return Object.keys(resultMap).map(k => ({ stats: resultMap[k] })).sort((a, b) => {
    if (a.stats.transactions !== b.stats.transactions) return b.stats.transactions - a.stats.transactions
    return a.stats.totalCost - b.stats.totalCost
  }).slice(0, sliceSize)
}

function pad (i) {
  if (typeof i === 'number') i = Math.round(i * 1000) / 1000
  return ('          ' + i).slice(-10)
}

Simulation.printResults = function (mergedResults) {
  mergedResults.forEach((x, i) => {
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
      '| time', pad('' + Math.round(stats.time)),
      '| totalCost', pad('' + Math.round(stats.totalCost / 1000)),
      '| utxos', pad('' + stats.utxos)
    )
  })
}

module.exports = Simulation
