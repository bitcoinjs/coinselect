"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBlake = decodeBlake;
exports.decodeBlake256Key = decodeBlake256Key;
exports.decodeBlake256 = decodeBlake256;
exports.encodeBlake256 = encodeBlake256;
exports.encode = encode;
exports.decode = decode;
exports.decodeAddress = decodeAddress;
exports.encodeAddress = encodeAddress;
const tslib_1 = require("tslib");
const bchaddrjs_1 = tslib_1.__importDefault(require("bchaddrjs"));
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const bs58check_1 = tslib_1.__importDefault(require("bs58check"));
const networks_1 = require("./networks");
const crypto_1 = require("./crypto");
function decodeBlake(buffer) {
    const want = buffer.subarray(-4);
    const payload = buffer.subarray(0, -4);
    const got = (0, crypto_1.blake256)((0, crypto_1.blake256)(payload)).subarray(0, 4);
    if ((want[0] ^ got[0]) | (want[1] ^ got[1]) | (want[2] ^ got[2]) | (want[3] ^ got[3]))
        throw new Error('invalid checksum');
    return payload;
}
function decodeBlake256Key(key) {
    const bytes = bs58_1.default.decode(key);
    const buffer = Buffer.from(bytes);
    return decodeBlake(buffer);
}
function decodeBlake256(address) {
    const bytes = bs58_1.default.decode(address);
    const buffer = Buffer.from(bytes);
    if (buffer.length !== 26)
        throw new Error(`${address} invalid address length`);
    let payload;
    try {
        payload = decodeBlake(buffer);
    }
    catch (e) {
        if (e instanceof Error) {
            throw new Error(`${address} ${e.message}`);
        }
        throw new Error(`${address} ${e}`);
    }
    return payload;
}
function encodeBlake256(payload) {
    const checksum = (0, crypto_1.blake256)((0, crypto_1.blake256)(payload)).subarray(0, 4);
    return bs58_1.default.encode(Buffer.concat([payload, checksum]));
}
function encode(payload, network = networks_1.bitcoin) {
    return (0, networks_1.isNetworkType)('decred', network) ? encodeBlake256(payload) : bs58check_1.default.encode(payload);
}
function decode(payload, network = networks_1.bitcoin) {
    return (0, networks_1.isNetworkType)('decred', network) ? decodeBlake256(payload) : bs58check_1.default.decode(payload);
}
function decodeAddress(address, network = networks_1.bitcoin) {
    let payload;
    if ((0, networks_1.isNetworkType)('bitcoinCash', network)) {
        if (!bchaddrjs_1.default.isCashAddress(address))
            throw Error(`${address} is not a cash address`);
        payload = Buffer.from(bs58check_1.default.decode(bchaddrjs_1.default.toLegacyAddress(address)));
    }
    else {
        payload = Buffer.from(decode(address, network));
    }
    if (payload.length < 21)
        throw new TypeError(`${address} is too short`);
    if (payload.length > 22)
        throw new TypeError(`${address} is too long`);
    const multibyte = payload.length === 22;
    const offset = multibyte ? 2 : 1;
    const version = multibyte ? payload.readUInt16BE(0) : payload[0];
    const hash = payload.subarray(offset);
    return { version, hash };
}
function encodeAddress(hash, version, network = networks_1.bitcoin) {
    const multibyte = version > 0xff;
    const size = multibyte ? 22 : 21;
    const offset = multibyte ? 2 : 1;
    const payload = Buffer.allocUnsafe(size);
    if (multibyte) {
        payload.writeUInt16BE(version, 0);
    }
    else {
        payload.writeUInt8(version, 0);
    }
    hash.copy(payload, offset);
    const encoded = encode(payload, network);
    return (0, networks_1.isNetworkType)('bitcoinCash', network) ? bchaddrjs_1.default.toCashAddress(encoded) : encoded;
}
//# sourceMappingURL=bs58check.js.map