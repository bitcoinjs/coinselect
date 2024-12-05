import type { Network } from './networks';
export interface BIP32Interface {
    chainCode: Buffer;
    network: Network;
    lowR: boolean;
    depth: number;
    index: number;
    parentFingerprint: number;
    publicKey: Buffer;
    privateKey?: Buffer;
    identifier: Buffer;
    fingerprint: Buffer;
    compressed: boolean;
    isNeutered(): boolean;
    neutered(): BIP32Interface;
    toBase58(): string;
    toWIF(): string;
    derive(index: number): BIP32Interface;
    deriveHardened(index: number): BIP32Interface;
    derivePath(path: string): BIP32Interface;
    sign(hash: Buffer, lowR?: boolean): Buffer;
    verify(hash: Buffer, signature: Buffer): boolean;
}
export declare function fromBase58(inString: string, network?: Network): BIP32Interface;
export declare function fromPrivateKey(privateKey: Buffer, chainCode: Buffer, network?: Network): BIP32Interface;
export declare function fromPublicKey(publicKey: Buffer, chainCode: Buffer, network?: Network): BIP32Interface;
export declare function fromSeed(seed: Buffer, network?: Network): BIP32Interface;
//# sourceMappingURL=bip32.d.ts.map