"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doge = exports.decredSim = exports.decredTest = exports.decred = exports.komodo = exports.peercoinTest = exports.peercoin = exports.zcashTest = exports.zcash = exports.dashTest = exports.dash = exports.litecoinTest = exports.litecoin = exports.bitcoingold = exports.bitcoincashTest = exports.bitcoincash = exports.testnet = exports.regtest = exports.bitcoin = void 0;
exports.isNetworkType = isNetworkType;
const typeforce_1 = require("./types/typeforce");
exports.bitcoin = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
};
exports.regtest = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bcrt',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
};
exports.testnet = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
};
exports.bitcoincash = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    forkId: 0x00,
};
exports.bitcoincashTest = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    forkId: 0x00,
};
exports.bitcoingold = {
    messagePrefix: '\x18Bitcoin Gold Signed Message:\n',
    bech32: 'btg',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x17,
    wif: 0x80,
    forkId: 0x4f,
};
exports.litecoin = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};
exports.litecoinTest = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'tltc',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0x3a,
    wif: 0xb0,
};
exports.dash = {
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x02fe52cc,
        private: 0x2fe52f8,
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
};
exports.dashTest = {
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x8c,
    scriptHash: 0x13,
    wif: 0xef,
};
exports.zcash = {
    messagePrefix: '\x18ZCash Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
};
exports.zcashTest = {
    messagePrefix: '\x18ZCash Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x1d25,
    scriptHash: 0x1cba,
    wif: 0xef,
};
exports.peercoin = {
    messagePrefix: '\x18Peercoin Signed Message:\n',
    bech32: 'pc',
    bip32: {
        public: 0x488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x37,
    scriptHash: 0x75,
    wif: 0,
};
exports.peercoinTest = {
    messagePrefix: '\x18Peercoin Signed Message:\n',
    bech32: 'tpc',
    bip32: {
        public: 0x43587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0,
};
exports.komodo = {
    messagePrefix: '\x18Komodo Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x55,
    wif: 0xbc,
};
exports.decred = {
    messagePrefix: '\x17Decred Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x02fda926,
        private: 0x02fda4e8,
    },
    pubKeyHash: 0x073f,
    scriptHash: 0x071a,
    wif: 0x22de,
};
exports.decredTest = {
    messagePrefix: '\x17Decred Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x043587d1,
        private: 0x04358397,
    },
    pubKeyHash: 0x0f21,
    scriptHash: 0x0efc,
    wif: 0x230e,
};
exports.decredSim = {
    messagePrefix: '\x17Decred Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x0420bd3d,
        private: 0x0420b903,
    },
    pubKeyHash: 0x0e91,
    scriptHash: 0x0e6c,
    wif: 0x2307,
};
exports.doge = {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bech32: '',
    bip32: {
        public: 0x02facafd,
        private: 0x02fac398,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
};
const NETWORK_TYPES = {
    bitcoinCash: [exports.bitcoincash, exports.bitcoincashTest],
    dash: [exports.dash, exports.dashTest],
    decred: [exports.decred, exports.decredTest, exports.decredSim],
    peercoin: [exports.peercoin, exports.peercoinTest],
    zcash: [exports.zcash, exports.zcashTest, exports.komodo],
    litecoin: [exports.litecoin, exports.litecoinTest],
    doge: [exports.doge],
};
function isNetworkType(type, network) {
    if (typeof type !== 'string' || !network || !NETWORK_TYPES[type])
        return false;
    try {
        (0, typeforce_1.typeforce)({
            bip32: {
                public: typeforce_1.typeforce.UInt32,
                private: typeforce_1.typeforce.UInt32,
            },
            pubKeyHash: typeforce_1.typeforce.anyOf(typeforce_1.typeforce.UInt8, typeforce_1.typeforce.UInt16),
            scriptHash: typeforce_1.typeforce.anyOf(typeforce_1.typeforce.UInt8, typeforce_1.typeforce.UInt16),
        }, network);
    }
    catch (_a) {
        return false;
    }
    return !!NETWORK_TYPES[type].find(n => n.bip32.public === network.bip32.public &&
        n.bip32.private === network.bip32.private &&
        ((!n.bech32 && !network.bech32) || n.bech32 === network.bech32) &&
        ((!n.forkId && !network.forkId) || n.forkId === network.forkId) &&
        n.pubKeyHash === network.pubKeyHash &&
        n.scriptHash === network.scriptHash);
}
//# sourceMappingURL=networks.js.map