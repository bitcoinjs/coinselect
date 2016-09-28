# coinselect

[![TRAVIS](https://secure.travis-ci.org/bitcoinjs/coinselect.png)](http://travis-ci.org/bitcoinjs/coinselect)
[![NPM](http://img.shields.io/npm/v/coinselect.svg)](https://www.npmjs.org/package/coinselect)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A transaction input selection module for bitcoin.

The code is stable.

The module's interface is not.

Please let me know if you are using this package.


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

Feedback welcome on the API,  I'm not sure if I like it.


## License [MIT](LICENSE)
