"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromConstructor = fromConstructor;
exports.fromBuffer = fromBuffer;
const tslib_1 = require("tslib");
const varuint = tslib_1.__importStar(require("varuint-bitcoin"));
const bufferutils_1 = require("../bufferutils");
const base_1 = require("./base");
const DASH_NORMAL = 0;
const DASH_QUORUM_COMMITMENT = 6;
function byteLength(tx, _ALLOW_WITNESS = true) {
    var _a;
    const hasWitnesses = _ALLOW_WITNESS && tx.hasWitnesses();
    return ((hasWitnesses ? 10 : 8) +
        (tx.timestamp ? 4 : 0) +
        varuint.encodingLength(tx.ins.length) +
        varuint.encodingLength(tx.outs.length) +
        tx.ins.reduce((sum, input) => sum + 40 + (0, base_1.varSliceSize)(input.script), 0) +
        tx.outs.reduce((sum, output) => sum + 8 + (0, base_1.varSliceSize)(output.script), 0) +
        (((_a = tx.specific) === null || _a === void 0 ? void 0 : _a.extraPayload) ? (0, base_1.varSliceSize)(tx.specific.extraPayload) : 0) +
        (hasWitnesses ? tx.ins.reduce((sum, input) => sum + (0, base_1.vectorSize)(input.witness), 0) : 0));
}
function toBuffer(tx, buffer, initialOffset, _ALLOW_WITNESS = true) {
    var _a;
    if (!buffer)
        buffer = Buffer.allocUnsafe(tx.byteLength(_ALLOW_WITNESS));
    const bufferWriter = new bufferutils_1.BufferWriter(buffer, initialOffset || 0);
    if (tx.version >= 3 && tx.type !== DASH_NORMAL) {
        bufferWriter.writeUInt16(tx.version);
        bufferWriter.writeUInt16(tx.type);
    }
    else {
        bufferWriter.writeInt32(tx.version);
    }
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
    if ((_a = tx.specific) === null || _a === void 0 ? void 0 : _a.extraPayload)
        bufferWriter.writeVarSlice(tx.specific.extraPayload);
    if (initialOffset !== undefined)
        return buffer.subarray(initialOffset, bufferWriter.offset);
    return buffer;
}
function getExtraData(tx) {
    var _a;
    if (!((_a = tx.specific) === null || _a === void 0 ? void 0 : _a.extraPayload))
        return;
    const { buffer: extraDataLength } = varuint.encode(tx.specific.extraPayload.length);
    return Buffer.concat([extraDataLength, tx.specific.extraPayload]);
}
function fromConstructor(options) {
    const tx = new base_1.TransactionBase(options);
    tx.specific = tx.specific || { type: 'dash' };
    tx.byteLength = byteLength.bind(null, tx);
    tx.toBuffer = toBuffer.bind(null, tx);
    tx.getExtraData = getExtraData.bind(null, tx);
    return tx;
}
function fromBuffer(buffer, options) {
    const bufferReader = new bufferutils_1.BufferReader(buffer);
    const tx = fromConstructor(options);
    tx.version = bufferReader.readInt32();
    tx.type = tx.version >> 16;
    tx.version &= 0xffff;
    if (tx.version === 3 && (tx.type < DASH_NORMAL || tx.type > DASH_QUORUM_COMMITMENT)) {
        throw new Error('Unsupported Dash transaction type');
    }
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
    if (tx.version >= 3 && tx.type !== DASH_NORMAL) {
        tx.specific.extraPayload = bufferReader.readVarSlice();
    }
    if (options.nostrict)
        return tx;
    if (bufferReader.offset !== buffer.length)
        throw new Error('Transaction has unexpected data');
    return tx;
}
//# sourceMappingURL=dash.js.map