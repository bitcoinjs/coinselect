"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sstxcommitment = sstxcommitment;
const tslib_1 = require("tslib");
const bufferutils_1 = require("../bufferutils");
const bs58check = tslib_1.__importStar(require("../bs58check"));
const networks_1 = require("../networks");
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
function sstxcommitment(a, opts) {
    if (!a.address && !a.amount && !a.hash && !a.output)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        address: types_1.typeforce.maybe(types_1.typeforce.String),
        amount: types_1.typeforce.maybe(types_1.typeforce.String),
        hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(20)),
        output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
    }, a);
    const _address = lazy.value(() => bs58check.decodeAddress(a.address, a.network));
    const network = a.network || networks_1.decred;
    const o = { name: 'sstxcommitment', network };
    lazy.prop(o, 'address', () => {
        if (!o.hash)
            return;
        return bs58check.encodeAddress(o.hash, network.pubKeyHash, network);
    });
    lazy.prop(o, 'hash', () => {
        if (a.output)
            return a.output.subarray(2, 22);
        if (a.address)
            return _address().hash;
    });
    lazy.prop(o, 'output', () => {
        if (!o.hash || !a.amount)
            return;
        const buf = Buffer.allocUnsafe(o.hash.length + 10);
        const writer = new bufferutils_1.BufferWriter(buf);
        writer.writeSlice(o.hash);
        writer.writeUInt64(a.amount);
        writer.writeUInt8(0);
        writer.writeUInt8(88);
        return bscript.compile([OPS.OP_RETURN, buf]);
    });
    if (opts.validate) {
        let hash = Buffer.from([]);
        if (a.address) {
            const { version, hash: aHash } = _address();
            if (version !== network.pubKeyHash)
                throw new TypeError('Invalid version or Network mismatch');
            if (aHash.length !== 20)
                throw new TypeError('Invalid address');
            hash = aHash;
        }
        if (a.hash) {
            if (hash.length > 0 && !hash.equals(a.hash))
                throw new TypeError('Hash mismatch');
            else
                hash = a.hash;
        }
        if (a.output) {
            if (a.output.length !== 32 || a.output[0] !== OPS.OP_RETURN)
                throw new TypeError('sstxcommitment output is invalid');
            const hash2 = a.output.subarray(2, 22);
            if (hash.length > 0 && !hash.equals(hash2))
                throw new TypeError('Hash mismatch');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=sstxcommitment.js.map