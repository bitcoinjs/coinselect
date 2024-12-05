import * as scriptNumber from './scriptNumber';
import * as scriptSignature from './scriptSignature';
import * as types from '../types';
import { Stack } from '../types';
export declare function isPushOnly(value: Stack): boolean;
export declare function compile(chunks: Buffer | Stack): Buffer;
export declare function decompile(buffer: Buffer | Stack): types.Stack;
export declare function toASM(chunks: Buffer | Stack): string;
export declare function fromASM(asm: string): Buffer;
export declare function toStack(chunks0: Buffer | Stack): Buffer[];
export declare function isCanonicalPubKey(buffer: Buffer): any;
export declare function isDefinedHashType(hashType: number): boolean;
export declare function isCanonicalScriptSignature(buffer: Buffer): boolean;
export declare const number: typeof scriptNumber;
export declare const signature: typeof scriptSignature;
export { OPS } from './ops';
//# sourceMappingURL=index.d.ts.map