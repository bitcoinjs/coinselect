import { Network } from '../networks';
export declare function varSliceSize(someScript: Buffer): number;
export declare function vectorSize(someVector: Buffer[]): number;
export declare function isCoinbaseHash(buffer: Buffer): boolean;
export declare const EMPTY_SCRIPT: Buffer;
export interface TxOutput {
    script: Buffer;
    value: string;
    decredVersion?: number;
}
export interface TxInput {
    hash: Buffer;
    index: number;
    script: Buffer;
    sequence: number;
    witness: Buffer[];
    decredTree?: number;
    decredWitness?: {
        value: string;
        height: number;
        blockIndex: number;
        script: Buffer;
    };
}
export type TransactionOptions = {
    nostrict?: boolean;
    network?: Network;
};
export declare class TransactionBase<S = undefined> {
    version: number;
    locktime: number;
    ins: TxInput[];
    outs: TxOutput[];
    specific: S | undefined;
    network: Network;
    type: number | undefined;
    timestamp: number | undefined;
    expiry: number | undefined;
    constructor(options: TransactionOptions & {
        txSpecific?: S;
    });
    isCoinbase(): boolean;
    hasWitnesses(): boolean;
    isMwebPegOutTx(): boolean;
    weight(): number;
    virtualSize(): number;
    byteLength(_ALLOW_WITNESS?: boolean, _ALLOW_MWEB?: boolean): number;
    getHash(forWitness?: boolean, forMweb?: boolean): Buffer;
    getId(): string;
    getWitness(index: number): Buffer | undefined;
    getExtraData(): Buffer | void;
    getSpecificData(): S | void;
    toBuffer(_buffer?: Buffer, _initialOffset?: number, _ALLOW_WITNESS?: boolean, _ALLOW_MWEB?: boolean): Buffer;
    toHex(): string;
}
//# sourceMappingURL=base.d.ts.map