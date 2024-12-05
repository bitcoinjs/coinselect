import typeforce from 'typeforce';
export declare function Satoshi(value: number): boolean;
export declare const Buffer256bit: (value: any) => value is Buffer;
export declare const Hash160bit: (value: any) => value is Buffer;
export declare const Hash256bit: (value: any) => value is Buffer;
export declare const Number: (value: any) => value is number, Array: (value: any) => value is any[], Boolean: (value: any) => value is boolean, String: (value: any) => value is string, Buffer: (value: any) => value is Buffer, Hex: (value: any) => value is string, maybe: (type: any) => boolean, tuple: (...args: any[]) => boolean, UInt8: (value: any) => value is number, UInt16: (value: any) => value is number, UInt32: (value: any) => value is number, Function: (value: any) => value is FunctionConstructor, BufferN: (length: number) => (value: any) => value is Buffer, Nil: (value: any) => boolean, anyOf: (...args: any[]) => (value: any) => boolean;
export { typeforce };
//# sourceMappingURL=typeforce.d.ts.map