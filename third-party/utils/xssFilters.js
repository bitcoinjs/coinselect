"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inDoubleQuotes = exports.inSingleQuotes = exports.inHTML = void 0;
const LT = /</g;
const SQUOT = /'/g;
const QUOT = /"/g;
const inHTML = (value) => value.replace(LT, '&lt;');
exports.inHTML = inHTML;
const inSingleQuotes = (value) => value.replace(SQUOT, '&#39;');
exports.inSingleQuotes = inSingleQuotes;
const inDoubleQuotes = (value) => value.replace(QUOT, '&quot;');
exports.inDoubleQuotes = inDoubleQuotes;
//# sourceMappingURL=xssFilters.js.map