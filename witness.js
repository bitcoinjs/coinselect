const { composeTx } = require('@trezor/utxo-lib')

module.exports = function coinSelect ({
	utxos,
	outputs,
	feeRate,
	changeAddress,
	network,
	dustThreshold = 546,
	txType,
}) {

	const result = composeTx({
		utxos,
		outputs,
		feeRate, 
		sortingStrategy: 'random',
		txType,
		dustThreshold,
		changeAddress,
		network
	});

	if (result.type === 'error') {
		throw new Error(result.message)
	}

	return result;
}
