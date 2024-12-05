"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bip69SortingStrategy = void 0;
const convertOutput_1 = require("./convertOutput");
function inputComparator(a, b) {
    return Buffer.from(a.txid, 'hex').compare(Buffer.from(b.txid, 'hex')) || a.vout - b.vout;
}
function outputComparator(a, b) {
    return (a.value.cmp(b.value) ||
        (Buffer.isBuffer(a.script) && Buffer.isBuffer(b.script)
            ? a.script.compare(b.script)
            : a.script.length - b.script.length));
}
const bip69SortingStrategy = ({ result, request, convertedInputs }) => {
    const defaultPermutation = [];
    const convertedOutputs = result.outputs.map((output, index) => {
        defaultPermutation.push(index);
        if (request.outputs[index]) {
            return (0, convertOutput_1.convertOutput)(output, request.outputs[index]);
        }
        return (0, convertOutput_1.convertOutput)(output, Object.assign({ type: 'change' }, request.changeAddress));
    });
    const permutation = defaultPermutation.sort((a, b) => outputComparator(result.outputs[a], result.outputs[b]));
    const sortedOutputs = permutation.map(index => convertedOutputs[index]);
    return {
        inputs: convertedInputs.sort(inputComparator),
        outputs: sortedOutputs,
        outputsPermutation: permutation,
    };
};
exports.bip69SortingStrategy = bip69SortingStrategy;
//# sourceMappingURL=bip69SortingStrategy.js.map