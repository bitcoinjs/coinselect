import { Network } from './networks';
export interface Base58CheckResult {
    hash: Buffer;
    version: number;
}
export interface Bech32Result {
    version: number;
    prefix: string;
    data: Buffer;
}
export declare function fromBase58Check(address: string, network?: Network): Base58CheckResult;
export declare function fromBech32(address: string): Bech32Result;
export declare function toBech32(data: Buffer, version: number, prefix: string): string;
export declare function fromOutputScript(output: Buffer, network?: Network): string;
export declare function getAddressType(address: string, network?: Network): "p2pkh" | "p2sh" | "p2tr" | "p2wpkh" | "p2wsh" | "p2w-unknown" | "unknown";
export declare function toOutputScript(address: string, network?: Network): Buffer;
//# sourceMappingURL=address.d.ts.map