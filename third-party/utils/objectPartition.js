"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectPartition = void 0;
const tslib_1 = require("tslib");
const objectPartition = (obj, keys) => keys.reduce(([included, excluded], key) => {
    const _a = excluded, _b = key, value = _a[_b], rest = tslib_1.__rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return typeof value !== 'undefined'
        ? [Object.assign(Object.assign({}, included), { [key]: value }), rest]
        : [included, excluded];
}, [{}, obj]);
exports.objectPartition = objectPartition;
//# sourceMappingURL=objectPartition.js.map