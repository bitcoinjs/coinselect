"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDER = toDER;
exports.fromDER = fromDER;
exports.decode = decode;
exports.encode = encode;
const tslib_1 = require("tslib");
const bip66 = tslib_1.__importStar(require("bip66"));
const types = tslib_1.__importStar(require("../types"));
const ZERO = Buffer.alloc(1, 0);
function toDER(x) {
    let i = 0;
    while (x[i] === 0)
        ++i;
    if (i === x.length)
        return ZERO;
    x = x.subarray(i);
    if (x[0] & 0x80)
        return Buffer.concat([ZERO, x], 1 + x.length);
    return x;
}
function fromDER(x) {
    if (x[0] === 0x00)
        x = x.subarray(1);
    const buffer = Buffer.alloc(32, 0);
    const bstart = Math.max(0, 32 - x.length);
    x.copy(buffer, bstart);
    return buffer;
}
function decode(buffer) {
    const hashType = buffer.readUInt8(buffer.length - 1);
    const hashTypeMod = hashType & ~0x80;
    if (hashTypeMod <= 0 || hashTypeMod >= 4)
        throw new Error(`Invalid hashType ${hashType}`);
    const decoded = bip66.decode(buffer.subarray(0, -1));
    const r = fromDER(decoded.r);
    const s = fromDER(decoded.s);
    const signature = Buffer.concat([r, s], 64);
    return { signature, hashType };
}
function encode(signature, hashType) {
    types.typeforce({
        signature: types.BufferN(64),
        hashType: types.UInt8,
    }, { signature, hashType });
    const hashTypeMod = hashType & ~0x80;
    if (hashTypeMod <= 0 || hashTypeMod >= 4)
        throw new Error(`Invalid hashType ${hashType}`);
    const hashTypeBuffer = Buffer.allocUnsafe(1);
    hashTypeBuffer.writeUInt8(hashType, 0);
    const r = toDER(signature.subarray(0, 32));
    const s = toDER(signature.subarray(32, 64));
    return Buffer.concat([bip66.encode(r, s), hashTypeBuffer]);
}
//# sourceMappingURL=scriptSignature.js.map