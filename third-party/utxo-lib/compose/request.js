"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndParseRequest = validateAndParseRequest;
const address_1 = require("../address");
const embed_1 = require("../payments/embed");
const coinselectUtils_1 = require("../coinselect/coinselectUtils");
function validateAndParseFeeRate(rate) {
    const feeRate = typeof rate === 'string' ? Number(rate) : rate;
    if (typeof feeRate !== 'number' ||
        Number.isNaN(feeRate) ||
        !Number.isFinite(feeRate) ||
        feeRate > Number.MAX_SAFE_INTEGER ||
        feeRate <= 0) {
        return;
    }
    return feeRate;
}
function transformInput(i, utxo, txType) {
    if (typeof utxo.coinbase !== 'boolean') {
        throw new Error('Missing coinbase');
    }
    if (typeof utxo.own !== 'boolean') {
        throw new Error('Missing own');
    }
    if (typeof utxo.confirmations !== 'number') {
        throw new Error('Missing confirmations');
    }
    const value = (0, coinselectUtils_1.bignumberOrNaN)(utxo.amount);
    if (!value) {
        throw new Error('Invalid amount');
    }
    return Object.assign(Object.assign({}, utxo), { type: txType, i, script: { length: coinselectUtils_1.INPUT_SCRIPT_LENGTH[txType] }, value });
}
function validateAndParseUtxos(txType, { utxos }) {
    if (utxos.length === 0) {
        return { type: 'error', error: 'MISSING-UTXOS' };
    }
    const incorrectUtxoError = (index, message) => ({
        type: 'error',
        error: 'INCORRECT-UTXO',
        message: `${message} at index ${index}`,
    });
    const result = [];
    for (let i = 0; i < utxos.length; i++) {
        try {
            const csInput = transformInput(i, utxos[i], txType);
            csInput.weight = (0, coinselectUtils_1.inputWeight)(csInput);
            result.push(csInput);
        }
        catch (error) {
            return incorrectUtxoError(i, error.message);
        }
    }
    return result;
}
function transformOutput(output, txType, network) {
    const script = { length: coinselectUtils_1.OUTPUT_SCRIPT_LENGTH[txType] };
    if (output.type === 'payment') {
        const value = (0, coinselectUtils_1.bignumberOrNaN)(output.amount);
        if (!value)
            throw new Error('Invalid amount');
        return {
            value,
            script: (0, address_1.toOutputScript)(output.address, network),
        };
    }
    if (output.type === 'payment-noaddress') {
        const value = (0, coinselectUtils_1.bignumberOrNaN)(output.amount);
        if (!value)
            throw new Error('Invalid amount');
        return {
            value,
            script,
        };
    }
    if (output.type === 'opreturn') {
        return {
            value: (0, coinselectUtils_1.bignumberOrNaN)('0', true),
            script: (0, embed_1.p2data)({ data: [Buffer.from(output.dataHex, 'hex')] }).output,
        };
    }
    if (output.type === 'send-max') {
        return {
            script: (0, address_1.toOutputScript)(output.address, network),
        };
    }
    if (output.type === 'send-max-noaddress') {
        return {
            script,
        };
    }
    throw new Error('Unknown output type');
}
function validateAndParseOutputs(txType, { outputs, network }) {
    if (outputs.length === 0) {
        return { type: 'error', error: 'MISSING-OUTPUTS' };
    }
    const incorrectOutputError = (index, message) => ({
        type: 'error',
        error: 'INCORRECT-OUTPUT',
        message: `${message} at index ${index}`,
    });
    let sendMaxOutputIndex = -1;
    const result = [];
    for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i];
        if (output.type === 'send-max-noaddress' || output.type === 'send-max') {
            if (sendMaxOutputIndex >= 0) {
                return incorrectOutputError(i, 'Multiple send-max');
            }
            sendMaxOutputIndex = i;
        }
        try {
            const csOutput = transformOutput(output, txType, network);
            csOutput.weight = (0, coinselectUtils_1.outputWeight)(csOutput);
            result.push(csOutput);
        }
        catch (error) {
            return incorrectOutputError(i, error.message);
        }
    }
    return {
        outputs: result,
        sendMaxOutputIndex,
    };
}
function validateAndParseChangeOutput(txType, { changeAddress, network }) {
    try {
        return transformOutput(Object.assign({ type: 'send-max' }, changeAddress), txType, network);
    }
    catch (error) {
        return {
            type: 'error',
            error: 'INCORRECT-OUTPUT',
            message: error.message,
        };
    }
}
function validateAndParseRequest(request) {
    const feeRate = validateAndParseFeeRate(request.feeRate);
    if (!feeRate) {
        return { type: 'error', error: 'INCORRECT-FEE-RATE' };
    }
    const longTermFeeRate = validateAndParseFeeRate(request.longTermFeeRate);
    if (request.longTermFeeRate != null && !longTermFeeRate) {
        return { type: 'error', error: 'INCORRECT-FEE-RATE' };
    }
    const txType = request.txType || 'p2pkh';
    const inputs = validateAndParseUtxos(txType, request);
    if ('error' in inputs) {
        return inputs;
    }
    const outputs = validateAndParseOutputs(txType, request);
    if ('error' in outputs) {
        return outputs;
    }
    const changeOutput = validateAndParseChangeOutput(txType, request);
    if ('error' in changeOutput) {
        return changeOutput;
    }
    const feePolicy = (0, coinselectUtils_1.getFeePolicy)(request.network);
    return Object.assign(Object.assign({ txType,
        inputs }, outputs), { changeOutput,
        feeRate,
        feePolicy,
        longTermFeeRate, dustThreshold: request.dustThreshold, baseFee: request.baseFee, floorBaseFee: request.floorBaseFee, sortingStrategy: request.sortingStrategy });
}
//# sourceMappingURL=request.js.map