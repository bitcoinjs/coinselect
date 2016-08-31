# coinselect

[![TRAVIS](https://secure.travis-ci.org/dcousens/coinselect.png)](http://travis-ci.org/dcousens/coinselect)
[![NPM](http://img.shields.io/npm/v/coinselect.svg)](https://www.npmjs.org/package/coinselect)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A fee-optimizing, transaction input selection module for bitcoinjs-lib.

The code is stable.

The module's interface/existence is not.

Please let me know if you are using this package.


## Example

``` javascript
var coinSelect = require('coinselect')

var feeRate = 55 // satoshis per byte
var unspents = [
	...,
	{
		...,
		value: 10000
	}
]
var outputs = [
	...,
	{
		address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
		value: 5000
	}
]

var result = coinselect(unspents, outputs, feeRate)

// the accumulated fee is always returned
console.log(result.fee)

// .inputs may be null if not enough funds exist
if (!result.inputs) return

// success!
var txb = new bitcoin.TransactionBuilder()

// is a change output non-dust?
if (result.remainder > 5460) {
	txb.addOutput(changeAddress, result.remainder)
}
```

Feedback welcome on the API,  I'm not sure if I like it.


## License [MIT](LICENSE)
