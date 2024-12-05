"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sstxsh = sstxsh;
const tslib_1 = require("tslib");
const bs58check = tslib_1.__importStar(require("../bs58check"));
const networks_1 = require("../networks");
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
function sstxsh(a, opts) {
    if (!a.address && !a.hash && !a.output)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        address: types_1.typeforce.maybe(types_1.typeforce.String),
        hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(20)),
        output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
    }, a);
    const network = a.network || networks_1.decred;
    const o = { name: 'sstxsh', network };
    const _address = lazy.value(() => bs58check.decodeAddress(a.address, network));
    lazy.prop(o, 'address', () => {
        if (!o.hash)
            return;
        return bs58check.encodeAddress(o.hash, network.scriptHash, network);
    });
    lazy.prop(o, 'hash', () => {
        if (a.output)
            return a.output.subarray(3, 23);
        if (a.address)
            return _address().hash;
    });
    lazy.prop(o, 'output', () => {
        if (!o.hash)
            return;
        return bscript.compile([OPS.OP_SSTX, OPS.OP_HASH160, o.hash, OPS.OP_EQUAL]);
    });
    if (opts.validate) {
        let hash = Buffer.from([]);
        if (a.address) {
            const { version, hash: aHash } = _address();
            if (version !== network.scriptHash)
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
            if (a.output.length !== 24 ||
                a.output[0] !== OPS.OP_SSTX ||
                a.output[1] !== OPS.OP_HASH160 ||
                a.output[2] !== 0x14 ||
                a.output[23] !== OPS.OP_EQUAL)
                throw new TypeError('sstxsh output is invalid');
            const hash2 = a.output.subarray(3, 23);
            if (hash.length > 0 && !hash.equals(hash2))
                throw new TypeError('Hash mismatch');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=sstxsh.js.map