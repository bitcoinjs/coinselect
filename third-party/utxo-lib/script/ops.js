"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVERSE_OPS = exports.OPS = void 0;
const tslib_1 = require("tslib");
const ops = tslib_1.__importStar(require("bitcoin-ops"));
const OPS = Object.assign(Object.assign({}, ops), { OP_SSTX: 0xba, OP_SSTXCHANGE: 0xbd, OP_SSGEN: 0xbb, OP_SSRTX: 0xbc });
exports.OPS = OPS;
const REVERSE_OPS = [];
exports.REVERSE_OPS = REVERSE_OPS;
Object.keys(OPS).forEach(code => {
    REVERSE_OPS[OPS[code]] = code;
});
//# sourceMappingURL=ops.js.map