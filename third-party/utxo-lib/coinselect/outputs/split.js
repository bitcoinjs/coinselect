"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = split;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const coinselectUtils_1 = require("../coinselectUtils");
function split(utxosOrig, outputs, feeRate, options) {
    const coinbase = options.coinbase || 100;
    const utxos = (0, coinselectUtils_1.filterCoinbase)(utxosOrig, coinbase);
    const fee = (0, coinselectUtils_1.getFee)(utxos, outputs, feeRate, options);
    if (outputs.length === 0)
        return { fee };
    const inAccum = (0, coinselectUtils_1.sumOrNaN)(utxos);
    const outAccum = (0, coinselectUtils_1.sumOrNaN)(outputs, true);
    if (!inAccum)
        return { fee };
    const remaining = inAccum.sub(outAccum).sub(new bn_js_1.default(fee));
    if (remaining.lt(coinselectUtils_1.ZERO))
        return { fee };
    const unspecified = outputs.reduce((a, x) => a + (!(0, coinselectUtils_1.bignumberOrNaN)(x.value) ? 1 : 0), 0);
    if (remaining.isZero() || unspecified === 0) {
        return (0, coinselectUtils_1.finalize)(utxos, outputs, feeRate, options);
    }
    const splitValue = remaining.div(new bn_js_1.default(unspecified));
    const dustAmount = (0, coinselectUtils_1.getDustAmount)(feeRate, options);
    if (unspecified && splitValue.lt(new bn_js_1.default(dustAmount)))
        return { fee };
    const outputsSplit = outputs.map(output => {
        if (output.value)
            return output;
        return Object.assign(Object.assign({}, output), { value: splitValue });
    });
    return (0, coinselectUtils_1.finalize)(utxos, outputsSplit, feeRate, options);
}
//# sourceMappingURL=split.js.map