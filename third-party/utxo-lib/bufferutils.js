"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferReader = exports.BufferWriter = exports.getChunkSize = exports.reverseBuffer = exports.writePushDataInt = exports.varIntSize = exports.readPushDataInt = exports.pushDataSize = void 0;
exports.verifuint = verifuint;
exports.readUInt64LE = readUInt64LE;
exports.readUInt64LEasString = readUInt64LEasString;
exports.readInt64LE = readInt64LE;
exports.writeUInt64LE = writeUInt64LE;
exports.writeUInt64LEasString = writeUInt64LEasString;
exports.writeInt64LE = writeInt64LE;
exports.readVarInt = readVarInt;
exports.writeVarInt = writeVarInt;
exports.cloneBuffer = cloneBuffer;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const pushdata_bitcoin_1 = tslib_1.__importDefault(require("pushdata-bitcoin"));
const varuint = tslib_1.__importStar(require("varuint-bitcoin"));
const int64_buffer_1 = require("int64-buffer");
const utils_1 = require("../utils");
const types = tslib_1.__importStar(require("./types"));
const OUT_OF_RANGE_ERROR = 'value out of range';
function verifuint(value, max) {
    if (typeof value !== 'number')
        throw new Error('cannot write a non-number as a number');
    if (value < 0)
        throw new Error('specified a negative value for writing an unsigned value');
    if (value > max)
        throw new Error(OUT_OF_RANGE_ERROR);
    if (Math.floor(value) !== value)
        throw new Error('value has a fractional component');
}
function readUInt64LE(buffer, offset) {
    const a = buffer.readUInt32LE(offset);
    let b = buffer.readUInt32LE(offset + 4);
    b *= 0x100000000;
    verifuint(b + a, 0x001fffffffffffff);
    return b + a;
}
function readUInt64LEasString(buffer, offset) {
    try {
        const result = readUInt64LE(buffer, offset);
        return result.toString();
    }
    catch (_a) {
        const aUint = buffer.readUInt32LE(offset);
        const bUint = buffer.readUInt32LE(offset + 4);
        const m = new bn_js_1.default(0x100000000);
        const a = new bn_js_1.default(aUint);
        const b = new bn_js_1.default(bUint).mul(m);
        return a.add(b).toString();
    }
}
function readInt64LE(buffer, offset) {
    const a = buffer.readUInt32LE(offset);
    let b = buffer.readInt32LE(offset + 4);
    b *= 0x100000000;
    return b + a;
}
function writeUInt64LE(buffer, value, offset) {
    verifuint(value, 0x001fffffffffffff);
    buffer.writeInt32LE(value & -1, offset);
    buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
    return offset + 8;
}
function writeUInt64LEasString(buffer, value, offset) {
    if (typeof value !== 'string') {
        return writeUInt64LE(buffer, value, offset);
    }
    const v = new int64_buffer_1.Int64LE(value);
    v.toBuffer().copy(buffer, offset);
    return offset + 8;
}
function writeInt64LE(buffer, value, offset) {
    const v = new int64_buffer_1.Int64LE(value);
    const a = v.toArray();
    for (let i = 0; i < 8; i++) {
        buffer.writeUInt8(a[i], offset + i);
    }
    return offset + 8;
}
function readVarInt(buffer, offset) {
    const { numberValue, bytes } = varuint.decode(buffer, offset);
    if (numberValue === null)
        throw new Error(OUT_OF_RANGE_ERROR);
    return {
        number: numberValue,
        size: bytes,
    };
}
function writeVarInt(buffer, number, offset) {
    const { bytes } = varuint.encode(number, buffer, offset);
    return bytes;
}
function cloneBuffer(buffer) {
    const clone = Buffer.allocUnsafe(buffer.length);
    buffer.copy(clone);
    return clone;
}
exports.pushDataSize = pushdata_bitcoin_1.default.encodingLength;
exports.readPushDataInt = pushdata_bitcoin_1.default.decode;
exports.varIntSize = varuint.encodingLength;
exports.writePushDataInt = pushdata_bitcoin_1.default.encode;
exports.reverseBuffer = utils_1.bufferUtils.reverseBuffer, exports.getChunkSize = utils_1.bufferUtils.getChunkSize;
class BufferWriter {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        types.typeforce(types.tuple(types.Buffer, types.UInt32), [buffer, offset]);
    }
    writeUInt8(i) {
        this.offset = this.buffer.writeUInt8(i, this.offset);
    }
    writeUInt16(i) {
        this.offset = this.buffer.writeUInt16LE(i, this.offset);
    }
    writeInt32(i) {
        this.offset = this.buffer.writeInt32LE(i, this.offset);
    }
    writeUInt32(i) {
        this.offset = this.buffer.writeUInt32LE(i, this.offset);
    }
    writeInt64(i) {
        this.offset = writeInt64LE(this.buffer, i, this.offset);
    }
    writeUInt64(i) {
        this.offset =
            typeof i === 'string'
                ? writeUInt64LEasString(this.buffer, i, this.offset)
                : writeUInt64LE(this.buffer, i, this.offset);
    }
    writeVarInt(i) {
        const { bytes } = varuint.encode(i, this.buffer, this.offset);
        this.offset += bytes;
    }
    writeSlice(slice) {
        if (this.buffer.length < this.offset + slice.length) {
            throw new Error('Cannot write slice out of bounds');
        }
        this.offset += slice.copy(this.buffer, this.offset);
    }
    writeVarSlice(slice) {
        this.writeVarInt(slice.length);
        this.writeSlice(slice);
    }
    writeVector(vector) {
        this.writeVarInt(vector.length);
        vector.forEach((buf) => this.writeVarSlice(buf));
    }
}
exports.BufferWriter = BufferWriter;
class BufferReader {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        types.typeforce(types.tuple(types.Buffer, types.UInt32), [buffer, offset]);
    }
    readUInt8() {
        const result = this.buffer.readUInt8(this.offset);
        this.offset++;
        return result;
    }
    readUInt16() {
        const result = this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return result;
    }
    readInt32() {
        const result = this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    readUInt32() {
        const result = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return result;
    }
    readInt64() {
        const result = readInt64LE(this.buffer, this.offset);
        this.offset += 8;
        return result;
    }
    readUInt64() {
        const result = readUInt64LE(this.buffer, this.offset);
        this.offset += 8;
        return result;
    }
    readUInt64String() {
        const result = readUInt64LEasString(this.buffer, this.offset);
        this.offset += 8;
        return result;
    }
    readVarInt() {
        const { numberValue, bytes } = varuint.decode(this.buffer, this.offset);
        if (numberValue === null)
            throw new Error(OUT_OF_RANGE_ERROR);
        this.offset += bytes;
        return numberValue;
    }
    readSlice(n) {
        if (this.buffer.length < this.offset + n) {
            throw new Error('Cannot read slice out of bounds');
        }
        const result = this.buffer.subarray(this.offset, this.offset + n);
        this.offset += n;
        return result;
    }
    readVarSlice() {
        return this.readSlice(this.readVarInt());
    }
    readVector() {
        const count = this.readVarInt();
        const vector = [];
        for (let i = 0; i < count; i++)
            vector.push(this.readVarSlice());
        return vector;
    }
}
exports.BufferReader = BufferReader;
//# sourceMappingURL=bufferutils.js.map