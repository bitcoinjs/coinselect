"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeforce = exports.anyOf = exports.Nil = exports.BufferN = exports.Function = exports.UInt32 = exports.UInt16 = exports.UInt8 = exports.tuple = exports.maybe = exports.Hex = exports.Buffer = exports.String = exports.Boolean = exports.Array = exports.Number = exports.Hash256bit = exports.Hash160bit = exports.Buffer256bit = void 0;
exports.Satoshi = Satoshi;
const tslib_1 = require("tslib");
const typeforce_1 = tslib_1.__importDefault(require("typeforce"));
exports.typeforce = typeforce_1.default;
const SATOSHI_MAX = 21 * 1e14;
function Satoshi(value) {
    return typeforce_1.default.UInt53(value) && value <= SATOSHI_MAX;
}
exports.Buffer256bit = typeforce_1.default.BufferN(32);
exports.Hash160bit = typeforce_1.default.BufferN(20);
exports.Hash256bit = typeforce_1.default.BufferN(32);
exports.Number = typeforce_1.default.Number, exports.Array = typeforce_1.default.Array, exports.Boolean = typeforce_1.default.Boolean, exports.String = typeforce_1.default.String, exports.Buffer = typeforce_1.default.Buffer, exports.Hex = typeforce_1.default.Hex, exports.maybe = typeforce_1.default.maybe, exports.tuple = typeforce_1.default.tuple, exports.UInt8 = typeforce_1.default.UInt8, exports.UInt16 = typeforce_1.default.UInt16, exports.UInt32 = typeforce_1.default.UInt32, exports.Function = typeforce_1.default.Function, exports.BufferN = typeforce_1.default.BufferN, exports.Nil = typeforce_1.default.Nil, exports.anyOf = typeforce_1.default.anyOf;
//# sourceMappingURL=typeforce.js.map