"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeakRandomInt = void 0;
const getWeakRandomInt = (min, max) => {
    if (min >= max) {
        throw new RangeError(`The value of "max" is out of range. It must be greater than the value of "min" (${min}). Received ${max}`);
    }
    return Math.floor(Math.random() * (max - min) + min);
};
exports.getWeakRandomInt = getWeakRandomInt;
//# sourceMappingURL=getWeakRandomInt.js.map