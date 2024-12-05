"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromConstructor = fromConstructor;
exports.fromBuffer = fromBuffer;
const bufferutils_1 = require("../bufferutils");
const base_1 = require("./base");
function toBuffer(tx, buffer, initialOffset) {
    if (!buffer)
        buffer = Buffer.allocUnsafe(tx.byteLength(false));
    const bufferWriter = new bufferutils_1.BufferWriter(buffer, initialOffset || 0);
    bufferWriter.writeInt32(tx.version);
    bufferWriter.writeUInt32(tx.timestamp);
    bufferWriter.writeVarInt(tx.ins.length);
    tx.ins.forEach(txIn => {
        bufferWriter.writeSlice(txIn.hash);
        bufferWriter.writeUInt32(txIn.index);
        bufferWriter.writeVarSlice(txIn.script);
        bufferWriter.writeUInt32(txIn.sequence);
    });
    bufferWriter.writeVarInt(tx.outs.length);
    tx.outs.forEach(txOut => {
        bufferWriter.writeUInt64(txOut.value);
        bufferWriter.writeVarSlice(txOut.script);
    });
    bufferWriter.writeUInt32(tx.locktime);
    if (initialOffset !== undefined)
        return buffer.subarray(initialOffset, bufferWriter.offset);
    return buffer;
}
function fromConstructor(options) {
    const tx = new base_1.TransactionBase(options);
    tx.toBuffer = toBuffer.bind(null, tx);
    return tx;
}
function fromBuffer(buffer, options) {
    const bufferReader = new bufferutils_1.BufferReader(buffer);
    const tx = fromConstructor(options);
    tx.version = bufferReader.readInt32();
    tx.timestamp = bufferReader.readUInt32();
    const vinLen = bufferReader.readVarInt();
    for (let i = 0; i < vinLen; ++i) {
        tx.ins.push({
            hash: bufferReader.readSlice(32),
            index: bufferReader.readUInt32(),
            script: bufferReader.readVarSlice(),
            sequence: bufferReader.readUInt32(),
            witness: [],
        });
    }
    const voutLen = bufferReader.readVarInt();
    for (let i = 0; i < voutLen; ++i) {
        tx.outs.push({
            value: bufferReader.readUInt64String(),
            script: bufferReader.readVarSlice(),
        });
    }
    tx.locktime = bufferReader.readUInt32();
    if (options.nostrict)
        return tx;
    if (bufferReader.offset !== buffer.length)
        throw new Error('Transaction has unexpected data');
    return tx;
}
//# sourceMappingURL=peercoin.js.map