"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const tslib_1 = require("tslib");
const networks_1 = require("../networks");
const base_1 = require("./base");
const bitcoin = tslib_1.__importStar(require("./bitcoin"));
const dash = tslib_1.__importStar(require("./dash"));
const decred = tslib_1.__importStar(require("./decred"));
const peercoin = tslib_1.__importStar(require("./peercoin"));
const zcash = tslib_1.__importStar(require("./zcash"));
class Transaction extends base_1.TransactionBase {
    constructor(options = {}) {
        super(options);
        if ((0, networks_1.isNetworkType)('dash', this.network))
            return dash.fromConstructor(options);
        if ((0, networks_1.isNetworkType)('decred', this.network))
            return decred.fromConstructor(options);
        if ((0, networks_1.isNetworkType)('peercoin', this.network))
            return peercoin.fromConstructor(options);
        if ((0, networks_1.isNetworkType)('zcash', this.network))
            return zcash.fromConstructor(options);
        return bitcoin.fromConstructor(options);
    }
    static isCoinbaseHash(buffer) {
        return (0, base_1.isCoinbaseHash)(buffer);
    }
    static fromBuffer(buffer, options = {}) {
        if ((0, networks_1.isNetworkType)('dash', options.network))
            return dash.fromBuffer(buffer, options);
        if ((0, networks_1.isNetworkType)('decred', options.network))
            return decred.fromBuffer(buffer, options);
        if ((0, networks_1.isNetworkType)('peercoin', options.network))
            return peercoin.fromBuffer(buffer, options);
        if ((0, networks_1.isNetworkType)('zcash', options.network))
            return zcash.fromBuffer(buffer, options);
        return bitcoin.fromBuffer(buffer, options);
    }
    static fromHex(hex, options = {}) {
        return this.fromBuffer(Buffer.from(hex, 'hex'), Object.assign(Object.assign({}, options), { nostrict: false }));
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=index.js.map