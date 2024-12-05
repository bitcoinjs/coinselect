"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topologicalSort = void 0;
const arrayPartition_1 = require("./arrayPartition");
const topologicalSort = (elements, precedes, tie) => {
    const result = [];
    const filterRoots = (verts) => (0, arrayPartition_1.arrayPartition)(verts, succ => !verts.some(pred => precedes(pred, succ)));
    let elem = elements;
    while (elem.length) {
        const [roots, rest] = filterRoots(elem);
        if (!roots.length)
            throw new Error('Cycle detected');
        result.push(...(tie ? roots.sort(tie) : roots));
        elem = rest;
    }
    return result;
};
exports.topologicalSort = topologicalSort;
//# sourceMappingURL=topologicalSort.js.map