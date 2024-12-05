"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAscii = isAscii;
exports.getNonAsciiChars = getNonAsciiChars;
const nonAsciiPattern = /[^\x20-\x7E]/g;
function isAscii(value) {
    if (!value)
        return true;
    return !nonAsciiPattern.test(value);
}
function getNonAsciiChars(value) {
    if (!value)
        return null;
    return value.match(nonAsciiPattern);
}
//# sourceMappingURL=asciiUtils.js.map