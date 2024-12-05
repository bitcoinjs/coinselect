"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeepObject = void 0;
const isObject = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
        if (typeof Object.getPrototypeOf === 'function') {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    return false;
};
const mergeValuesWithPath = (target, value, [key, ...rest]) => {
    if (key === undefined) {
        return mergeValues(target, value);
    }
    else if (!isObject(target)) {
        return { [key]: mergeValuesWithPath({}, value, rest) };
    }
    else {
        return Object.assign(Object.assign({}, target), { [key]: mergeValuesWithPath(target[key], value, rest) });
    }
};
const mergeValues = (target, value) => {
    if (Array.isArray(target) && Array.isArray(value)) {
        return exports.mergeDeepObject.options.mergeArrays
            ? Array.from(new Set(target.concat(value)))
            : value;
    }
    else if (isObject(target) && isObject(value)) {
        return (0, exports.mergeDeepObject)(target, value);
    }
    else {
        return value;
    }
};
const mergeDeepObject = (...objects) => objects.reduce((result, current) => {
    if (Array.isArray(current)) {
        throw new TypeError('Arguments provided to ts-deepmerge must be objects, not arrays.');
    }
    Object.keys(current).forEach(key => {
        if (['__proto__', 'constructor', 'prototype'].includes(key)) {
            return;
        }
        if (exports.mergeDeepObject.options.dotNotation) {
            const [first, ...rest] = key.split('.');
            result[first] = mergeValuesWithPath(result[first], current[key], rest);
        }
        else {
            result[key] = mergeValues(result[key], current[key]);
        }
    });
    return result;
}, {});
exports.mergeDeepObject = mergeDeepObject;
const defaultOptions = {
    mergeArrays: true,
    dotNotation: false,
};
exports.mergeDeepObject.options = defaultOptions;
exports.mergeDeepObject.withOptions = (options, ...objects) => {
    exports.mergeDeepObject.options = Object.assign(Object.assign({}, defaultOptions), options);
    const result = (0, exports.mergeDeepObject)(...objects);
    exports.mergeDeepObject.options = defaultOptions;
    return result;
};
//# sourceMappingURL=mergeDeepObject.js.map