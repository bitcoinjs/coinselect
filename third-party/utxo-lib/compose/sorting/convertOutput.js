"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertOutput = void 0;
const convertOutput = (selectedOutput, composeOutput) => {
    if (composeOutput.type === 'change') {
        return Object.assign(Object.assign({}, composeOutput), { amount: selectedOutput.value.toString() });
    }
    if (composeOutput.type === 'opreturn') {
        return composeOutput;
    }
    return Object.assign(Object.assign({}, composeOutput), { type: 'payment', amount: selectedOutput.value.toString() });
};
exports.convertOutput = convertOutput;
//# sourceMappingURL=convertOutput.js.map