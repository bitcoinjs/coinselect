"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPS = exports.signature = exports.number = void 0;
exports.isPushOnly = isPushOnly;
exports.compile = compile;
exports.decompile = decompile;
exports.toASM = toASM;
exports.fromASM = fromASM;
exports.toStack = toStack;
exports.isCanonicalPubKey = isCanonicalPubKey;
exports.isDefinedHashType = isDefinedHashType;
exports.isCanonicalScriptSignature = isCanonicalScriptSignature;
const tslib_1 = require("tslib");
const bip66 = tslib_1.__importStar(require("bip66"));
const pushdata_bitcoin_1 = tslib_1.__importDefault(require("pushdata-bitcoin"));
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const scriptNumber = tslib_1.__importStar(require("./scriptNumber"));
const scriptSignature = tslib_1.__importStar(require("./scriptSignature"));
const ops_1 = require("./ops");
const types = tslib_1.__importStar(require("../types"));
const types_1 = require("../types");
const OP_INT_BASE = ops_1.OPS.OP_RESERVED;
function isOPInt(value) {
    return (types.Number(value) &&
        (value === ops_1.OPS.OP_0 ||
            (value >= ops_1.OPS.OP_1 && value <= ops_1.OPS.OP_16) ||
            value === ops_1.OPS.OP_1NEGATE));
}
function isPushOnlyChunk(value) {
    return types.Buffer(value) || isOPInt(value);
}
function isPushOnly(value) {
    return types.Array(value) && value.every(isPushOnlyChunk);
}
function asMinimalOP(buffer) {
    if (buffer.length === 0)
        return ops_1.OPS.OP_0;
    if (buffer.length !== 1)
        return;
    if (buffer[0] >= 1 && buffer[0] <= 16)
        return OP_INT_BASE + buffer[0];
    if (buffer[0] === 0x81)
        return ops_1.OPS.OP_1NEGATE;
}
function compile(chunks) {
    if (types.Buffer(chunks))
        return chunks;
    (0, types_1.typeforce)(types.Array, chunks);
    const bufferSize = chunks.reduce((accum, chunk) => {
        if (types.Buffer(chunk)) {
            if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
                return accum + 1;
            }
            return accum + pushdata_bitcoin_1.default.encodingLength(chunk.length) + chunk.length;
        }
        return accum + 1;
    }, 0.0);
    const buffer = Buffer.allocUnsafe(bufferSize);
    let offset = 0;
    chunks.forEach(chunk => {
        if (types.Buffer(chunk)) {
            const opcode = asMinimalOP(chunk);
            if (opcode !== undefined) {
                buffer.writeUInt8(opcode, offset);
                offset += 1;
                return;
            }
            offset += pushdata_bitcoin_1.default.encode(buffer, chunk.length, offset);
            chunk.copy(buffer, offset);
            offset += chunk.length;
        }
        else {
            buffer.writeUInt8(chunk, offset);
            offset += 1;
        }
    });
    if (offset !== buffer.length)
        throw new Error('Could not decode chunks');
    return buffer;
}
function decompile(buffer) {
    if (types.Array(buffer))
        return buffer;
    (0, types_1.typeforce)(types.Buffer, buffer);
    const chunks = [];
    let i = 0;
    while (i < buffer.length) {
        const opcode = buffer[i];
        if (opcode > ops_1.OPS.OP_0 && opcode <= ops_1.OPS.OP_PUSHDATA4) {
            const d = pushdata_bitcoin_1.default.decode(buffer, i);
            if (d === null)
                return [];
            i += d.size;
            if (i + d.number > buffer.length)
                return [];
            const data = buffer.subarray(i, i + d.number);
            i += d.number;
            const op = asMinimalOP(data);
            if (op !== undefined) {
                chunks.push(op);
            }
            else {
                chunks.push(data);
            }
        }
        else {
            chunks.push(opcode);
            i += 1;
        }
    }
    return chunks;
}
function toASM(chunks) {
    if (types.Buffer(chunks)) {
        chunks = decompile(chunks);
    }
    return chunks
        .map(chunk => {
        if (types.Buffer(chunk)) {
            const op = asMinimalOP(chunk);
            if (op === undefined)
                return chunk.toString('hex');
            chunk = op;
        }
        return ops_1.REVERSE_OPS[chunk];
    })
        .join(' ');
}
function fromASM(asm) {
    (0, types_1.typeforce)(types.String, asm);
    return compile(asm.split(' ').map(chunkStr => {
        if (ops_1.OPS[chunkStr] !== undefined)
            return ops_1.OPS[chunkStr];
        (0, types_1.typeforce)(types.Hex, chunkStr);
        return Buffer.from(chunkStr, 'hex');
    }));
}
function toStack(chunks0) {
    const chunks = decompile(chunks0);
    (0, types_1.typeforce)(isPushOnly, chunks);
    return chunks === null || chunks === void 0 ? void 0 : chunks.map(op => {
        if (types.Buffer(op))
            return op;
        if (op === ops_1.OPS.OP_0)
            return Buffer.allocUnsafe(0);
        return scriptNumber.encode(op - OP_INT_BASE);
    });
}
function isCanonicalPubKey(buffer) {
    return tiny_secp256k1_1.default.isPoint(buffer);
}
function isDefinedHashType(hashType) {
    const hashTypeMod = hashType & ~0x80;
    return hashTypeMod > 0x00 && hashTypeMod < 0x04;
}
function isCanonicalScriptSignature(buffer) {
    if (!types.Buffer(buffer))
        return false;
    if (!isDefinedHashType(buffer[buffer.length - 1]))
        return false;
    return bip66.check(buffer.subarray(0, -1));
}
exports.number = scriptNumber;
exports.signature = scriptSignature;
var ops_2 = require("./ops");
Object.defineProperty(exports, "OPS", { enumerable: true, get: function () { return ops_2.OPS; } });
//# sourceMappingURL=index.js.map