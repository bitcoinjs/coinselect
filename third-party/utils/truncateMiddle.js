"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateMiddle = void 0;
const truncateMiddle = (text, startChars, endChars) => {
    if (text.length <= startChars + endChars)
        return text;
    const start = text.substring(0, startChars);
    const end = text.substring(text.length - endChars, text.length);
    return `${start}…${end}`;
};
exports.truncateMiddle = truncateMiddle;
//# sourceMappingURL=truncateMiddle.js.map