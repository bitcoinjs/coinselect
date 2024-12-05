"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2tr = p2tr;
const tslib_1 = require("tslib");
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const bech32_1 = require("bech32");
const networks_1 = require("../networks");
const bcrypto = tslib_1.__importStar(require("../crypto"));
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
const TAGS = ['TapLeaf', 'TapBranch', 'TapTweak', 'KeyAgg list', 'KeyAgg coefficient'];
const TAGGED_HASH_PREFIXES = TAGS.reduce((obj, tag) => {
    const tagHash = bcrypto.sha256(Buffer.from(tag));
    obj[tag] = Buffer.concat([tagHash, tagHash]);
    return obj;
}, {});
const EVEN_Y_COORD_PREFIX = new Uint8Array([0x02]);
function taggedHash(prefix, data) {
    return bcrypto.sha256(Buffer.concat([TAGGED_HASH_PREFIXES[prefix], data]));
}
function tapTweakPubkey(pubkey, tapTreeRoot) {
    let tapTweak;
    if (tapTreeRoot) {
        tapTweak = taggedHash('TapTweak', Buffer.concat([pubkey, tapTreeRoot]));
    }
    else {
        tapTweak = taggedHash('TapTweak', pubkey);
    }
    const tweakedPubkey = tiny_secp256k1_1.default.pointAddScalar(Buffer.concat([EVEN_Y_COORD_PREFIX, pubkey]), tapTweak);
    return {
        parity: tweakedPubkey[0] === EVEN_Y_COORD_PREFIX[0] ? 0 : 1,
        pubkey: tweakedPubkey.slice(1),
    };
}
const liftX = (pubkey) => {
    const offset = pubkey.length === 33 ? 1 : 0;
    return pubkey.subarray(offset);
};
function p2tr(a, opts) {
    if (!a.address && !a.pubkey && !a.output)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    const network = a.network || networks_1.bitcoin;
    const o = { name: 'p2tr', network };
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        address: types_1.typeforce.maybe(types_1.typeforce.String),
        output: types_1.typeforce.maybe(types_1.typeforce.BufferN(34)),
        pubkey: types_1.typeforce.maybe(types_1.typeforce.anyOf(types_1.typeforce.BufferN(32), types_1.typeforce.BufferN(33))),
    }, a);
    const _address = lazy.value(() => {
        const result = bech32_1.bech32m.decode(a.address);
        const version = result.words.shift();
        const data = bech32_1.bech32m.fromWords(result.words);
        return {
            version,
            prefix: result.prefix,
            data: Buffer.from(data),
        };
    });
    lazy.prop(o, 'address', () => {
        if (!o.hash)
            return;
        const words = bech32_1.bech32m.toWords(o.hash);
        words.unshift(0x01);
        return bech32_1.bech32m.encode(network.bech32, words);
    });
    lazy.prop(o, 'hash', () => {
        if (a.output)
            return a.output.subarray(2);
        if (a.address)
            return _address().data;
        if (a.pubkey) {
            return tapTweakPubkey(liftX(a.pubkey)).pubkey;
        }
    });
    lazy.prop(o, 'output', () => {
        if (!o.hash)
            return;
        return bscript.compile([OPS.OP_1, o.hash]);
    });
    if (opts.validate) {
        let hash = Buffer.from([]);
        if (a.address) {
            const { prefix, version, data } = _address();
            if (prefix !== network.bech32)
                throw new TypeError('Invalid prefix or Network mismatch');
            if (version !== 0x01)
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
            if (a.output[0] !== OPS.OP_1 || a.output[1] !== 0x20)
                throw new TypeError('p2tr output is invalid');
            const hash2 = a.output.subarray(2);
            if (hash.length > 0 && !hash.equals(hash2))
                throw new TypeError('Hash mismatch');
            else
                hash = hash2;
        }
        if (a.pubkey) {
            const pkh = tapTweakPubkey(liftX(a.pubkey)).pubkey;
            if (hash.length > 0 && !hash.equals(pkh))
                throw new TypeError('Hash mismatch');
            else
                hash = pkh;
            if (!tiny_secp256k1_1.default.isPoint(Buffer.concat([EVEN_Y_COORD_PREFIX, liftX(a.pubkey)])))
                throw new TypeError('Invalid pubkey for p2tr');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=p2tr.js.map