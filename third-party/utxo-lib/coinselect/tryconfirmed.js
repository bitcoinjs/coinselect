"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryConfirmed = tryConfirmed;
const coinselectUtils_1 = require("./coinselectUtils");
function filterUtxos(utxos, minConfOwn, minConfOther) {
    const usable = [];
    const unusable = [];
    for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i];
        const isUsed = utxo.own
            ? utxo.confirmations >= minConfOwn
            : utxo.confirmations >= minConfOther;
        if (isUsed || utxo.required) {
            usable.push(utxo);
        }
        else {
            unusable.push(utxo);
        }
    }
    return {
        usable,
        unusable,
    };
}
function tryConfirmed(algorithm, options) {
    const own = options.own || 1;
    const other = options.other || 6;
    const coinbase = options.coinbase || 100;
    return (utxosO, outputs, feeRate, optionsIn) => {
        const utxos = (0, coinselectUtils_1.filterCoinbase)(utxosO, coinbase);
        if (utxos.length === 0) {
            return { fee: 0 };
        }
        const trials = [];
        let i;
        for (i = own; i > 0; i--) {
            trials.push({ other, own: i });
        }
        for (i = other - 1; i > 0; i--) {
            trials.push({ other: i, own: 1 });
        }
        trials.push({ other: 1, own: 0 });
        trials.push({ other: 0, own: 0 });
        let unusable = utxos;
        let usable = [];
        for (i = 0; i < trials.length; i++) {
            const trial = trials[i];
            const filterResult = filterUtxos(unusable, trial.own, trial.other);
            if (filterResult.usable.length > 0) {
                usable = usable.concat(filterResult.usable);
                const unusableH = filterResult.unusable;
                unusable = unusableH;
                const result = algorithm(usable, outputs, feeRate, optionsIn);
                if (result.inputs) {
                    return result;
                }
                if (unusable.length === 0) {
                    return result;
                }
            }
        }
        throw new Error('Unexpected unreturned result');
    };
}
//# sourceMappingURL=tryconfirmed.js.map