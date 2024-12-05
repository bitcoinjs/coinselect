"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunkSize = exports.reverseBuffer = void 0;
const reverseBuffer = (src) => {
    if (src.length < 1)
        return src;
    const buffer = Buffer.alloc(src.length);
    let j = buffer.length - 1;
    for (let i = 0; i < buffer.length / 2; i++) {
        buffer[i] = src[j];
        buffer[j] = src[i];
        j--;
    }
    return buffer;
};
exports.reverseBuffer = reverseBuffer;
const getChunkSize = (n) => {
    const buf = Buffer.allocUnsafe(1);
    buf.writeUInt8(n);
    return buf;
};
exports.getChunkSize = getChunkSize;
//# sourceMappingURL=bufferUtils.js.map