"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionVbytes = exports.getTransactionVbytesFromAddresses = void 0;
const tslib_1 = require("tslib");
const BitcoinJsAddress = tslib_1.__importStar(require("./address"));
const coinselectUtils_1 = require("./coinselect/coinselectUtils");
const address_1 = require("./address");
const isKnownInputAddress = (type) => type in coinselectUtils_1.INPUT_SCRIPT_LENGTH;
const toVin = (network) => (address) => {
    const type = (0, address_1.getAddressType)(address, network);
    if (isKnownInputAddress(type)) {
        return {
            type,
            script: { length: coinselectUtils_1.INPUT_SCRIPT_LENGTH[type] },
        };
    }
    throw new Error(`Unknown input address '${address}'`);
};
const toVout = (network) => (address) => {
    var _a;
    let length;
    try {
        length = BitcoinJsAddress.toOutputScript(address, network).length;
    }
    catch (_b) {
        const msg = (_a = address.match(/^OP_RETURN (.*)$/)) === null || _a === void 0 ? void 0 : _a.pop();
        if (msg) {
            length = msg.match(/^\(.*\)$/)
                ? msg.length
                : 2 + msg.length / 2;
        }
        else {
            length = 0;
        }
    }
    return { script: { length } };
};
const getTransactionVbytesFromAddresses = (inputs, outputs, network) => {
    const ins = inputs.map(toVin(network));
    const outs = outputs.map(toVout(network));
    return (0, coinselectUtils_1.transactionBytes)(ins, outs);
};
exports.getTransactionVbytesFromAddresses = getTransactionVbytesFromAddresses;
const getTransactionVbytes = ({ vin, vout }, network) => {
    const ins = vin.map(({ addresses = [] }) => { var _a; return (_a = addresses[0]) !== null && _a !== void 0 ? _a : ''; });
    const outs = vout.map(({ addresses = [] }) => { var _a; return (_a = addresses[0]) !== null && _a !== void 0 ? _a : ''; });
    return (0, exports.getTransactionVbytesFromAddresses)(ins, outs, network);
};
exports.getTransactionVbytes = getTransactionVbytes;
//# sourceMappingURL=vsize.js.map