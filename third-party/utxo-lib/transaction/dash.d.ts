import { TransactionBase, TransactionOptions } from './base';
export interface DashSpecific {
    type: 'dash';
    extraPayload?: Buffer;
}
export declare function fromConstructor(options: TransactionOptions): TransactionBase<DashSpecific>;
export declare function fromBuffer(buffer: Buffer, options: TransactionOptions): TransactionBase<DashSpecific>;
//# sourceMappingURL=dash.d.ts.map