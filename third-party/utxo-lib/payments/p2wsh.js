"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2wsh = p2wsh;
const tslib_1 = require("tslib");
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const bech32_1 = require("bech32");
const bcrypto = tslib_1.__importStar(require("../crypto"));
const networks_1 = require("../networks");
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
const EMPTY_BUFFER = Buffer.alloc(0);
function stacksEqual(a, b) {
    if (a.length !== b.length)
        return false;
    return a.every((x, i) => x.equals(b[i]));
}
function chunkHasUncompressedPubkey(chunk) {
    if (Buffer.isBuffer(chunk) && chunk.length === 65 && chunk[0] === 0x04 && tiny_secp256k1_1.default.isPoint(chunk)) {
        return true;
    }
    return false;
}
function p2wsh(a, opts) {
    if (!a.address && !a.hash && !a.output && !a.redeem && !a.witness)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        address: types_1.typeforce.maybe(types_1.typeforce.String),
        hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(32)),
        output: types_1.typeforce.maybe(types_1.typeforce.BufferN(34)),
        redeem: types_1.typeforce.maybe({
            input: types_1.typeforce.maybe(types_1.typeforce.Buffer),
            network: types_1.typeforce.maybe(types_1.typeforce.Object),
            output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
            witness: types_1.typeforce.maybe(types_1.typeforce.arrayOf(types_1.typeforce.Buffer)),
        }),
        input: types_1.typeforce.maybe(types_1.typeforce.BufferN(0)),
        witness: types_1.typeforce.maybe(types_1.typeforce.arrayOf(types_1.typeforce.Buffer)),
    }, a);
    const _address = lazy.value(() => {
        const result = bech32_1.bech32.decode(a.address);
        const version = result.words.shift();
        const data = bech32_1.bech32.fromWords(result.words);
        return {
            version,
            prefix: result.prefix,
            data: Buffer.from(data),
        };
    });
    const _rchunks = lazy.value(() => bscript.decompile(a.redeem.input));
    let { network } = a;
    if (!network) {
        network = (a.redeem && a.redeem.network) || networks_1.bitcoin;
    }
    const o = { name: 'p2wsh', network };
    lazy.prop(o, 'address', () => {
        if (!o.hash)
            return;
        const words = bech32_1.bech32.toWords(o.hash);
        words.unshift(0x00);
        return bech32_1.bech32.encode(network.bech32, words);
    });
    lazy.prop(o, 'hash', () => {
        if (a.output)
            return a.output.subarray(2);
        if (a.address)
            return _address().data;
        if (o.redeem && o.redeem.output)
            return bcrypto.sha256(o.redeem.output);
    });
    lazy.prop(o, 'output', () => {
        if (!o.hash)
            return;
        return bscript.compile([OPS.OP_0, o.hash]);
    });
    lazy.prop(o, 'redeem', () => {
        if (!a.witness)
            return;
        return {
            output: a.witness[a.witness.length - 1],
            input: EMPTY_BUFFER,
            witness: a.witness.slice(0, -1),
        };
    });
    lazy.prop(o, 'input', () => {
        if (!o.witness)
            return;
        return EMPTY_BUFFER;
    });
    lazy.prop(o, 'witness', () => {
        if (a.redeem &&
            a.redeem.input &&
            a.redeem.input.length > 0 &&
            a.redeem.output &&
            a.redeem.output.length > 0) {
            const stack = bscript.toStack(_rchunks());
            o.redeem = Object.assign({ witness: stack }, a.redeem);
            o.redeem.input = EMPTY_BUFFER;
            return [].concat(stack, a.redeem.output);
        }
        if (!a.redeem)
            return;
        if (!a.redeem.output)
            return;
        if (!a.redeem.witness)
            return;
        return [].concat(a.redeem.witness, a.redeem.output);
    });
    lazy.prop(o, 'name', () => {
        const nameParts = ['p2wsh'];
        if (o.redeem !== undefined && o.redeem.name !== undefined)
            nameParts.push(o.redeem.name);
        return nameParts.join('-');
    });
    if (opts.validate) {
        let hash = Buffer.from([]);
        if (a.address) {
            const { prefix, version, data } = _address();
            if (prefix !== network.bech32)
                throw new TypeError('Invalid prefix or Network mismatch');
            if (version !== 0x00)
                throw new TypeError('Invalid address version');
            if (data.length !== 32)
                throw new TypeError('Invalid address data');
            hash = data;
        }
        if (a.hash) {
            if (hash.length > 0 && !hash.equals(a.hash))
                throw new TypeError('Hash mismatch');
            else
                hash = a.hash;
        }
        if (a.output) {
            if (a.output.length !== 34 || a.output[0] !== OPS.OP_0 || a.output[1] !== 0x20)
                throw new TypeError('Output is invalid');
            const hash2 = a.output.subarray(2);
            if (hash.length > 0 && !hash.equals(hash2))
                throw new TypeError('Hash mismatch');
            else
                hash = hash2;
        }
        if (a.redeem) {
            if (a.redeem.network && a.redeem.network !== network)
                throw new TypeError('Network mismatch');
            if (a.redeem.input &&
                a.redeem.input.length > 0 &&
                a.redeem.witness &&
                a.redeem.witness.length > 0)
                throw new TypeError('Ambiguous witness source');
            if (a.redeem.output) {
                if (bscript.decompile(a.redeem.output).length === 0)
                    throw new TypeError('Redeem.output is invalid');
                const hash2 = bcrypto.sha256(a.redeem.output);
                if (hash.length > 0 && !hash.equals(hash2))
                    throw new TypeError('Hash mismatch');
                else
                    hash = hash2;
            }
            if (a.redeem.input && !bscript.isPushOnly(_rchunks()))
                throw new TypeError('Non push-only scriptSig');
            if (a.witness && a.redeem.witness && !stacksEqual(a.witness, a.redeem.witness))
                throw new TypeError('Witness and redeem.witness mismatch');
            if ((a.redeem.input && _rchunks().some(chunkHasUncompressedPubkey)) ||
                (a.redeem.output &&
                    (bscript.decompile(a.redeem.output) || []).some(chunkHasUncompressedPubkey))) {
                throw new TypeError('redeem.input or redeem.output contains uncompressed pubkey');
            }
        }
        if (a.witness && a.witness.length > 0) {
            const wScript = a.witness[a.witness.length - 1];
            if (a.redeem && a.redeem.output && !a.redeem.output.equals(wScript))
                throw new TypeError('Witness and redeem.output mismatch');
            if (a.witness.some(chunkHasUncompressedPubkey) ||
                (bscript.decompile(wScript) || []).some(chunkHasUncompressedPubkey))
                throw new TypeError('Witness contains uncompressed pubkey');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=p2wsh.js.map