"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSynchronize = void 0;
const getMutex_1 = require("./getMutex");
const getSynchronize = (mutex) => {
    const lock = mutex !== null && mutex !== void 0 ? mutex : (0, getMutex_1.getMutex)();
    return (action, lockId) => lock(lockId).then(unlock => Promise.resolve().then(action).finally(unlock));
};
exports.getSynchronize = getSynchronize;
//# sourceMappingURL=getSynchronize.js.map