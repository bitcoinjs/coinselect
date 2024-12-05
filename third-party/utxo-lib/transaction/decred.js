"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromConstructor = fromConstructor;
exports.fromBuffer = fromBuffer;
const tslib_1 = require("tslib");
const varuint = tslib_1.__importStar(require("varuint-bitcoin"));
const bufferutils_1 = require("../bufferutils");
const bcrypto = tslib_1.__importStar(require("../crypto"));
const base_1 = require("./base");
const DECRED_TX_VERSION = 1;
const DECRED_TX_SERIALIZE_FULL = 0;
const DECRED_TX_SERIALIZE_NO_WITNESS = 1;
const DECRED_SCRIPT_VERSION = 0;
function hasWitnesses(tx) {
    return tx.type === DECRED_TX_SERIALIZE_FULL;
}
function byteLength(tx, _ALLOW_WITNESS = true) {
    let byteLength = 4 + varuint.encodingLength(tx.ins.length);
    let nWitness = 0;
    const hasWitnesses = _ALLOW_WITNESS && tx.hasWitnesses();
    byteLength += tx.ins.reduce((sum, input) => {
        sum += 32 + 4 + 1 + 4;
        if (hasWitnesses) {
            nWitness += 1;
            sum += 8 + 4 + 4;
            sum += (0, base_1.varSliceSize)(input.decredWitness.script);
        }
        return sum;
    }, 0);
    if (hasWitnesses) {
        byteLength += varuint.encodingLength(nWitness);
    }
    byteLength += varuint.encodingLength(tx.outs.length);
    byteLength += tx.outs.reduce((sum, output) => {
        sum += 8 + 2;
        sum += (0, base_1.varSliceSize)(output.script);
        return sum;
    }, 0);
    byteLength += 4 + 4;
    return byteLength;
}
function toBuffer(tx, buffer, initialOffset, _ALLOW_WITNESS = true) {
    if (!buffer)
        buffer = Buffer.allocUnsafe(byteLength(tx, _ALLOW_WITNESS));
    const bufferWriter = new bufferutils_1.BufferWriter(buffer, initialOffset || 0);
    bufferWriter.writeUInt16(tx.version);
    bufferWriter.writeUInt16(_ALLOW_WITNESS ? tx.type : DECRED_TX_SERIALIZE_NO_WITNESS);
    bufferWriter.writeVarInt(tx.ins.length);
    tx.ins.forEach(txIn => {
        bufferWriter.writeSlice(txIn.hash);
        bufferWriter.writeUInt32(txIn.index);
        bufferWriter.writeUInt8(txIn.decredTree);
        bufferWriter.writeUInt32(txIn.sequence);
    });
    bufferWriter.writeVarInt(tx.outs.length);
    tx.outs.forEach(txOut => {
        bufferWriter.writeUInt64(txOut.value);
        bufferWriter.writeUInt16(txOut.decredVersion);
        bufferWriter.writeVarSlice(txOut.script);
    });
    bufferWriter.writeUInt32(tx.locktime);
    bufferWriter.writeUInt32(tx.expiry);
    if (_ALLOW_WITNESS && tx.hasWitnesses()) {
        bufferWriter.writeVarInt(tx.ins.length);
        tx.ins.forEach(input => {
            bufferWriter.writeUInt64(input.decredWitness.value);
            bufferWriter.writeUInt32(input.decredWitness.height);
            bufferWriter.writeUInt32(input.decredWitness.blockIndex);
            bufferWriter.writeVarSlice(input.decredWitness.script);
        });
    }
    if (initialOffset !== undefined)
        return buffer.subarray(initialOffset, bufferWriter.offset);
    return buffer;
}
function getHash(tx, forWitness = false) {
    if (forWitness && tx.isCoinbase())
        return Buffer.alloc(32, 0);
    return bcrypto.blake256(toBuffer(tx, undefined, undefined, forWitness));
}
function weight(tx) {
    return tx.byteLength(true);
}
function fromConstructor(options) {
    const tx = new base_1.TransactionBase(options);
    tx.byteLength = byteLength.bind(null, tx);
    tx.toBuffer = toBuffer.bind(null, tx);
    tx.hasWitnesses = hasWitnesses.bind(null, tx);
    tx.getHash = getHash.bind(null, tx);
    tx.weight = weight.bind(null, tx);
    return tx;
}
function fromBuffer(buffer, options) {
    const bufferReader = new bufferutils_1.BufferReader(buffer);
    const tx = fromConstructor(options);
    tx.version = bufferReader.readInt32();
    tx.type = tx.version >> 16;
    tx.version &= 0xffff;
    if (tx.version !== DECRED_TX_VERSION) {
        throw new Error('Unsupported Decred transaction version');
    }
    if (tx.type !== DECRED_TX_SERIALIZE_FULL && tx.type !== DECRED_TX_SERIALIZE_NO_WITNESS) {
        throw new Error('Unsupported Decred transaction type');
    }
    const vinLen = bufferReader.readVarInt();
    for (let i = 0; i < vinLen; ++i) {
        tx.ins.push({
            hash: bufferReader.readSlice(32),
            index: bufferReader.readUInt32(),
            decredTree: bufferReader.readUInt8(),
            sequence: bufferReader.readUInt32(),
            script: base_1.EMPTY_SCRIPT,
            witness: [],
        });
    }
    const voutLen = bufferReader.readVarInt();
    for (let i = 0; i < voutLen; i++) {
        const value = bufferReader.readUInt64String();
        const version = bufferReader.readUInt16();
        if (version !== DECRED_SCRIPT_VERSION)
            throw new Error('Unsupported Decred script version');
        tx.outs.push({
            value,
            decredVersion: version,
            script: bufferReader.readVarSlice(),
        });
    }
    tx.locktime = bufferReader.readUInt32();
    tx.expiry = bufferReader.readUInt32();
    if (tx.type === DECRED_TX_SERIALIZE_FULL) {
        const count = bufferReader.readVarInt();
        if (count !== vinLen)
            throw new Error('Non equal number of ins and witnesses');
        tx.ins.forEach(vin => {
            vin.decredWitness = {
                value: bufferReader.readUInt64String(),
                height: bufferReader.readUInt32(),
                blockIndex: bufferReader.readUInt32(),
                script: bufferReader.readVarSlice(),
            };
        });
    }
    if (options.nostrict)
        return tx;
    if (bufferReader.offset !== buffer.length)
        throw new Error('Transaction has unexpected data');
    return tx;
}
//# sourceMappingURL=decred.js.map