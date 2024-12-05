"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSortingStrategy = void 0;
const utils_1 = require("../../../utils");
const convertOutput_1 = require("./convertOutput");
const randomSortingStrategy = ({ result, request, convertedInputs }) => {
    const nonChangeOutputPermutation = [];
    const changeOutputPermutation = [];
    const convertedOutputs = result.outputs.map((output, index) => {
        if (request.outputs[index]) {
            nonChangeOutputPermutation.push(index);
            return (0, convertOutput_1.convertOutput)(output, request.outputs[index]);
        }
        changeOutputPermutation.push(index);
        return (0, convertOutput_1.convertOutput)(output, Object.assign({ type: 'change' }, request.changeAddress));
    });
    const permutation = [...nonChangeOutputPermutation];
    const newPositionOfChange = (0, utils_1.getRandomInt)(0, permutation.length + 1);
    permutation.splice(newPositionOfChange, 0, ...changeOutputPermutation);
    const sortedOutputs = permutation.map(index => convertedOutputs[index]);
    return {
        inputs: (0, utils_1.arrayShuffle)(convertedInputs, { randomInt: utils_1.getRandomInt }),
        outputs: sortedOutputs,
        outputsPermutation: permutation,
    };
};
exports.randomSortingStrategy = randomSortingStrategy;
//# sourceMappingURL=randomSortingStrategy.js.map