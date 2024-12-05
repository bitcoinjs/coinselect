const { composeTx } = require('./third-party/utxo-lib')

module.exports = function coinSelect ({
	utxos,
	outputs,
	feeRate,
	changeAddress,
	network,
	txType,
	baseFee = 0,
	dustThreshold = 546,
}) {

	const result = composeTx({
		utxos,
		outputs,
		feeRate, 
		sortingStrategy: 'random',
		txType,
		dustThreshold,
		changeAddress,
		network,
		baseFee
	});

	if (result.type === 'error') {
		throw new Error(result.message || result.error)
	}

	return result;
}
