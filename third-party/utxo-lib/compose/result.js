"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorResult = getErrorResult;
exports.getResult = getResult;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const coinselectUtils_1 = require("../coinselect/coinselectUtils");
const transaction_1 = require("./transaction");
const types_1 = require("../types");
function getErrorResult(error) {
    const message = error instanceof Error ? error.message : `${error}`;
    const known = types_1.COMPOSE_ERROR_TYPES.find(e => e === message);
    if (known) {
        return { type: 'error', error: known };
    }
    return { type: 'error', error: 'COINSELECT', message };
}
function splitByCompleteness(outputs) {
    const complete = [];
    const incomplete = [];
    outputs.forEach(output => {
        if (output.type === 'payment' || output.type === 'send-max' || output.type === 'opreturn') {
            complete.push(output);
        }
        else {
            incomplete.push(output);
        }
    });
    return {
        complete,
        incomplete,
    };
}
function getResult(request, { sendMaxOutputIndex }, result) {
    if (!result.inputs || !result.outputs) {
        return { type: 'error', error: 'NOT-ENOUGH-FUNDS' };
    }
    const totalSpent = result.outputs.reduce((total, output, index) => {
        if (request.outputs[index]) {
            return total.add(output.value);
        }
        return total;
    }, new bn_js_1.default(result.fee));
    const max = sendMaxOutputIndex >= 0 ? result.outputs[sendMaxOutputIndex].value.toString() : undefined;
    const bytes = (0, coinselectUtils_1.transactionBytes)(result.inputs, result.outputs);
    const feePerByte = result.fee / bytes;
    const { complete, incomplete } = splitByCompleteness(request.outputs);
    if (incomplete.length > 0) {
        const inputs = result.inputs.map(input => request.utxos[input.i]);
        return {
            type: 'nonfinal',
            fee: result.fee.toString(),
            feePerByte: feePerByte.toString(),
            bytes,
            max,
            totalSpent: totalSpent.toString(),
            inputs,
        };
    }
    const transaction = (0, transaction_1.createTransaction)(Object.assign(Object.assign({}, request), { outputs: complete }), result);
    return Object.assign({ type: 'final', fee: result.fee.toString(), feePerByte: feePerByte.toString(), bytes,
        max, totalSpent: totalSpent.toString() }, transaction);
}
//# sourceMappingURL=result.js.map