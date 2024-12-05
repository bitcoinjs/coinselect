"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromBase58Check = fromBase58Check;
exports.fromBech32 = fromBech32;
exports.toBech32 = toBech32;
exports.fromOutputScript = fromOutputScript;
exports.getAddressType = getAddressType;
exports.toOutputScript = toOutputScript;
const tslib_1 = require("tslib");
const bech32_1 = require("bech32");
const bs58check = tslib_1.__importStar(require("./bs58check"));
const bscript = tslib_1.__importStar(require("./script"));
const payments = tslib_1.__importStar(require("./payments"));
const networks_1 = require("./networks");
function fromBase58Check(address, network = networks_1.bitcoin) {
    return bs58check.decodeAddress(address, network);
}
function fromBech32(address) {
    let result;
    let version;
    try {
        result = bech32_1.bech32.decode(address);
    }
    catch (_a) {
    }
    if (result) {
        [version] = result.words;
        if (version !== 0)
            throw new TypeError(`${address} uses wrong encoding`);
    }
    else {
        result = bech32_1.bech32m.decode(address);
        [version] = result.words;
        if (version === 0)
            throw new TypeError(`${address} uses wrong encoding`);
    }
    const data = bech32_1.bech32.fromWords(result.words.slice(1));
    return {
        version,
        prefix: result.prefix,
        data: Buffer.from(data),
    };
}
function toBech32(data, version, prefix) {
    const words = bech32_1.bech32.toWords(data);
    words.unshift(version);
    return version === 0 ? bech32_1.bech32.encode(prefix, words) : bech32_1.bech32m.encode(prefix, words);
}
const FUTURE_SEGWIT_MAX_SIZE = 40;
const FUTURE_SEGWIT_MIN_SIZE = 2;
const FUTURE_SEGWIT_MAX_VERSION = 16;
const FUTURE_SEGWIT_MIN_VERSION = 1;
const FUTURE_SEGWIT_VERSION_DIFF = 0x50;
function toFutureSegwitAddress(output, network = networks_1.bitcoin) {
    const data = output.subarray(2);
    if (data.length < FUTURE_SEGWIT_MIN_SIZE || data.length > FUTURE_SEGWIT_MAX_SIZE)
        throw new TypeError('Invalid program length for segwit address');
    const version = output[0] - FUTURE_SEGWIT_VERSION_DIFF;
    if (version < FUTURE_SEGWIT_MIN_VERSION || version > FUTURE_SEGWIT_MAX_VERSION)
        throw new TypeError('Invalid version for segwit address');
    if (output[1] !== data.length)
        throw new TypeError('Invalid script for segwit address');
    return toBech32(data, version, network.bech32);
}
function fromOutputScript(output, network = networks_1.bitcoin) {
    try {
        return payments.p2pkh({ output, network }).address;
    }
    catch (_a) {
    }
    try {
        return payments.p2sh({ output, network }).address;
    }
    catch (_b) {
    }
    try {
        return payments.p2wpkh({ output, network }).address;
    }
    catch (_c) {
    }
    try {
        return payments.p2wsh({ output, network }).address;
    }
    catch (_d) {
    }
    try {
        return payments.p2tr({ output, network }).address;
    }
    catch (_e) {
    }
    try {
        return toFutureSegwitAddress(output, network);
    }
    catch (_f) {
    }
    throw new Error(`${bscript.toASM(output)} has no matching Address`);
}
function decodeAddress(address, network) {
    try {
        const { hash, version } = fromBase58Check(address, network);
        return { success: true, format: 'base58', version, hash };
    }
    catch (_a) {
        try {
            const { data, prefix, version } = fromBech32(address);
            if (prefix === network.bech32) {
                return { success: true, format: 'bech32', version, hash: data };
            }
            return { success: false, error: 'bech32-invalid-prefix' };
        }
        catch (_b) {
        }
    }
    return { success: false, error: 'unknown-format' };
}
function identifyAddressType(format, version, hash, network) {
    if (format === 'base58') {
        if (version === network.pubKeyHash)
            return 'p2pkh';
        if (version === network.scriptHash)
            return 'p2sh';
    }
    else if (format === 'bech32') {
        if (version === 0) {
            if (hash.length === 20)
                return 'p2wpkh';
            if (hash.length === 32)
                return 'p2wsh';
        }
        else if (version === 1 && hash.length === 32) {
            return 'p2tr';
        }
        else if (version >= FUTURE_SEGWIT_MIN_VERSION &&
            version <= FUTURE_SEGWIT_MAX_VERSION &&
            hash.length >= FUTURE_SEGWIT_MIN_SIZE &&
            hash.length <= FUTURE_SEGWIT_MAX_SIZE) {
            return 'p2w-unknown';
        }
    }
    return 'unknown';
}
function createOutputScript(type, hash, version) {
    switch (type) {
        case 'p2pkh':
            return payments.p2pkh({ hash }).output;
        case 'p2sh':
            return payments.p2sh({ hash }).output;
        case 'p2wpkh':
            return payments.p2wpkh({ hash }).output;
        case 'p2wsh':
            return payments.p2wsh({ hash }).output;
        case 'p2tr':
        case 'p2w-unknown':
            return bscript.compile([version + FUTURE_SEGWIT_VERSION_DIFF, hash]);
    }
}
function getAddressType(address, network = networks_1.bitcoin) {
    const { success, format, version, hash } = decodeAddress(address, network);
    return success ? identifyAddressType(format, version, hash, network) : 'unknown';
}
function toOutputScript(address, network = networks_1.bitcoin) {
    const { success, format, version, hash, error } = decodeAddress(address, network);
    if (success) {
        const type = identifyAddressType(format, version, hash, network);
        if (type !== 'unknown') {
            return createOutputScript(type, hash, version);
        }
    }
    else if (error === 'bech32-invalid-prefix') {
        throw new Error(`${address} has an invalid prefix`);
    }
    throw new Error(`${address} has no matching Script`);
}
//# sourceMappingURL=address.js.map