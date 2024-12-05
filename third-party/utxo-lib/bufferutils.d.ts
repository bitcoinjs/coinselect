import * as varuint from 'varuint-bitcoin';
export declare function verifuint(value: number, max: number): void;
export declare function readUInt64LE(buffer: Buffer, offset: number): number;
export declare function readUInt64LEasString(buffer: Buffer, offset: number): string;
export declare function readInt64LE(buffer: Buffer, offset: number): number;
export declare function writeUInt64LE(buffer: Buffer, value: number, offset: number): number;
export declare function writeUInt64LEasString(buffer: Buffer, value: string | number, offset: number): number;
export declare function writeInt64LE(buffer: Buffer, value: number, offset: number): number;
export declare function readVarInt(buffer: Buffer, offset: number): {
    number: number;
    size: number;
};
export declare function writeVarInt(buffer: Buffer, number: number, offset: number): number;
export declare function cloneBuffer(buffer: Buffer): Buffer;
type PushDataSize = (len: number) => number;
type ReadPushDataInt = (buffer: Buffer, offset: number) => {
    opcode: number;
    number: number;
    size: number;
};
type WritePushDataInt = (buffer: Buffer, number: number, offset: number) => number;
export declare const pushDataSize: PushDataSize;
export declare const readPushDataInt: ReadPushDataInt;
export declare const varIntSize: typeof varuint.encodingLength;
export declare const writePushDataInt: WritePushDataInt;
export declare const reverseBuffer: (src: Buffer) => Buffer, getChunkSize: (n: number) => Buffer;
export declare class BufferWriter {
    buffer: Buffer;
    offset: number;
    constructor(buffer: Buffer, offset?: number);
    writeUInt8(i: number): void;
    writeUInt16(i: number): void;
    writeInt32(i: number): void;
    writeUInt32(i: number): void;
    writeInt64(i: number): void;
    writeUInt64(i: number | string): void;
    writeVarInt(i: number): void;
    writeSlice(slice: Buffer): void;
    writeVarSlice(slice: Buffer): void;
    writeVector(vector: Buffer[]): void;
}
export declare class BufferReader {
    buffer: Buffer;
    offset: number;
    constructor(buffer: Buffer, offset?: number);
    readUInt8(): number;
    readUInt16(): number;
    readInt32(): number;
    readUInt32(): number;
    readInt64(): number;
    readUInt64(): number;
    readUInt64String(): string;
    readVarInt(): number;
    readSlice(n: number): Buffer;
    readVarSlice(): Buffer;
    readVector(): Buffer[];
}
export {};
//# sourceMappingURL=bufferutils.d.ts.map