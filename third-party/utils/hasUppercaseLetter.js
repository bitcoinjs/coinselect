"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUppercaseLetter = void 0;
const HAS_UPPERCASE_LATER_REGEXP = new RegExp('^(.*[A-Z].*)$');
const hasUppercaseLetter = (value) => HAS_UPPERCASE_LATER_REGEXP.test(value);
exports.hasUppercaseLetter = hasUppercaseLetter;
//# sourceMappingURL=hasUppercaseLetter.js.map