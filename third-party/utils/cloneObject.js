"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneObject = void 0;
const cloneObject = (obj, seen = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (seen.has(obj)) {
        return seen.get(obj);
    }
    if (obj instanceof ArrayBuffer) {
        return obj.slice(0);
    }
    if (ArrayBuffer.isView(obj)) {
        const TypedArrayConstructor = obj.constructor;
        return new TypedArrayConstructor(obj);
    }
    const clone = Array.isArray(obj) ? [] : {};
    seen.set(obj, clone);
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === 'function' || typeof value === 'symbol') {
                continue;
            }
            clone[key] = (0, exports.cloneObject)(value, seen);
        }
    }
    return clone;
};
exports.cloneObject = cloneObject;
//# sourceMappingURL=cloneObject.js.map