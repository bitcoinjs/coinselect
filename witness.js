const { composeTx } = require('@trezor/utxo-lib')

module.exports = function coinSelect ({
	utxos,
	outputs,
	feeRate,
	changeAddress,
	network,
	dustThreshold = 546,
}) {
	const finalOutputs = outputs.map(o => ({
		...o,
		amount: o.type === 'opreturn' || o.type === 'send-max' ? undefined : Number(o.value).toString(),
		type: o.type === 'opreturn' ? 'opreturn' : o.type === 'send-max' ? 'send-max' : 'payment'
	}))

	const result = composeTx({
		utxos: utxos.map(u => ({
			...u,
			coinbase: false,
			amount: Number(u.value).toString(),
		})),
		outputs: finalOutputs,
		feeRate: Number(feeRate).toString(), 
		sortingStrategy: 'random',
		txType: 'p2wpkh',
		dustThreshold,
		changeAddress,
		network
	});

	if (result.type === 'error') {
		throw new Error(result.message)
	}

	return result;
}
