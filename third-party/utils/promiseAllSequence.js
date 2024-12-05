"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseAllSequence = void 0;
const tslib_1 = require("tslib");
const promiseAllSequence = (actions) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    for (let i = 0; i < actions.length; ++i) {
        const result = yield actions[i]();
        results.push(result);
    }
    return results;
});
exports.promiseAllSequence = promiseAllSequence;
//# sourceMappingURL=promiseAllSequence.js.map