function rayleight (a, b) {
  return a + b * Math.sqrt(-Math.log(uniform(0, 1)))
}

function uniform (min, max) {
  return min + (max - min) * Math.random()
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

  // used for tracking UTXOs (w/o transaction ids)
  this.k = 0
}

Simulation.generateTxos = function (n, min, max) {
  let txos = []
  for (let i = 0; i < n; ++i) {
    let v = rayleight(min, max) >>> 0
    txos.push({ value: v })
  }
  return txos
}

Simulation.prototype.addUTXO = function (utxo) {
  let k = this.k + 1
  if (this.utxoMap[k] !== undefined) throw new Error('Bad UTXO')

  this.utxoMap[k] = Object.assign({}, utxo, { id: k })
  this.k = k
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

Simulation.prototype.run = function (outputs) {
  let utxos = this.getUTXOs()

  let { inputs, outputs: outputs2, fee } = this.algorithm(utxos, outputs, this.feeRate)

  if (!inputs) {
    this.stats.failed += 1
    this.stats.DNF = this.stats.failed / (this.stats.failed + this.stats.transactions)
    return
  }

  this.stats.transactions += 1
  this.stats.inputs += inputs.length
  this.stats.outputs += outputs2.length
  this.stats.fees += fee
  this.stats.bytes += utils.transactionBytes(inputs, outputs2, this.feeRate)
  this.stats.average = {
    nInputs: this.stats.inputs / this.stats.transactions,
    nOutputs: this.stats.outputs / this.stats.transactions,
    fee: Math.round(this.stats.fees / this.stats.transactions),
    feeRate: Math.round(this.stats.fees / this.stats.bytes)
  }
  this.stats.DNF = this.stats.failed / (this.stats.failed + this.stats.transactions)

  inputs.forEach(x => this.useUTXO(x))

  // selected outputs w/ no address are change addresses, add them to the UTXO
  outputs2.filter(x => x.address === undefined).forEach(x => this.addUTXO(x))
  return true
}

module.exports = Simulation
