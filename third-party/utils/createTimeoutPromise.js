"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeoutPromise = void 0;
const createTimeoutPromise = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
exports.createTimeoutPromise = createTimeoutPromise;
//# sourceMappingURL=createTimeoutPromise.js.map