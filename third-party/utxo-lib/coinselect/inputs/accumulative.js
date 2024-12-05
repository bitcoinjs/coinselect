"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accumulative = void 0;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const coinselectUtils_1 = require("../coinselectUtils");
const accumulative = (utxos0, outputs, feeRate, options) => {
    let inAccum = coinselectUtils_1.ZERO;
    const inputs = [];
    const outAccum = (0, coinselectUtils_1.sumOrNaN)(outputs);
    const requiredUtxos = [];
    const utxos = [];
    utxos0.forEach(u => {
        if (u.required) {
            requiredUtxos.push(u);
            const utxoValue = (0, coinselectUtils_1.bignumberOrNaN)(u.value, true);
            inAccum = inAccum.add(utxoValue);
            inputs.push(u);
        }
        else {
            utxos.push(u);
        }
    });
    if (requiredUtxos.length > 0) {
        const requiredIsEnough = (0, coinselectUtils_1.finalize)(requiredUtxos, outputs, feeRate, options);
        if (requiredIsEnough.inputs) {
            return requiredIsEnough;
        }
    }
    for (let i = 0; i < utxos.length; ++i) {
        const utxo = utxos[i];
        const utxoBytes = (0, coinselectUtils_1.inputBytes)(utxo);
        const utxoFee = (0, coinselectUtils_1.getFeeForBytes)(feeRate, utxoBytes);
        const utxoValue = (0, coinselectUtils_1.bignumberOrNaN)(utxo.value);
        if (!utxoValue || utxoValue.lt(new bn_js_1.default(utxoFee))) {
            if (i === utxos.length - 1) {
                const fee = (0, coinselectUtils_1.getFee)([...inputs, utxo], outputs, feeRate, options);
                return { fee };
            }
        }
        else {
            inAccum = inAccum.add(utxoValue);
            inputs.push(utxo);
            const fee = (0, coinselectUtils_1.getFee)(inputs, outputs, feeRate, options);
            const outAccumWithFee = outAccum ? outAccum.add(new bn_js_1.default(fee)) : coinselectUtils_1.ZERO;
            if (inAccum.gte(outAccumWithFee)) {
                return (0, coinselectUtils_1.finalize)(inputs, outputs, feeRate, options);
            }
        }
    }
    const fee = (0, coinselectUtils_1.getFee)(inputs, outputs, feeRate, options);
    return { fee };
};
exports.accumulative = accumulative;
//# sourceMappingURL=accumulative.js.map