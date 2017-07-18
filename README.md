# coinselect

[![TRAVIS](https://secure.travis-ci.org/bitcoinjs/coinselect.png)](http://travis-ci.org/bitcoinjs/coinselect)
[![NPM](http://img.shields.io/npm/v/coinselect.svg)](https://www.npmjs.org/package/coinselect)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

An unspent transaction output (UTXO) selection module for bitcoin.


## Algorithms
Module | Algorithm | UTXOs Order
-|-|-
`require('coinselect')` | Blackjack, with Accumulative fallback | By Descending Value
`require('coinselect/accumulative')` | Accumulative - accumulates inputs until the target value is met, skipping detrimental inputs | -
`require('coinselect/blackjack')` | Blackjack - accumulates inputs until the target value is matched, does not accumulate inputs that go over the target value (within a threshold) | -
`require('coinselect/break')` | Break - breaks the input values into equal denominations of `output` (as provided) | -
`require('coinselect/split')` | Split - splits the input values evenly between all `outputs`, unchanges any `output` with a `.value` set | -


## Example

``` javascript
let coinSelect = require('coinselect')
let feeRate = 55 // satoshis per byte
let utxos = [
  ...,
  {
    txId: '...',
    vout: 0,
    ...,
    value: 10000
  }
]
let targets = [
  ...,
  {
    address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
    value: 5000
  }
]

// ...
let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate)

// the accumulated fee is always returned for analysis
console.log(fee)

// .inputs and .outputs will be undefined if no solution was found
if (!inputs || !outputs) return

let txb = new bitcoin.TransactionBuilder()

inputs.forEach(input => txb.addInput(input.txId, input.vout))
outputs.forEach(output => {
  // watch out, outputs may have been added that you need to provide
  // an output address/script for
  if (!output.address) {
    output.address = wallet.getChangeAddress()
  }

  txb.addOutput(output.address, output.value)
})
```


## License [MIT](LICENSE)
