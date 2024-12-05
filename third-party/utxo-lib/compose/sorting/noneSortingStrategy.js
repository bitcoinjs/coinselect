"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noneSortingStrategy = void 0;
const convertOutput_1 = require("./convertOutput");
const noneSortingStrategy = ({ result, request, convertedInputs }) => {
    const convertedOutputs = result.outputs.map((output, index) => {
        if (request.outputs[index]) {
            return (0, convertOutput_1.convertOutput)(output, request.outputs[index]);
        }
        return (0, convertOutput_1.convertOutput)(output, Object.assign({ type: 'change' }, request.changeAddress));
    });
    return {
        inputs: convertedInputs,
        outputs: convertedOutputs,
        outputsPermutation: Array.from(convertedOutputs.keys()),
    };
};
exports.noneSortingStrategy = noneSortingStrategy;
//# sourceMappingURL=noneSortingStrategy.js.map