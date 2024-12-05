import { TransactionBase, TransactionOptions } from './base';
import * as dash from './dash';
import * as zcash from './zcash';
export type TxOptions = TransactionOptions & {
    txSpecific?: dash.DashSpecific | zcash.ZcashSpecific;
};
declare class Transaction extends TransactionBase<dash.DashSpecific | zcash.ZcashSpecific> {
    constructor(options?: TxOptions);
    static isCoinbaseHash(buffer: Buffer): boolean;
    static fromBuffer(buffer: Buffer, options?: TransactionOptions): TransactionBase<undefined> | TransactionBase<dash.DashSpecific> | TransactionBase<zcash.ZcashSpecific>;
    static fromHex(hex: string, options?: TransactionOptions): TransactionBase<undefined> | TransactionBase<dash.DashSpecific> | TransactionBase<zcash.ZcashSpecific>;
}
export type { TransactionOptions } from './base';
export { Transaction };
//# sourceMappingURL=index.d.ts.map