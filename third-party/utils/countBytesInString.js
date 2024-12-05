"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countBytesInString = void 0;
const countBytesInString = (input) => encodeURI(input).split(/%..|./).length - 1;
exports.countBytesInString = countBytesInString;
//# sourceMappingURL=countBytesInString.js.map