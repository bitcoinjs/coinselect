"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = createTransaction;
const noneSortingStrategy_1 = require("./sorting/noneSortingStrategy");
const bip69SortingStrategy_1 = require("./sorting/bip69SortingStrategy");
const randomSortingStrategy_1 = require("./sorting/randomSortingStrategy");
const strategyMap = {
    bip69: bip69SortingStrategy_1.bip69SortingStrategy,
    none: noneSortingStrategy_1.noneSortingStrategy,
    random: randomSortingStrategy_1.randomSortingStrategy,
};
function createTransaction(request, result) {
    const convertedInputs = result.inputs.map(input => request.utxos[input.i]);
    return strategyMap[request.sortingStrategy]({ result, request, convertedInputs });
}
//# sourceMappingURL=transaction.js.map