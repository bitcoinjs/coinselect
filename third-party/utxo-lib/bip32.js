"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromBase58 = fromBase58;
exports.fromPrivateKey = fromPrivateKey;
exports.fromPublicKey = fromPublicKey;
exports.fromSeed = fromSeed;
const tslib_1 = require("tslib");
const tiny_secp256k1_1 = tslib_1.__importDefault(require("tiny-secp256k1"));
const wif = tslib_1.__importStar(require("wif"));
const typeforce_1 = require("./types/typeforce");
const bs58check = tslib_1.__importStar(require("./bs58check"));
const crypto = tslib_1.__importStar(require("./crypto"));
const networks_1 = require("./networks");
const UINT256_TYPE = typeforce_1.typeforce.BufferN(32);
const NETWORK_TYPE = typeforce_1.typeforce.compile({
    wif: typeforce_1.typeforce.UInt8,
    bip32: {
        public: typeforce_1.typeforce.UInt32,
        private: typeforce_1.typeforce.UInt32,
    },
});
const HIGHEST_BIT = 0x80000000;
const UINT31_MAX = Math.pow(2, 31) - 1;
function BIP32Path(value) {
    return typeforce_1.typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/) !== null;
}
function UInt31(value) {
    return typeforce_1.typeforce.UInt32(value) && value <= UINT31_MAX;
}
function fromPrivateKeyLocal(privateKey, chainCode, network, depth, index, parentFingerprint) {
    (0, typeforce_1.typeforce)({
        privateKey: UINT256_TYPE,
        chainCode: UINT256_TYPE,
    }, { privateKey, chainCode });
    network = network || networks_1.bitcoin;
    if (!tiny_secp256k1_1.default.isPrivate(privateKey))
        throw new TypeError('Private key not in range [1, n)');
    return new BIP32(privateKey, undefined, chainCode, network, depth, index, parentFingerprint);
}
function fromPublicKeyLocal(publicKey, chainCode, network, depth, index, parentFingerprint) {
    (0, typeforce_1.typeforce)({
        publicKey: typeforce_1.typeforce.BufferN(33),
        chainCode: UINT256_TYPE,
    }, { publicKey, chainCode });
    network = network || networks_1.bitcoin;
    if (!tiny_secp256k1_1.default.isPoint(publicKey))
        throw new TypeError('Point is not on the curve');
    return new BIP32(undefined, publicKey, chainCode, network, depth, index, parentFingerprint);
}
class BIP32 {
    constructor(__D, __Q, chainCode, network, __DEPTH = 0, __INDEX = 0, __PARENT_FINGERPRINT = 0x00000000) {
        this.__D = __D;
        this.__Q = __Q;
        this.chainCode = chainCode;
        this.network = network;
        this.__DEPTH = __DEPTH;
        this.__INDEX = __INDEX;
        this.__PARENT_FINGERPRINT = __PARENT_FINGERPRINT;
        (0, typeforce_1.typeforce)(NETWORK_TYPE, network);
        this.lowR = false;
    }
    get depth() {
        return this.__DEPTH;
    }
    get index() {
        return this.__INDEX;
    }
    get parentFingerprint() {
        return this.__PARENT_FINGERPRINT;
    }
    get publicKey() {
        if (this.__Q === undefined)
            this.__Q = tiny_secp256k1_1.default.pointFromScalar(this.__D, true);
        return this.__Q;
    }
    get privateKey() {
        return this.__D;
    }
    get identifier() {
        if ((0, networks_1.isNetworkType)('decred', this.network))
            return crypto.hash160blake256(this.publicKey);
        return crypto.hash160(this.publicKey);
    }
    get fingerprint() {
        return this.identifier.subarray(0, 4);
    }
    get compressed() {
        return true;
    }
    isNeutered() {
        return this.__D === undefined;
    }
    neutered() {
        return fromPublicKeyLocal(this.publicKey, this.chainCode, this.network, this.depth, this.index, this.parentFingerprint);
    }
    toBase58() {
        const { network } = this;
        const version = !this.isNeutered() ? network.bip32.private : network.bip32.public;
        const buffer = Buffer.allocUnsafe(78);
        buffer.writeUInt32BE(version, 0);
        buffer.writeUInt8(this.depth, 4);
        buffer.writeUInt32BE(this.parentFingerprint, 5);
        buffer.writeUInt32BE(this.index, 9);
        this.chainCode.copy(buffer, 13);
        if (!this.isNeutered()) {
            buffer.writeUInt8(0, 45);
            this.privateKey.copy(buffer, 46);
        }
        else {
            this.publicKey.copy(buffer, 45);
        }
        return bs58check.encode(buffer, network);
    }
    toWIF() {
        if (!this.privateKey)
            throw new TypeError('Missing private key');
        return wif.encode({
            version: this.network.wif,
            privateKey: this.privateKey,
            compressed: true,
        });
    }
    derive(index) {
        (0, typeforce_1.typeforce)(typeforce_1.typeforce.UInt32, index);
        const isHardened = index >= HIGHEST_BIT;
        const data = Buffer.allocUnsafe(37);
        if (isHardened) {
            if (this.isNeutered())
                throw new TypeError('Missing private key for hardened child key');
            data[0] = 0x00;
            this.privateKey.copy(data, 1);
            data.writeUInt32BE(index, 33);
        }
        else {
            this.publicKey.copy(data, 0);
            data.writeUInt32BE(index, 33);
        }
        const I = crypto.hmacSHA512(this.chainCode, data);
        const IL = I.subarray(0, 32);
        const IR = I.subarray(32);
        if (!tiny_secp256k1_1.default.isPrivate(IL))
            return this.derive(index + 1);
        let hd;
        if (!this.isNeutered()) {
            const ki = tiny_secp256k1_1.default.privateAdd(this.privateKey, IL);
            if (ki == null)
                return this.derive(index + 1);
            hd = fromPrivateKeyLocal(ki, IR, this.network, this.depth + 1, index, this.fingerprint.readUInt32BE(0));
        }
        else {
            const Ki = tiny_secp256k1_1.default.pointAddScalar(this.publicKey, IL, true);
            if (Ki === null)
                return this.derive(index + 1);
            hd = fromPublicKeyLocal(Ki, IR, this.network, this.depth + 1, index, this.fingerprint.readUInt32BE(0));
        }
        return hd;
    }
    deriveHardened(index) {
        (0, typeforce_1.typeforce)(UInt31, index);
        return this.derive(index + HIGHEST_BIT);
    }
    derivePath(path) {
        (0, typeforce_1.typeforce)(BIP32Path, path);
        let splitPath = path.split('/');
        if (splitPath[0] === 'm') {
            if (this.parentFingerprint)
                throw new TypeError('Expected master, got child');
            splitPath = splitPath.slice(1);
        }
        return splitPath.reduce((prevHd, indexStr) => {
            let index;
            if (indexStr.slice(-1) === `'`) {
                index = parseInt(indexStr.slice(0, -1), 10);
                return prevHd.deriveHardened(index);
            }
            index = parseInt(indexStr, 10);
            return prevHd.derive(index);
        }, this);
    }
    sign(hash, lowR) {
        if (!this.privateKey)
            throw new Error('Missing private key');
        if (lowR === undefined)
            lowR = this.lowR;
        if (lowR === false) {
            return tiny_secp256k1_1.default.sign(hash, this.privateKey);
        }
        let sig = tiny_secp256k1_1.default.sign(hash, this.privateKey);
        const extraData = Buffer.alloc(32, 0);
        let counter = 0;
        while (sig[0] > 0x7f) {
            counter++;
            extraData.writeUIntLE(counter, 0, 6);
            sig = tiny_secp256k1_1.default.signWithEntropy(hash, this.privateKey, extraData);
        }
        return sig;
    }
    verify(hash, signature) {
        return tiny_secp256k1_1.default.verify(hash, this.publicKey, signature);
    }
}
function fromBase58(inString, network) {
    const buffer = Buffer.from((0, networks_1.isNetworkType)('decred', network)
        ? bs58check.decodeBlake256Key(inString)
        : bs58check.decode(inString, network));
    if (buffer.length !== 78)
        throw new TypeError('Invalid buffer length');
    network = network || networks_1.bitcoin;
    const version = buffer.readUInt32BE(0);
    if (version !== network.bip32.private && version !== network.bip32.public)
        throw new TypeError('Invalid network version');
    const depth = buffer[4];
    const parentFingerprint = buffer.readUInt32BE(5);
    if (depth === 0) {
        if (parentFingerprint !== 0x00000000)
            throw new TypeError('Invalid parent fingerprint');
    }
    const index = buffer.readUInt32BE(9);
    if (depth === 0 && index !== 0)
        throw new TypeError('Invalid index');
    const chainCode = buffer.subarray(13, 45);
    let hd;
    if (version === network.bip32.private) {
        if (buffer.readUInt8(45) !== 0x00)
            throw new TypeError('Invalid private key');
        const k = buffer.subarray(46, 78);
        hd = fromPrivateKeyLocal(k, chainCode, network, depth, index, parentFingerprint);
    }
    else {
        const X = buffer.subarray(45, 78);
        hd = fromPublicKeyLocal(X, chainCode, network, depth, index, parentFingerprint);
    }
    return hd;
}
function fromPrivateKey(privateKey, chainCode, network) {
    return fromPrivateKeyLocal(privateKey, chainCode, network);
}
function fromPublicKey(publicKey, chainCode, network) {
    return fromPublicKeyLocal(publicKey, chainCode, network);
}
function fromSeed(seed, network) {
    (0, typeforce_1.typeforce)(typeforce_1.typeforce.Buffer, seed);
    if (seed.length < 16)
        throw new TypeError('Seed should be at least 128 bits');
    if (seed.length > 64)
        throw new TypeError('Seed should be at most 512 bits');
    network = network || networks_1.bitcoin;
    const I = crypto.hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), seed);
    const IL = I.subarray(0, 32);
    const IR = I.subarray(32);
    return fromPrivateKey(IL, IR, network);
}
//# sourceMappingURL=bip32.js.map