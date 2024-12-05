export declare function decodeBlake(buffer: Buffer): Buffer;
export declare function decodeBlake256Key(key: string): Buffer;
export declare function decodeBlake256(address: string): Buffer;
export declare function encodeBlake256(payload: Buffer): string;
export declare function encode(payload: Buffer, network?: import("./networks").Network): string;
export declare function decode(payload: string, network?: import("./networks").Network): Buffer | Uint8Array;
export declare function decodeAddress(address: string, network?: import("./networks").Network): {
    version: number;
    hash: Buffer;
};
export declare function encodeAddress(hash: Buffer, version: number, network?: import("./networks").Network): string;
//# sourceMappingURL=bs58check.d.ts.map