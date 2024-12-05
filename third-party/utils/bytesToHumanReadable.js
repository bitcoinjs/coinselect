"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToHumanReadable = void 0;
const units = ['B', 'KB', 'MB', 'GB', 'TB'];
const bytesToHumanReadable = (bytes) => {
    let size = Math.abs(bytes);
    let i = 0;
    while (size >= 1024 || i >= units.length) {
        size /= 1024;
        i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
};
exports.bytesToHumanReadable = bytesToHumanReadable;
//# sourceMappingURL=bytesToHumanReadable.js.map