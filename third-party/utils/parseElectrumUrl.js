"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseElectrumUrl = void 0;
const ELECTRUM_URL_REGEX = /^(?:([a-zA-Z0-9.-]+)|\[([a-f0-9:]+)\]):([0-9]{1,5}):([ts])$/;
const parseElectrumUrl = (url) => {
    var _a;
    const match = url.match(ELECTRUM_URL_REGEX);
    if (!match)
        return undefined;
    return {
        host: (_a = match[1]) !== null && _a !== void 0 ? _a : match[2],
        port: Number.parseInt(match[3], 10),
        protocol: match[4],
    };
};
exports.parseElectrumUrl = parseElectrumUrl;
//# sourceMappingURL=parseElectrumUrl.js.map