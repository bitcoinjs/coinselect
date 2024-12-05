export interface Bip32 {
    public: number;
    private: number;
}
export interface Network {
    messagePrefix: string;
    bech32: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
    forkId?: number;
}
export declare const bitcoin: Network;
export declare const regtest: Network;
export declare const testnet: Network;
export declare const bitcoincash: Network;
export declare const bitcoincashTest: Network;
export declare const bitcoingold: Network;
export declare const litecoin: Network;
export declare const litecoinTest: Network;
export declare const dash: Network;
export declare const dashTest: Network;
export declare const zcash: Network;
export declare const zcashTest: Network;
export declare const peercoin: Network;
export declare const peercoinTest: Network;
export declare const komodo: Network;
export declare const decred: Network;
export declare const decredTest: Network;
export declare const decredSim: Network;
export declare const doge: Network;
declare const NETWORK_TYPES: {
    bitcoinCash: Network[];
    dash: Network[];
    decred: Network[];
    peercoin: Network[];
    zcash: Network[];
    litecoin: Network[];
    doge: Network[];
};
export type NetworkTypes = keyof typeof NETWORK_TYPES;
export declare function isNetworkType(type: NetworkTypes, network?: Network): boolean;
export {};
//# sourceMappingURL=networks.d.ts.map