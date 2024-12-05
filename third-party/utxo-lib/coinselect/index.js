"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinselect = coinselect;
const tslib_1 = require("tslib");
const accumulative_1 = require("./inputs/accumulative");
const branchAndBound_1 = require("./inputs/branchAndBound");
const split_1 = require("./outputs/split");
const coinselectUtils_1 = require("./coinselectUtils");
const tryconfirmed_1 = require("./tryconfirmed");
function coinselect(_a) {
    var { inputs, outputs, feeRate } = _a, options = tslib_1.__rest(_a, ["inputs", "outputs", "feeRate"]);
    if (options.sendMaxOutputIndex >= 0) {
        return (0, split_1.split)(inputs, outputs, feeRate, options);
    }
    const sortedInputs = options.sortingStrategy === 'none' ? inputs : inputs.sort((0, coinselectUtils_1.sortByScore)(feeRate));
    const algorithm = (0, tryconfirmed_1.tryConfirmed)((0, coinselectUtils_1.anyOf)([branchAndBound_1.branchAndBound, accumulative_1.accumulative]), options);
    return algorithm(sortedInputs, outputs, feeRate, options);
}
//# sourceMappingURL=index.js.map