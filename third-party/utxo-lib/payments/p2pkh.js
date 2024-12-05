"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pkh = p2pkh;
const tslib_1 = require("tslib");
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const bs58check = tslib_1.__importStar(require("../bs58check"));
const bcrypto = tslib_1.__importStar(require("../crypto"));
const networks_1 = require("../networks");
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
function p2pkh(a, opts) {
    if (!a.address && !a.hash && !a.output && !a.pubkey && !a.input)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        address: types_1.typeforce.maybe(types_1.typeforce.String),
        hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(20)),
        output: types_1.typeforce.maybe(types_1.typeforce.BufferN(25)),
        pubkey: types_1.typeforce.maybe(tiny_secp256k1_1.default.isPoint),
        signature: types_1.typeforce.maybe(bscript.isCanonicalScriptSignature),
        input: types_1.typeforce.maybe(types_1.typeforce.Buffer),
    }, a);
    const _address = lazy.value(() => bs58check.decodeAddress(a.address, a.network));
    const _chunks = lazy.value(() => bscript.decompile(a.input));
    const network = a.network || networks_1.bitcoin;
    const o = { name: 'p2pkh', network };
    lazy.prop(o, 'address', () => {
        if (!o.hash)
            return;
        return bs58check.encodeAddress(o.hash, network.pubKeyHash, network);
    });
    lazy.prop(o, 'hash', () => {
        if (a.output)
            return a.output.subarray(3, 23);
        if (a.address)
            return _address().hash;
        if (a.pubkey || o.pubkey)
            return bcrypto.hash160(a.pubkey || o.pubkey);
    });
    lazy.prop(o, 'output', () => {
        if (!o.hash)
            return;
        return bscript.compile([
            OPS.OP_DUP,
            OPS.OP_HASH160,
            o.hash,
            OPS.OP_EQUALVERIFY,
            OPS.OP_CHECKSIG,
        ]);
    });
    lazy.prop(o, 'pubkey', () => {
        if (!a.input)
            return;
        return _chunks()[1];
    });
    lazy.prop(o, 'signature', () => {
        if (!a.input)
            return;
        return _chunks()[0];
    });
    lazy.prop(o, 'input', () => {
        if (!a.pubkey)
            return;
        if (!a.signature)
            return;
        return bscript.compile([a.signature, a.pubkey]);
    });
    lazy.prop(o, 'witness', () => {
        if (!o.input)
            return;
        return [];
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
            if (a.output.length !== 25 ||
                a.output[0] !== OPS.OP_DUP ||
                a.output[1] !== OPS.OP_HASH160 ||
                a.output[2] !== 0x14 ||
                a.output[23] !== OPS.OP_EQUALVERIFY ||
                a.output[24] !== OPS.OP_CHECKSIG)
                throw new TypeError('Output is invalid');
            const hash2 = a.output.subarray(3, 23);
            if (hash.length > 0 && !hash.equals(hash2))
                throw new TypeError('Hash mismatch');
            else
                hash = hash2;
        }
        if (a.pubkey) {
            const pkh = bcrypto.hash160(a.pubkey);
            if (hash.length > 0 && !hash.equals(pkh))
                throw new TypeError('Hash mismatch');
            else
                hash = pkh;
        }
        if (a.input) {
            const chunks = _chunks();
            if (chunks.length !== 2)
                throw new TypeError('Input is invalid');
            if (!bscript.isCanonicalScriptSignature(chunks[0]))
                throw new TypeError('Input has invalid signature');
            if (!tiny_secp256k1_1.default.isPoint(chunks[1]))
                throw new TypeError('Input has invalid pubkey');
            if (a.signature && !a.signature.equals(chunks[0]))
                throw new TypeError('Signature mismatch');
            if (a.pubkey && !a.pubkey.equals(chunks[1]))
                throw new TypeError('Pubkey mismatch');
            const pkh = bcrypto.hash160(chunks[1]);
            if (hash.length > 0 && !hash.equals(pkh))
                throw new TypeError('Hash mismatch');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=p2pkh.js.map