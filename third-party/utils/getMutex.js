"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutex = void 0;
const tslib_1 = require("tslib");
const getMutex = () => {
    const DEFAULT_ID = Symbol();
    const locks = {};
    return (...args_1) => tslib_1.__awaiter(void 0, [...args_1], void 0, function* (lockId = DEFAULT_ID) {
        while (locks[lockId]) {
            yield locks[lockId];
        }
        let resolve = () => { };
        locks[lockId] = new Promise(res => {
            resolve = res;
        }).finally(() => {
            delete locks[lockId];
        });
        return resolve;
    });
};
exports.getMutex = getMutex;
//# sourceMappingURL=getMutex.js.map