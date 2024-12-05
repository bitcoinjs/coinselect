"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discovery = exports.countUnusedFromEnd = void 0;
const tslib_1 = require("tslib");
const derivation_1 = require("./derivation");
const DISCOVERY_LOOKOUT = 20;
const countUnusedFromEnd = (array, isUnused, lookout) => {
    const boundary = array.length > lookout ? array.length - lookout : 0;
    for (let i = array.length; i > boundary; --i) {
        if (!isUnused(array[i - 1])) {
            return array.length - i;
        }
    }
    return array.length;
};
exports.countUnusedFromEnd = countUnusedFromEnd;
const discovery = (discover, xpub, type, network, lookout = DISCOVERY_LOOKOUT) => {
    const discoverRecursive = (from, prev) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const unused = (0, exports.countUnusedFromEnd)(prev, a => a.empty, lookout);
        if (unused >= lookout)
            return prev;
        const moreCount = lookout - unused;
        const addresses = (0, derivation_1.deriveAddresses)(xpub, type, from, moreCount, network);
        const more = yield Promise.all(addresses.map(discover));
        return discoverRecursive(from + moreCount, prev.concat(more));
    });
    return discoverRecursive(0, []);
};
exports.discovery = discovery;
//# sourceMappingURL=discovery.js.map