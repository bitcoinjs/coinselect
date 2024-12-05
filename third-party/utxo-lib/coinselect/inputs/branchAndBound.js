"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchAndBound = void 0;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const coinselectUtils_1 = require("../coinselectUtils");
const MAX_TRIES = 1000000;
function calculateEffectiveValues(utxos, feeRate) {
    return utxos.map(utxo => {
        const value = (0, coinselectUtils_1.bignumberOrNaN)(utxo.value);
        if (!value) {
            return {
                utxo,
                effectiveValue: coinselectUtils_1.ZERO,
            };
        }
        const effectiveFee = (0, coinselectUtils_1.getFeeForBytes)(feeRate, (0, coinselectUtils_1.inputBytes)(utxo));
        const effectiveValue = value.sub(new bn_js_1.default(effectiveFee));
        return {
            utxo,
            effectiveValue,
        };
    });
}
function search(effectiveUtxos, target, costRange) {
    if (effectiveUtxos.length === 0) {
        return null;
    }
    let tries = MAX_TRIES;
    const selected = [];
    let selectedAccum = coinselectUtils_1.ZERO;
    let done = false;
    let backtrack = false;
    let remaining = effectiveUtxos.reduce((a, x) => x.effectiveValue.add(a), coinselectUtils_1.ZERO);
    let depth = 0;
    while (!done) {
        if (tries <= 0) {
            return null;
        }
        if (selectedAccum.gt(costRange)) {
            backtrack = true;
        }
        else if (selectedAccum.gte(target)) {
            done = true;
        }
        else if (depth >= effectiveUtxos.length) {
            backtrack = true;
        }
        else if (selectedAccum.add(remaining).lt(target)) {
            if (depth === 0) {
                return null;
            }
            backtrack = true;
        }
        else {
            remaining = remaining.sub(effectiveUtxos[depth].effectiveValue);
            selected[depth] = true;
            selectedAccum = selectedAccum.add(effectiveUtxos[depth].effectiveValue);
            depth++;
        }
        if (backtrack) {
            backtrack = false;
            depth--;
            while (!selected[depth]) {
                remaining = remaining.add(effectiveUtxos[depth].effectiveValue);
                depth--;
                if (depth < 0) {
                    return null;
                }
            }
            selected[depth] = false;
            selectedAccum = selectedAccum.sub(effectiveUtxos[depth].effectiveValue);
            depth++;
        }
        tries--;
    }
    return selected;
}
const branchAndBound = (utxos, outputs, feeRate, options) => {
    if (options.baseFee)
        return { fee: 0 };
    if (utxos.find(u => u.required))
        return { fee: 0 };
    const changeOutputFee = (0, coinselectUtils_1.getFeeForBytes)(feeRate, (0, coinselectUtils_1.outputBytes)({
        script: {
            length: coinselectUtils_1.OUTPUT_SCRIPT_LENGTH[options.txType],
        },
    }));
    const costOfChange = changeOutputFee + (0, coinselectUtils_1.getDustAmount)(feeRate, options);
    const outputsBytes = (0, coinselectUtils_1.transactionBytes)([], outputs);
    const outputsFee = (0, coinselectUtils_1.getFeeForBytes)(feeRate, outputsBytes);
    const outputsTotalValue = (0, coinselectUtils_1.sumOrNaN)(outputs);
    if (!outputsTotalValue)
        return { fee: 0 };
    const target = outputsTotalValue.add(new bn_js_1.default(outputsFee));
    const targetRange = target.add(new bn_js_1.default(costOfChange));
    const effectiveUtxos = calculateEffectiveValues(utxos, feeRate)
        .filter(({ effectiveValue }) => effectiveValue.gt(coinselectUtils_1.ZERO) && effectiveValue.lte(targetRange))
        .sort((a, b) => {
        const subtract = b.effectiveValue.sub(a.effectiveValue).toNumber();
        if (subtract !== 0) {
            return subtract;
        }
        return a.utxo.i - b.utxo.i;
    });
    const utxosTotalEffectiveValue = effectiveUtxos.reduce((total, { effectiveValue }) => total.add(effectiveValue), coinselectUtils_1.ZERO);
    if (utxosTotalEffectiveValue.lt(target)) {
        return { fee: 0 };
    }
    const selected = search(effectiveUtxos, target, targetRange);
    if (selected !== null) {
        const inputs = [];
        for (let i = 0; i < effectiveUtxos.length; i++) {
            if (selected[i]) {
                inputs.push(effectiveUtxos[i].utxo);
            }
        }
        return (0, coinselectUtils_1.finalize)(inputs, outputs, feeRate, options);
    }
    return { fee: 0 };
};
exports.branchAndBound = branchAndBound;
//# sourceMappingURL=branchAndBound.js.map