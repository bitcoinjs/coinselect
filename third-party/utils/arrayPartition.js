"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayPartition = void 0;
const arrayPartition = (array, condition) => array.reduce(([pass, fail], elem) => condition(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]], [[], []]);
exports.arrayPartition = arrayPartition;
//# sourceMappingURL=arrayPartition.js.map