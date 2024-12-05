"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripemd160 = ripemd160;
exports.sha1 = sha1;
exports.sha256 = sha256;
exports.blake256 = blake256;
exports.hash160 = hash160;
exports.hash160blake256 = hash160blake256;
exports.hash256 = hash256;
exports.hmacSHA512 = hmacSHA512;
const tslib_1 = require("tslib");
const blake_hash_1 = tslib_1.__importDefault(require("blake-hash"));
const create_hmac_1 = tslib_1.__importDefault(require("create-hmac"));
const crypto_1 = require("crypto");
function ripemd160(buffer) {
    try {
        return (0, crypto_1.createHash)('rmd160').update(buffer).digest();
    }
    catch (_a) {
        return (0, crypto_1.createHash)('ripemd160').update(buffer).digest();
    }
}
function sha1(buffer) {
    return (0, crypto_1.createHash)('sha1').update(buffer).digest();
}
function sha256(buffer) {
    return (0, crypto_1.createHash)('sha256').update(buffer).digest();
}
function blake256(buffer) {
    return (0, blake_hash_1.default)('blake256').update(buffer).digest();
}
function hash160(buffer) {
    return ripemd160(sha256(buffer));
}
function hash160blake256(buffer) {
    return ripemd160(blake256(buffer));
}
function hash256(buffer) {
    return sha256(sha256(buffer));
}
function hmacSHA512(key, data) {
    return (0, create_hmac_1.default)('sha512', key).update(data).digest();
}
//# sourceMappingURL=crypto.js.map