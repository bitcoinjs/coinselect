"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2pk = p2pk;
const tslib_1 = require("tslib");
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const networks_1 = require("../networks");
const bscript = tslib_1.__importStar(require("../script"));
const lazy = tslib_1.__importStar(require("./lazy"));
const types_1 = require("../types");
const { OPS } = bscript;
function p2pk(a, opts) {
    if (!a.input && !a.output && !a.pubkey && !a.input && !a.signature)
        throw new TypeError('Not enough data');
    opts = Object.assign({ validate: true }, opts || {});
    (0, types_1.typeforce)({
        network: types_1.typeforce.maybe(types_1.typeforce.Object),
        output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
        pubkey: types_1.typeforce.maybe(tiny_secp256k1_1.default.isPoint),
        signature: types_1.typeforce.maybe(bscript.isCanonicalScriptSignature),
        input: types_1.typeforce.maybe(types_1.typeforce.Buffer),
    }, a);
    const _chunks = lazy.value(() => bscript.decompile(a.input));
    const network = a.network || networks_1.bitcoin;
    const o = { name: 'p2pk', network };
    lazy.prop(o, 'output', () => {
        if (!a.pubkey)
            return;
        return bscript.compile([a.pubkey, OPS.OP_CHECKSIG]);
    });
    lazy.prop(o, 'pubkey', () => {
        if (!a.output)
            return;
        return a.output.subarray(1, -1);
    });
    lazy.prop(o, 'signature', () => {
        if (!a.input)
            return;
        return _chunks()[0];
    });
    lazy.prop(o, 'input', () => {
        if (!a.signature)
            return;
        return bscript.compile([a.signature]);
    });
    lazy.prop(o, 'witness', () => {
        if (!o.input)
            return;
        return [];
    });
    if (opts.validate) {
        if (a.output) {
            if (a.output[a.output.length - 1] !== OPS.OP_CHECKSIG)
                throw new TypeError('Output is invalid');
            if (!tiny_secp256k1_1.default.isPoint(o.pubkey))
                throw new TypeError('Output pubkey is invalid');
            if (a.pubkey && !a.pubkey.equals(o.pubkey))
                throw new TypeError('Pubkey mismatch');
        }
        if (a.signature) {
            if (a.input && !a.input.equals(o.input))
                throw new TypeError('Signature mismatch');
        }
        if (a.input) {
            if (_chunks().length !== 1)
                throw new TypeError('Input is invalid');
            if (!bscript.isCanonicalScriptSignature(o.signature))
                throw new TypeError('Input has invalid signature');
        }
    }
    return Object.assign(o, a);
}
//# sourceMappingURL=p2pk.js.map