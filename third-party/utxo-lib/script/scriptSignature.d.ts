export declare function toDER(x: Buffer): Buffer;
export declare function fromDER(x: Buffer): Buffer;
export declare function decode(buffer: Buffer): {
    signature: Buffer;
    hashType: number;
};
export declare function encode(signature: Buffer, hashType: number): Buffer;
//# sourceMappingURL=scriptSignature.d.ts.map