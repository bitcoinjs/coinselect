"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHostname = void 0;
const HOSTNAME_REGEX = /^([a-z0-9.+-]+:\/\/)?([a-z0-9.-]+)([:/][^:/]+)*\/?$/i;
const parseHostname = (url) => { var _a, _b; return (_b = (_a = url.match(HOSTNAME_REGEX)) === null || _a === void 0 ? void 0 : _a[2]) === null || _b === void 0 ? void 0 : _b.toLowerCase(); };
exports.parseHostname = parseHostname;
//# sourceMappingURL=parseHostname.js.map