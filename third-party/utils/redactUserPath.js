"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactUserPathFromString = exports.startOfUserPathRegex = void 0;
exports.startOfUserPathRegex = /([/\\][Uu]sers[/\\]{1,4})([^"^'^[^\]^/^\\]*)/g;
const redactUserPathFromString = (text) => text.replace(exports.startOfUserPathRegex, '$1[*]');
exports.redactUserPathFromString = redactUserPathFromString;
//# sourceMappingURL=redactUserPath.js.map