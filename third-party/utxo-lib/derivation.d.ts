import { Network } from './networks';
declare const BIP32_PAYMENT_TYPES: {
    readonly 76067358: "p2pkh";
    readonly 77429938: "p2sh";
    readonly 78792518: "p2wpkh";
    readonly 70617039: "p2pkh";
    readonly 71979618: "p2sh";
    readonly 73342198: "p2wpkh";
    readonly 27108450: "p2pkh";
    readonly 28471030: "p2sh";
};
type VersionBytes = keyof typeof BIP32_PAYMENT_TYPES;
export type PaymentType = (typeof BIP32_PAYMENT_TYPES)[VersionBytes] | 'p2tr';
export declare const getXpubOrDescriptorInfo: (descriptor: string, network?: Network) => {
    levels: string[];
    paymentType: PaymentType;
    node: import("./bip32").BIP32Interface;
};
export declare const deriveAddresses: (descriptor: string, type: "receive" | "change", from: number, count: number, network?: Network) => {
    address: string;
    path: string;
}[];
export {};
//# sourceMappingURL=derivation.d.ts.map