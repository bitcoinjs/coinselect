"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveAddresses = exports.getXpubOrDescriptorInfo = void 0;
const tslib_1 = require("tslib");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const utils_1 = require("../utils");
const payments_1 = require("./payments");
const bip32_1 = require("./bip32");
const networks_1 = require("./networks");
const BIP32_PAYMENT_TYPES = {
    0x0488b21e: 'p2pkh',
    0x049d7cb2: 'p2sh',
    0x04b24746: 'p2wpkh',
    0x043587cf: 'p2pkh',
    0x044a5262: 'p2sh',
    0x045f1cf6: 'p2wpkh',
    0x019da462: 'p2pkh',
    0x01b26ef6: 'p2sh',
};
const BIP32_COIN_TYPES = {
    0x0488b21e: "0'",
    0x049d7cb2: "0'",
    0x04b24746: "0'",
    0x043587cf: "1'",
    0x044a5262: "1'",
    0x045f1cf6: "1'",
    0x019da462: "2'",
    0x01b26ef6: "2'",
};
const BIP32_PURPOSES = {
    p2pkh: "44'",
    p2sh: "49'",
    p2wpkh: "84'",
    p2tr: "86'",
};
const validateVersion = (version) => !!BIP32_PAYMENT_TYPES[version];
const getVersion = (xpub) => {
    const version = Buffer.from(bs58_1.default.decode(xpub)).readUInt32BE();
    if (!validateVersion(version))
        throw new Error(`Unknown xpub version: ${xpub}`);
    return version;
};
const getPubkeyToPayment = (type, network) => (pubkey) => {
    switch (type) {
        case 'p2pkh':
            return (0, payments_1.p2pkh)({ pubkey, network });
        case 'p2sh':
            return (0, payments_1.p2sh)({
                redeem: (0, payments_1.p2wpkh)({
                    pubkey,
                    network,
                }),
                network,
            });
        case 'p2wpkh':
            return (0, payments_1.p2wpkh)({ pubkey, network });
        case 'p2tr':
            return (0, payments_1.p2tr)({ pubkey, network });
        default:
            throw new Error(`Unknown payment type '${type}'`);
    }
};
const getBip32Node = (xpub, version, network) => (0, bip32_1.fromBase58)(xpub, Object.assign(Object.assign({}, network), { bip32: Object.assign(Object.assign({}, network.bip32), { public: version }) }));
const getXpubInfo = (xpub, network) => {
    const version = getVersion(xpub);
    const paymentType = BIP32_PAYMENT_TYPES[version];
    const coinType = network.wif === 0xb0
        ? "2'"
        : BIP32_COIN_TYPES[version];
    const purpose = BIP32_PURPOSES[paymentType];
    const node = getBip32Node(xpub, version, network);
    const account = `${(node.index << 1) >>> 1}'`;
    const levels = [purpose, coinType, account];
    return {
        levels,
        paymentType,
        node,
    };
};
const getDescriptorInfo = (paymentType, descriptor, network) => {
    const [_match, _script, path, xpub, _checksum] = descriptor.match(/^([a-z]+\()+\[([a-z0-9]{8}(?:\/[0-9]+'?){3,})\]([xyztuv]pub[a-zA-Z0-9]*)\/<0;1>\/\*\)+(#[a-z0-9]{8})?$/) || (0, utils_1.throwError)(`Descriptor cannot be parsed: ${descriptor}`);
    const [_fingerprint, ...levels] = path.split('/');
    const version = getVersion(xpub);
    const node = getBip32Node(xpub, version, network);
    return {
        levels,
        paymentType,
        node,
    };
};
const getXpubOrDescriptorInfo = (descriptor, network = networks_1.bitcoin) => {
    if (descriptor.startsWith('pkh(')) {
        return getDescriptorInfo('p2pkh', descriptor, network);
    }
    if (descriptor.startsWith('sh(wpkh(')) {
        return getDescriptorInfo('p2sh', descriptor, network);
    }
    if (descriptor.startsWith('wpkh(')) {
        return getDescriptorInfo('p2wpkh', descriptor, network);
    }
    if (descriptor.startsWith('tr(')) {
        return getDescriptorInfo('p2tr', descriptor, network);
    }
    return getXpubInfo(descriptor, network);
};
exports.getXpubOrDescriptorInfo = getXpubOrDescriptorInfo;
const deriveAddresses = (descriptor, type, from, count, network = networks_1.bitcoin) => {
    const { levels, node, paymentType } = (0, exports.getXpubOrDescriptorInfo)(descriptor, network);
    const getAddress = getPubkeyToPayment(paymentType, network);
    const change = type === 'receive' ? 0 : 1;
    const changeNode = node.derive(change);
    return Array.from(Array(count).keys())
        .map(i => changeNode.derive(from + i).publicKey)
        .map(a => getAddress(a).address || (0, utils_1.throwError)('Cannot convert pubkey to address'))
        .map((address, i) => ({
        address,
        path: `m/${levels.join('/')}/${change}/${from + i}`,
    }));
};
exports.deriveAddresses = deriveAddresses;
//# sourceMappingURL=derivation.js.map