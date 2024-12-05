"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromConstructor = fromConstructor;
exports.fromBuffer = fromBuffer;
const tslib_1 = require("tslib");
const varuint = tslib_1.__importStar(require("varuint-bitcoin"));
const blakejs_1 = require("blakejs");
const bufferutils_1 = require("../bufferutils");
const base_1 = require("./base");
const crypto_1 = require("../crypto");
const ZCASH_JOINSPLITS_SUPPORT_VERSION = 2;
const ZCASH_OVERWINTER_VERSION = 3;
const ZCASH_SAPLING_VERSION = 4;
const ZCASH_NU5_VERSION = 5;
const ZCASH_NUM_JOINSPLITS_INPUTS = 2;
const ZCASH_NUM_JOINSPLITS_OUTPUTS = 2;
const ZCASH_NOTECIPHERTEXT_SIZE = 1 + 8 + 32 + 32 + 512 + 16;
const ZCASH_G1_PREFIX_MASK = 0x02;
const ZCASH_G2_PREFIX_MASK = 0x0a;
function byteLength(tx) {
    const overwinterSize = tx.version >= ZCASH_OVERWINTER_VERSION
        ? 4 +
            4
        : 0;
    const txSpecific = tx.specific;
    const getJoinSplitsSize = () => {
        if (tx.version < ZCASH_JOINSPLITS_SUPPORT_VERSION || tx.version >= ZCASH_NU5_VERSION)
            return 0;
        const joinSplitsLen = txSpecific.joinsplits.length;
        if (joinSplitsLen < 1)
            return (0, bufferutils_1.varIntSize)(joinSplitsLen);
        return ((0, bufferutils_1.varIntSize)(joinSplitsLen) +
            (tx.version >= ZCASH_SAPLING_VERSION ? 1698 * joinSplitsLen : 1802 * joinSplitsLen) +
            32 +
            64);
    };
    const saplingSize = tx.version === ZCASH_SAPLING_VERSION
        ? 8 +
            varuint.encodingLength(txSpecific.vShieldedSpend.length) +
            384 * txSpecific.vShieldedSpend.length +
            varuint.encodingLength(txSpecific.vShieldedOutput.length) +
            948 * txSpecific.vShieldedOutput.length +
            (txSpecific.vShieldedSpend.length + txSpecific.vShieldedOutput.length > 0 ? 64 : 0)
        : 0;
    const NU5size = tx.version >= ZCASH_NU5_VERSION
        ? 4 +
            1 +
            1 +
            1
        : 0;
    return (4 +
        varuint.encodingLength(tx.ins.length) +
        varuint.encodingLength(tx.outs.length) +
        tx.ins.reduce((sum, input) => sum + 40 + (0, base_1.varSliceSize)(input.script), 0) +
        tx.outs.reduce((sum, output) => sum + 8 + (0, base_1.varSliceSize)(output.script), 0) +
        4 +
        overwinterSize +
        getJoinSplitsSize() +
        saplingSize +
        NU5size);
}
function toBuffer(tx, buffer, initialOffset) {
    if (!buffer)
        buffer = Buffer.allocUnsafe(byteLength(tx));
    const bufferWriter = new bufferutils_1.BufferWriter(buffer, initialOffset || 0);
    const txSpecific = tx.specific;
    if (tx.version >= ZCASH_OVERWINTER_VERSION) {
        const mask = txSpecific.overwintered ? 1 : 0;
        bufferWriter.writeInt32(tx.version | (mask << 31));
        bufferWriter.writeUInt32(txSpecific.versionGroupId);
    }
    else {
        bufferWriter.writeInt32(tx.version);
    }
    if (tx.version >= ZCASH_NU5_VERSION) {
        bufferWriter.writeUInt32(txSpecific.consensusBranchId);
        bufferWriter.writeUInt32(tx.locktime);
        bufferWriter.writeUInt32(tx.expiry);
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
    if (tx.version < ZCASH_NU5_VERSION) {
        bufferWriter.writeUInt32(tx.locktime);
        if (tx.version >= ZCASH_OVERWINTER_VERSION) {
            bufferWriter.writeUInt32(tx.expiry);
        }
    }
    if (tx.version === ZCASH_SAPLING_VERSION) {
        bufferWriter.writeInt64(txSpecific.valueBalance);
        bufferWriter.writeVarInt(txSpecific.vShieldedSpend.length);
        txSpecific.vShieldedSpend.forEach(shieldedSpend => {
            bufferWriter.writeSlice(shieldedSpend.cv);
            bufferWriter.writeSlice(shieldedSpend.anchor);
            bufferWriter.writeSlice(shieldedSpend.nullifier);
            bufferWriter.writeSlice(shieldedSpend.rk);
            bufferWriter.writeSlice(shieldedSpend.zkproof.sA);
            bufferWriter.writeSlice(shieldedSpend.zkproof.sB);
            bufferWriter.writeSlice(shieldedSpend.zkproof.sC);
            bufferWriter.writeSlice(shieldedSpend.spendAuthSig);
        });
        bufferWriter.writeVarInt(txSpecific.vShieldedOutput.length);
        txSpecific.vShieldedOutput.forEach(shieldedOutput => {
            bufferWriter.writeSlice(shieldedOutput.cv);
            bufferWriter.writeSlice(shieldedOutput.cmu);
            bufferWriter.writeSlice(shieldedOutput.ephemeralKey);
            bufferWriter.writeSlice(shieldedOutput.encCiphertext);
            bufferWriter.writeSlice(shieldedOutput.outCiphertext);
            bufferWriter.writeSlice(shieldedOutput.zkproof.sA);
            bufferWriter.writeSlice(shieldedOutput.zkproof.sB);
            bufferWriter.writeSlice(shieldedOutput.zkproof.sC);
        });
    }
    function writeCompressedG1(i) {
        bufferWriter.writeUInt8(ZCASH_G1_PREFIX_MASK | i.yLsb);
        bufferWriter.writeSlice(i.x);
    }
    function writeCompressedG2(i) {
        bufferWriter.writeUInt8(ZCASH_G2_PREFIX_MASK | i.yLsb);
        bufferWriter.writeSlice(i.x);
    }
    if (tx.version >= ZCASH_JOINSPLITS_SUPPORT_VERSION && tx.version < ZCASH_NU5_VERSION) {
        bufferWriter.writeVarInt(txSpecific.joinsplits.length);
        txSpecific.joinsplits.forEach(joinsplit => {
            bufferWriter.writeUInt64(joinsplit.vpubOld);
            bufferWriter.writeUInt64(joinsplit.vpubNew);
            bufferWriter.writeSlice(joinsplit.anchor);
            joinsplit.nullifiers.forEach(nullifier => {
                bufferWriter.writeSlice(nullifier);
            });
            joinsplit.commitments.forEach(nullifier => {
                bufferWriter.writeSlice(nullifier);
            });
            bufferWriter.writeSlice(joinsplit.ephemeralKey);
            bufferWriter.writeSlice(joinsplit.randomSeed);
            joinsplit.macs.forEach(nullifier => {
                bufferWriter.writeSlice(nullifier);
            });
            if (joinsplit.zkproof.type === 'sapling') {
                bufferWriter.writeSlice(joinsplit.zkproof.sA);
                bufferWriter.writeSlice(joinsplit.zkproof.sB);
                bufferWriter.writeSlice(joinsplit.zkproof.sC);
            }
            else {
                writeCompressedG1(joinsplit.zkproof.gA);
                writeCompressedG1(joinsplit.zkproof.gAPrime);
                writeCompressedG2(joinsplit.zkproof.gB);
                writeCompressedG1(joinsplit.zkproof.gBPrime);
                writeCompressedG1(joinsplit.zkproof.gC);
                writeCompressedG1(joinsplit.zkproof.gCPrime);
                writeCompressedG1(joinsplit.zkproof.gK);
                writeCompressedG1(joinsplit.zkproof.gH);
            }
            joinsplit.ciphertexts.forEach(ciphertext => {
                bufferWriter.writeSlice(ciphertext);
            });
        });
        if (txSpecific.joinsplits.length > 0) {
            bufferWriter.writeSlice(txSpecific.joinsplitPubkey);
            bufferWriter.writeSlice(txSpecific.joinsplitSig);
        }
    }
    if (tx.version >= ZCASH_SAPLING_VERSION &&
        txSpecific.vShieldedSpend.length + txSpecific.vShieldedOutput.length > 0) {
        bufferWriter.writeSlice(txSpecific.bindingSig);
    }
    if (tx.version === ZCASH_NU5_VERSION) {
        bufferWriter.writeVarInt(0);
        bufferWriter.writeVarInt(0);
        bufferWriter.writeUInt8(0x00);
    }
    if (initialOffset !== undefined)
        return buffer.subarray(initialOffset, bufferWriter.offset);
    return buffer;
}
function getExtraData(tx) {
    if (tx.version < ZCASH_JOINSPLITS_SUPPORT_VERSION || tx.version >= ZCASH_NU5_VERSION)
        return;
    const offset = 4 +
        (tx.version >= ZCASH_OVERWINTER_VERSION ? 8 : 0) +
        varuint.encodingLength(tx.ins.length) +
        varuint.encodingLength(tx.outs.length) +
        tx.ins.reduce((sum, input) => sum + 40 + (0, base_1.varSliceSize)(input.script), 0) +
        tx.outs.reduce((sum, output) => sum + 8 + (0, base_1.varSliceSize)(output.script), 0) +
        4;
    return tx.toBuffer().subarray(offset);
}
function getBlake2bDigestHash(buffer, personalization) {
    const hash = (0, blakejs_1.blake2b)(buffer, undefined, 32, undefined, Buffer.from(personalization));
    return Buffer.from(hash);
}
function getHeaderDigest(tx) {
    const mask = tx.specific.overwintered ? 1 : 0;
    const writer = new bufferutils_1.BufferWriter(Buffer.alloc(4 * 5));
    writer.writeInt32(tx.version | (mask << 31));
    writer.writeUInt32(tx.specific.versionGroupId);
    writer.writeUInt32(tx.specific.consensusBranchId);
    writer.writeUInt32(tx.locktime);
    writer.writeUInt32(tx.expiry);
    return getBlake2bDigestHash(writer.buffer, 'ZTxIdHeadersHash');
}
function getPrevoutsDigest(ins) {
    const bufferWriter = new bufferutils_1.BufferWriter(Buffer.allocUnsafe(36 * ins.length));
    ins.forEach(txIn => {
        bufferWriter.writeSlice(txIn.hash);
        bufferWriter.writeUInt32(txIn.index);
    });
    return getBlake2bDigestHash(bufferWriter.buffer, 'ZTxIdPrevoutHash');
}
function getSequenceDigest(ins) {
    const bufferWriter = new bufferutils_1.BufferWriter(Buffer.allocUnsafe(4 * ins.length));
    ins.forEach(txIn => {
        bufferWriter.writeUInt32(txIn.sequence);
    });
    return getBlake2bDigestHash(bufferWriter.buffer, 'ZTxIdSequencHash');
}
function getOutputsDigest(outs) {
    const txOutsSize = outs.reduce((sum, output) => sum + 8 + (0, base_1.varSliceSize)(output.script), 0);
    const bufferWriter = new bufferutils_1.BufferWriter(Buffer.allocUnsafe(txOutsSize));
    outs.forEach(out => {
        bufferWriter.writeUInt64(out.value);
        bufferWriter.writeVarSlice(out.script);
    });
    return getBlake2bDigestHash(bufferWriter.buffer, 'ZTxIdOutputsHash');
}
function getTransparentDigest(tx) {
    let buffer;
    if (tx.ins.length || tx.outs.length) {
        const writer = new bufferutils_1.BufferWriter(Buffer.alloc(32 * 3));
        writer.writeSlice(getPrevoutsDigest(tx.ins));
        writer.writeSlice(getSequenceDigest(tx.ins));
        writer.writeSlice(getOutputsDigest(tx.outs));
        buffer = writer.buffer;
    }
    else {
        buffer = Buffer.of();
    }
    return getBlake2bDigestHash(buffer, 'ZTxIdTranspaHash');
}
function getHash(tx, _forWitness = false) {
    if (tx.version < ZCASH_NU5_VERSION) {
        return (0, crypto_1.hash256)(toBuffer(tx));
    }
    const writer = new bufferutils_1.BufferWriter(Buffer.alloc(32 * 4));
    writer.writeSlice(getHeaderDigest(tx));
    writer.writeSlice(getTransparentDigest(tx));
    writer.writeSlice(getBlake2bDigestHash(Buffer.of(), 'ZTxIdSaplingHash'));
    writer.writeSlice(getBlake2bDigestHash(Buffer.of(), 'ZTxIdOrchardHash'));
    const personalizationTag = 'ZcashTxHash_';
    const personalization = new bufferutils_1.BufferWriter(Buffer.alloc(personalizationTag.length + 4));
    personalization.writeSlice(Buffer.from(personalizationTag));
    personalization.writeUInt32(tx.specific.consensusBranchId);
    return getBlake2bDigestHash(writer.buffer, personalization.buffer);
}
function fromConstructor(options) {
    const tx = new base_1.TransactionBase(options);
    tx.specific = tx.specific || {
        type: 'zcash',
        joinsplits: [],
        joinsplitPubkey: base_1.EMPTY_SCRIPT,
        joinsplitSig: base_1.EMPTY_SCRIPT,
        overwintered: 0,
        versionGroupId: 0,
        valueBalance: 0,
        vShieldedSpend: [],
        vShieldedOutput: [],
        bindingSig: base_1.EMPTY_SCRIPT,
        consensusBranchId: 0,
    };
    tx.byteLength = byteLength.bind(null, tx);
    tx.toBuffer = toBuffer.bind(null, tx);
    tx.getExtraData = getExtraData.bind(null, tx);
    tx.getHash = getHash.bind(null, tx);
    return tx;
}
function fromBuffer(buffer, options) {
    const bufferReader = new bufferutils_1.BufferReader(buffer);
    const tx = fromConstructor(options);
    const txSpecific = tx.specific;
    tx.version = bufferReader.readInt32();
    txSpecific.overwintered = tx.version >>> 31;
    tx.version &= 0x07fffffff;
    if (tx.version >= ZCASH_OVERWINTER_VERSION) {
        txSpecific.versionGroupId = bufferReader.readUInt32();
    }
    if (tx.version >= ZCASH_NU5_VERSION) {
        txSpecific.consensusBranchId = bufferReader.readUInt32();
        tx.locktime = bufferReader.readUInt32();
        tx.expiry = bufferReader.readUInt32();
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
    if (tx.version < ZCASH_NU5_VERSION) {
        tx.locktime = bufferReader.readUInt32();
        tx.expiry = tx.version >= ZCASH_OVERWINTER_VERSION ? bufferReader.readUInt32() : 0;
    }
    function readCompressedG1() {
        const yLsb = bufferReader.readUInt8() & 1;
        const x = bufferReader.readSlice(32);
        return {
            x,
            yLsb,
        };
    }
    function readCompressedG2() {
        const yLsb = bufferReader.readUInt8() & 1;
        const x = bufferReader.readSlice(64);
        return {
            x,
            yLsb,
        };
    }
    function readSaplingZKProof() {
        return {
            type: 'sapling',
            sA: bufferReader.readSlice(48),
            sB: bufferReader.readSlice(96),
            sC: bufferReader.readSlice(48),
        };
    }
    function readZKProof() {
        if (tx.version >= ZCASH_SAPLING_VERSION) {
            return readSaplingZKProof();
        }
        return {
            type: 'joinsplit',
            gA: readCompressedG1(),
            gAPrime: readCompressedG1(),
            gB: readCompressedG2(),
            gBPrime: readCompressedG1(),
            gC: readCompressedG1(),
            gCPrime: readCompressedG1(),
            gK: readCompressedG1(),
            gH: readCompressedG1(),
        };
    }
    if (tx.version === ZCASH_SAPLING_VERSION) {
        txSpecific.valueBalance = bufferReader.readInt64();
        const nShieldedSpend = bufferReader.readVarInt();
        for (let i = 0; i < nShieldedSpend; ++i) {
            txSpecific.vShieldedSpend.push({
                cv: bufferReader.readSlice(32),
                anchor: bufferReader.readSlice(32),
                nullifier: bufferReader.readSlice(32),
                rk: bufferReader.readSlice(32),
                zkproof: readSaplingZKProof(),
                spendAuthSig: bufferReader.readSlice(64),
            });
        }
        const nShieldedOutput = bufferReader.readVarInt();
        for (let i = 0; i < nShieldedOutput; ++i) {
            txSpecific.vShieldedOutput.push({
                cv: bufferReader.readSlice(32),
                cmu: bufferReader.readSlice(32),
                ephemeralKey: bufferReader.readSlice(32),
                encCiphertext: bufferReader.readSlice(580),
                outCiphertext: bufferReader.readSlice(80),
                zkproof: readSaplingZKProof(),
            });
        }
    }
    if (tx.version >= ZCASH_JOINSPLITS_SUPPORT_VERSION && tx.version < ZCASH_NU5_VERSION) {
        const joinSplitsLen = bufferReader.readVarInt();
        for (let i = 0; i < joinSplitsLen; ++i) {
            let j;
            const vpubOld = bufferReader.readUInt64();
            const vpubNew = bufferReader.readUInt64();
            const anchor = bufferReader.readSlice(32);
            const nullifiers = [];
            for (j = 0; j < ZCASH_NUM_JOINSPLITS_INPUTS; j++) {
                nullifiers.push(bufferReader.readSlice(32));
            }
            const commitments = [];
            for (j = 0; j < ZCASH_NUM_JOINSPLITS_OUTPUTS; j++) {
                commitments.push(bufferReader.readSlice(32));
            }
            const ephemeralKey = bufferReader.readSlice(32);
            const randomSeed = bufferReader.readSlice(32);
            const macs = [];
            for (j = 0; j < ZCASH_NUM_JOINSPLITS_INPUTS; j++) {
                macs.push(bufferReader.readSlice(32));
            }
            const zkproof = readZKProof();
            const ciphertexts = [];
            for (j = 0; j < ZCASH_NUM_JOINSPLITS_OUTPUTS; j++) {
                ciphertexts.push(bufferReader.readSlice(ZCASH_NOTECIPHERTEXT_SIZE));
            }
            txSpecific.joinsplits.push({
                vpubOld,
                vpubNew,
                anchor,
                nullifiers,
                commitments,
                ephemeralKey,
                randomSeed,
                macs,
                zkproof,
                ciphertexts,
            });
        }
        if (joinSplitsLen > 0) {
            txSpecific.joinsplitPubkey = bufferReader.readSlice(32);
            txSpecific.joinsplitSig = bufferReader.readSlice(64);
        }
    }
    if (tx.version >= ZCASH_SAPLING_VERSION &&
        txSpecific.vShieldedSpend.length + txSpecific.vShieldedOutput.length > 0) {
        txSpecific.bindingSig = bufferReader.readSlice(64);
    }
    if (tx.version === ZCASH_NU5_VERSION) {
        if (bufferReader.readVarInt() !== 0) {
            throw Error('Unexpected vSpendsSapling vector');
        }
        if (bufferReader.readVarInt() !== 0) {
            throw Error('Unexpected vOutputsSapling vector');
        }
        if (bufferReader.readUInt8() !== 0x00) {
            throw Error('Unexpected orchard byte');
        }
    }
    if (options.nostrict)
        return tx;
    if (bufferReader.offset !== buffer.length)
        throw new Error('Transaction has unexpected data');
    return tx;
}
//# sourceMappingURL=zcash.js.map