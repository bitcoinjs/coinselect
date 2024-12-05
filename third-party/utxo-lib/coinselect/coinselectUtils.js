"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OUTPUT_SCRIPT_LENGTH = exports.INPUT_SCRIPT_LENGTH = exports.ZERO = void 0;
exports.getVarIntSize = getVarIntSize;
exports.inputWeight = inputWeight;
exports.inputBytes = inputBytes;
exports.outputWeight = outputWeight;
exports.outputBytes = outputBytes;
exports.getFeeForBytes = getFeeForBytes;
exports.transactionWeight = transactionWeight;
exports.transactionBytes = transactionBytes;
exports.getDustAmount = getDustAmount;
exports.bignumberOrNaN = bignumberOrNaN;
exports.sumOrNaN = sumOrNaN;
exports.getFeePolicy = getFeePolicy;
exports.getFee = getFee;
exports.finalize = finalize;
exports.anyOf = anyOf;
exports.utxoScore = utxoScore;
exports.sortByScore = sortByScore;
exports.filterCoinbase = filterCoinbase;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const networks_1 = require("../networks");
exports.ZERO = new bn_js_1.default(0);
exports.INPUT_SCRIPT_LENGTH = {
    p2pkh: 108,
    p2sh: 107,
    p2tr: 65,
    p2wpkh: 107,
    p2wsh: 107,
};
exports.OUTPUT_SCRIPT_LENGTH = {
    p2pkh: 25,
    p2sh: 23,
    p2tr: 34,
    p2wpkh: 22,
    p2wsh: 34,
};
const SEGWIT_INPUT_SCRIPT_TYPES = ['p2sh', 'p2tr', 'p2wpkh', 'p2wsh'];
const TX_BASE = 32;
const INPUT_SIZE = 160;
const DUST_RELAY_FEE_RATE = 3;
function getVarIntSize(length) {
    if (length < 253)
        return 1;
    if (length < 65536)
        return 3;
    if (length < 4294967296)
        return 5;
    return 9;
}
function inputWeight(input) {
    if (input.weight)
        return input.weight;
    let weight = INPUT_SIZE;
    if (!SEGWIT_INPUT_SCRIPT_TYPES.includes(input.type)) {
        weight += 4 * input.script.length;
    }
    else {
        if (input.type === 'p2sh') {
            weight += 4 * (2 + 22);
        }
        else {
            weight += 4;
        }
        weight += 1 + input.script.length;
    }
    return weight;
}
function inputBytes(input) {
    return Math.ceil(inputWeight(input) / 4);
}
function outputWeight(output) {
    if (output.weight)
        return output.weight;
    return 4 * (8 + 1 + output.script.length);
}
function outputBytes(output) {
    return Math.ceil(outputWeight(output) / 4);
}
function getFeeForBytes(feeRate, bytes) {
    return Math.ceil(feeRate * bytes);
}
function transactionWeight(inputs, outputs) {
    const segwitInputs = inputs.filter(i => SEGWIT_INPUT_SCRIPT_TYPES.includes(i.type)).length;
    return (TX_BASE +
        4 * getVarIntSize(inputs.length) +
        inputs.reduce((x, i) => x + inputWeight(i), 0) +
        4 * getVarIntSize(outputs.length) +
        outputs.reduce((x, o) => x + outputWeight(o), 0) +
        (segwitInputs ? 2 + (inputs.length - segwitInputs) : 0));
}
function transactionBytes(inputs, outputs) {
    return Math.ceil(transactionWeight(inputs, outputs) / 4);
}
function getDustAmount(feeRate, { txType, longTermFeeRate, dustThreshold, }) {
    const inputSize = inputBytes({
        type: txType,
        script: {
            length: exports.INPUT_SCRIPT_LENGTH[txType],
        },
    });
    const longTermFee = longTermFeeRate ? Math.min(feeRate, longTermFeeRate) : 0;
    const dustRelayFeeRate = Math.max(longTermFee, DUST_RELAY_FEE_RATE);
    return Math.max(dustThreshold || 0, getFeeForBytes(dustRelayFeeRate, inputSize));
}
function bignumberOrNaN(v, forgiving = false) {
    if (bn_js_1.default.isBN(v))
        return v;
    const defaultValue = forgiving ? exports.ZERO : undefined;
    if (!v || typeof v !== 'string' || !/^\d+$/.test(v))
        return defaultValue;
    try {
        return new bn_js_1.default(v);
    }
    catch (_a) {
        return defaultValue;
    }
}
function sumOrNaN(range, forgiving = false) {
    return range.reduce((a, x) => {
        if (!a)
            return a;
        const value = bignumberOrNaN(x.value);
        if (!value)
            return forgiving ? exports.ZERO.add(a) : undefined;
        return value.add(a);
    }, exports.ZERO);
}
function getFeePolicy(network) {
    if ((0, networks_1.isNetworkType)('doge', network))
        return 'doge';
    if ((0, networks_1.isNetworkType)('zcash', network))
        return 'zcash';
    return 'bitcoin';
}
function getBitcoinFee(inputs, outputs, feeRate, { baseFee = 0, floorBaseFee }) {
    const bytes = transactionBytes(inputs, outputs);
    const defaultFee = getFeeForBytes(feeRate, bytes);
    return baseFee && floorBaseFee
        ?
            baseFee * (1 + Math.floor(defaultFee / baseFee))
        :
            baseFee + defaultFee;
}
function getDogeFee(inputs, outputs, feeRate, _a) {
    var { dustThreshold = 0 } = _a, options = tslib_1.__rest(_a, ["dustThreshold"]);
    const fee = getBitcoinFee(inputs, outputs, feeRate, options);
    const limit = new bn_js_1.default(dustThreshold);
    const dustOutputsCount = outputs.filter(({ value }) => value && value.lt(limit)).length;
    return fee + dustOutputsCount * dustThreshold;
}
const MARGINAL_FEE_ZAT_PER_ACTION = 5000;
const GRACE_ACTIONS = 2;
const P2PKH_STANDARD_INPUT_SIZE = 150;
const P2PKH_STANDARD_OUTPUT_SIZE = 34;
function getZcashFee(inputs, outputs, feeRate, options) {
    const fee = getBitcoinFee(inputs, outputs, feeRate, options);
    const txInTotalBytes = inputs.reduce((sum, i) => sum + inputBytes(i), 0);
    const txOutTotalBytes = outputs.reduce((sum, o) => sum + outputBytes(o), 0);
    const actions = Math.max(GRACE_ACTIONS, Math.ceil(txInTotalBytes / P2PKH_STANDARD_INPUT_SIZE), Math.ceil(txOutTotalBytes / P2PKH_STANDARD_OUTPUT_SIZE));
    return Math.max(actions * MARGINAL_FEE_ZAT_PER_ACTION, fee);
}
function getFee(inputs, outputs, feeRate, _a = {}) {
    var { feePolicy } = _a, options = tslib_1.__rest(_a, ["feePolicy"]);
    switch (feePolicy) {
        case 'doge':
            return getDogeFee(inputs, outputs, feeRate, options);
        case 'zcash':
            return getZcashFee(inputs, outputs, feeRate, options);
        default:
            return getBitcoinFee(inputs, outputs, feeRate, options);
    }
}
function finalize(inputs, outputs, feeRate, options) {
    const changeOutput = options.changeOutput || {
        script: { length: exports.OUTPUT_SCRIPT_LENGTH[options.txType] },
    };
    const fee = getFee(inputs, outputs, feeRate, options);
    const feeAfterExtraOutput = getFee(inputs, [...outputs, changeOutput], feeRate, options);
    const sumInputs = sumOrNaN(inputs);
    const sumOutputs = sumOrNaN(outputs);
    if (!sumInputs || !sumOutputs || sumInputs.sub(sumOutputs).lt(new bn_js_1.default(fee))) {
        return { fee };
    }
    const remainderAfterExtraOutput = sumInputs.sub(sumOutputs.add(new bn_js_1.default(feeAfterExtraOutput)));
    const dustAmount = getDustAmount(feeRate, options);
    const finalOutputs = [...outputs];
    if (remainderAfterExtraOutput.gte(new bn_js_1.default(dustAmount))) {
        finalOutputs.push(Object.assign(Object.assign({}, changeOutput), { value: remainderAfterExtraOutput }));
    }
    return {
        inputs,
        outputs: finalOutputs,
        fee: sumInputs.sub(sumOrNaN(finalOutputs, true)).toNumber(),
    };
}
function anyOf(algorithms) {
    return (utxos, outputs, feeRate, options) => {
        let result = { fee: 0 };
        for (let i = 0; i < algorithms.length; i++) {
            const algorithm = algorithms[i];
            result = algorithm(utxos, outputs, feeRate, options);
            if (result.inputs) {
                return result;
            }
        }
        return result;
    };
}
function utxoScore(x, feeRate) {
    return x.value.sub(new bn_js_1.default(getFeeForBytes(feeRate, inputBytes(x))));
}
function sortByScore(feeRate) {
    return (a, b) => {
        const difference = utxoScore(a, feeRate).sub(utxoScore(b, feeRate));
        if (difference.eq(exports.ZERO)) {
            return a.i - b.i;
        }
        return difference.isNeg() ? 1 : -1;
    };
}
function filterCoinbase(utxos, minConfCoinbase) {
    return utxos.filter(utxo => {
        if (utxo.coinbase && !utxo.required) {
            return utxo.confirmations >= minConfCoinbase;
        }
        return true;
    });
}
//# sourceMappingURL=coinselectUtils.js.map