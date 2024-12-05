"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToDictionary = void 0;
const validateKey = (key) => {
    if (['string', 'number'].includes(typeof key)) {
        return true;
    }
    return false;
};
const arrayToDictionary = (array, getKey, multiple) => multiple
    ? array.reduce((prev, cur) => {
        var _a;
        const key = getKey(cur);
        if (validateKey(key)) {
            return Object.assign(Object.assign({}, prev), { [key]: [...((_a = prev[key]) !== null && _a !== void 0 ? _a : []), cur] });
        }
        return prev;
    }, {})
    : array.reduce((prev, cur) => {
        const key = getKey(cur);
        if (validateKey(key)) {
            return Object.assign(Object.assign({}, prev), { [key]: cur });
        }
        return prev;
    }, {});
exports.arrayToDictionary = arrayToDictionary;
//# sourceMappingURL=arrayToDictionary.js.map