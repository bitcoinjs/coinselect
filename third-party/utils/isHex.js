"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = void 0;
const isHex = (str) => {
    const regExp = /^(0x|0X)?[0-9A-Fa-f]+$/g;
    return regExp.test(str);
};
exports.isHex = isHex;
//# sourceMappingURL=isHex.js.map