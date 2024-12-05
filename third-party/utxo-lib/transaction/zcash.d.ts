import { TransactionBase, TransactionOptions } from './base';
export interface ZcashCompressedG {
    x: Buffer;
    yLsb: number;
}
export interface ZcashSaplingZKProof {
    type: 'sapling';
    sA: Buffer;
    sB: Buffer;
    sC: Buffer;
}
export interface ZcashJoinSplitZKProof {
    type: 'joinsplit';
    gA: ZcashCompressedG;
    gAPrime: ZcashCompressedG;
    gB: ZcashCompressedG;
    gBPrime: ZcashCompressedG;
    gC: ZcashCompressedG;
    gCPrime: ZcashCompressedG;
    gK: ZcashCompressedG;
    gH: ZcashCompressedG;
}
export interface ZcashJoinSplits {
    vpubOld: number;
    vpubNew: number;
    anchor: Buffer;
    nullifiers: Buffer[];
    commitments: Buffer[];
    ephemeralKey: Buffer;
    randomSeed: Buffer;
    macs: Buffer[];
    zkproof: ZcashSaplingZKProof | ZcashJoinSplitZKProof;
    ciphertexts: Buffer[];
}
export interface ZcashVShieldedSpend {
    cv: Buffer;
    anchor: Buffer;
    nullifier: Buffer;
    rk: Buffer;
    zkproof: ZcashSaplingZKProof;
    spendAuthSig: Buffer;
}
export interface ZcashVShieldedOutput {
    cv: Buffer;
    cmu: Buffer;
    ephemeralKey: Buffer;
    encCiphertext: Buffer;
    outCiphertext: Buffer;
    zkproof: ZcashSaplingZKProof;
}
export interface ZcashSpecific {
    type: 'zcash';
    joinsplits: ZcashJoinSplits[];
    joinsplitPubkey: Buffer;
    joinsplitSig: Buffer;
    overwintered: number;
    versionGroupId: number;
    valueBalance: number;
    vShieldedSpend: ZcashVShieldedSpend[];
    vShieldedOutput: ZcashVShieldedOutput[];
    bindingSig: Buffer;
    consensusBranchId: number;
}
export declare function fromConstructor(options: TransactionOptions): TransactionBase<ZcashSpecific>;
export declare function fromBuffer(buffer: Buffer, options: TransactionOptions): TransactionBase<ZcashSpecific>;
//# sourceMappingURL=zcash.d.ts.map