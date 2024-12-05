"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlToOnion = void 0;
const urlToOnion = (url, onionDomains) => {
    var _a;
    const [, protocol, subdomain, domain, rest] = (_a = url.match(/^(http|ws)s?:\/\/([^:/]+\.)?([^/.]+\.[^/.]+)(\/.*)?$/i)) !== null && _a !== void 0 ? _a : [];
    if (!domain || !onionDomains[domain])
        return;
    return `${protocol}://${subdomain !== null && subdomain !== void 0 ? subdomain : ''}${onionDomains[domain]}${rest !== null && rest !== void 0 ? rest : ''}`;
};
exports.urlToOnion = urlToOnion;
//# sourceMappingURL=urlToOnion.js.map