"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBase = exports.EMPTY_SCRIPT = void 0;
exports.varSliceSize = varSliceSize;
exports.vectorSize = vectorSize;
exports.isCoinbaseHash = isCoinbaseHash;
const tslib_1 = require("tslib");
const varuint = tslib_1.__importStar(require("varuint-bitcoin"));
const bufferutils_1 = require("../bufferutils");
const bcrypto = tslib_1.__importStar(require("../crypto"));
const types = tslib_1.__importStar(require("../types"));
const bscript = tslib_1.__importStar(require("../script"));
const networks_1 = require("../networks");
function varSliceSize(someScript) {
    const { length } = someScript;
    return varuint.encodingLength(length) + length;
}
function vectorSize(someVector) {
    return (varuint.encodingLength(someVector.length) +
        someVector.reduce((sum, witness) => sum + varSliceSize(witness), 0));
}
function isCoinbaseHash(buffer) {
    types.typeforce(types.Hash256bit, buffer);
    for (let i = 0; i < 32; ++i) {
        if (buffer[i] !== 0)
            return false;
    }
    return true;
}
exports.EMPTY_SCRIPT = Buffer.allocUnsafe(0);
class TransactionBase {
    constructor(options) {
        this.version = 1;
        this.locktime = 0;
        this.ins = [];
        this.outs = [];
        this.network = options.network || networks_1.bitcoin;
        this.specific = options.txSpecific;
    }
    isCoinbase() {
        return this.ins.length === 1 && isCoinbaseHash(this.ins[0].hash);
    }
    hasWitnesses() {
        return this.ins.some(x => x.witness.length !== 0);
    }
    isMwebPegOutTx() {
        if (!(0, networks_1.isNetworkType)('litecoin', this.network)) {
            return false;
        }
        return (this.outs.some(output => {
            const asm = bscript.toASM(output.script);
            return asm.startsWith('OP_8');
        }) &&
            this.ins.some(input => !input.script.length));
    }
    weight() {
        const base = this.byteLength(false, false);
        const total = this.byteLength(true, false);
        return base * 3 + total;
    }
    virtualSize() {
        return Math.ceil(this.weight() / 4);
    }
    byteLength(_ALLOW_WITNESS = true, _ALLOW_MWEB = true) {
        const hasWitnesses = _ALLOW_WITNESS && this.hasWitnesses();
        return ((hasWitnesses ? 10 : 8) +
            (this.timestamp ? 4 : 0) +
            varuint.encodingLength(this.ins.length) +
            varuint.encodingLength(this.outs.length) +
            this.ins.reduce((sum, input) => sum + 40 + varSliceSize(input.script), 0) +
            this.outs.reduce((sum, output) => sum + 8 + varSliceSize(output.script), 0) +
            (hasWitnesses
                ? this.ins.reduce((sum, input) => sum + vectorSize(input.witness), 0)
                : 0) +
            (_ALLOW_MWEB && this.isMwebPegOutTx() ? 3 : 0));
    }
    getHash(forWitness = false, forMweb = false) {
        if (forWitness && this.isCoinbase())
            return Buffer.alloc(32, 0);
        return bcrypto.hash256(this.toBuffer(undefined, undefined, forWitness, forMweb));
    }
    getId() {
        return (0, bufferutils_1.reverseBuffer)(this.getHash(false)).toString('hex');
    }
    getWitness(index) {
        if (!this.hasWitnesses() ||
            !this.ins[index] ||
            !Array.isArray(this.ins[index].witness) ||
            this.ins[index].witness.length < 1)
            return;
        const { witness } = this.ins[index];
        const chunks = witness.reduce((arr, chunk) => arr.concat([(0, bufferutils_1.getChunkSize)(chunk.length), chunk]), [(0, bufferutils_1.getChunkSize)(witness.length)]);
        return Buffer.concat(chunks);
    }
    getExtraData() {
    }
    getSpecificData() {
        return this.specific;
    }
    toBuffer(_buffer, _initialOffset, _ALLOW_WITNESS = true, _ALLOW_MWEB = true) {
        return exports.EMPTY_SCRIPT;
    }
    toHex() {
        return this.toBuffer().toString('hex');
    }
}
exports.TransactionBase = TransactionBase;
//# sourceMappingURL=base.js.map