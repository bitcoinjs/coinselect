import type { Network } from '../networks';
import type { CoinSelectPaymentType } from './coinselect';
export interface ComposeInput {
    vout: number;
    txid: string;
    amount: string;
    coinbase: boolean;
    own: boolean;
    confirmations: number;
    required?: boolean;
}
export interface ComposeOutputPayment {
    type: 'payment';
    address: string;
    amount: string;
}
export interface ComposeOutputPaymentNoAddress {
    type: 'payment-noaddress';
    amount: string;
}
export interface ComposeOutputSendMax {
    type: 'send-max';
    address: string;
    amount?: typeof undefined;
}
export interface ComposeOutputSendMaxNoAddress {
    type: 'send-max-noaddress';
    amount?: typeof undefined;
}
export interface ComposeOutputOpreturn {
    type: 'opreturn';
    dataHex: string;
    amount?: typeof undefined;
    address?: typeof undefined;
}
export interface ComposeOutputChange {
    type: 'change';
    amount: string;
}
export type ComposeFinalOutput = ComposeOutputPayment | ComposeOutputSendMax | ComposeOutputOpreturn;
export type ComposeNotFinalOutput = ComposeOutputPaymentNoAddress | ComposeOutputSendMaxNoAddress;
export type ComposeOutput = ComposeFinalOutput | ComposeNotFinalOutput;
export interface ComposeChangeAddress {
    address: string;
}
export type TransactionInputOutputSortingStrategy = 'bip69' | 'random' | 'none';
export type ComposeRequest<Input extends ComposeInput, Output extends ComposeOutput, Change extends ComposeChangeAddress> = {
    txType?: CoinSelectPaymentType;
    utxos: Input[];
    outputs: Output[];
    feeRate: string | number;
    longTermFeeRate?: string | number;
    network: Network;
    changeAddress: Change;
    dustThreshold: number;
    baseFee?: number;
    floorBaseFee?: boolean;
    skipUtxoSelection?: boolean;
    sortingStrategy: TransactionInputOutputSortingStrategy;
};
type ComposedTransactionOutputs<T> = T extends ComposeOutputSendMax ? Omit<T, 'type'> & ComposeOutputPayment : T extends ComposeFinalOutput ? T : never;
export interface ComposedTransaction<Input extends ComposeInput, Output extends ComposeOutput, Change extends ComposeChangeAddress> {
    inputs: Input[];
    outputs: (ComposedTransactionOutputs<Output> | (Change & ComposeOutputChange))[];
    outputsPermutation: number[];
}
export declare const COMPOSE_ERROR_TYPES: readonly ["MISSING-UTXOS", "MISSING-OUTPUTS", "INCORRECT-FEE-RATE", "NOT-ENOUGH-FUNDS"];
export type ComposeResultError = {
    type: 'error';
    error: (typeof COMPOSE_ERROR_TYPES)[number];
} | {
    type: 'error';
    error: 'INCORRECT-UTXO' | 'INCORRECT-OUTPUT' | 'COINSELECT';
    message: string;
};
export interface ComposeResultNonFinal<Input extends ComposeInput> {
    type: 'nonfinal';
    max?: string;
    totalSpent: string;
    fee: string;
    feePerByte: string;
    bytes: number;
    inputs: Input[];
}
export interface ComposeResultFinal<Input extends ComposeInput, Output extends ComposeOutput, Change extends ComposeChangeAddress> extends ComposedTransaction<Input, Output, Change> {
    type: 'final';
    max?: string;
    totalSpent: string;
    fee: string;
    feePerByte: string;
    bytes: number;
    inputs: Input[];
    outputs: (ComposedTransactionOutputs<Output> | (Change & ComposeOutputChange))[];
    outputsPermutation: number[];
}
export type ComposeResult<Input extends ComposeInput, Output extends ComposeOutput, Change extends ComposeChangeAddress> = ComposeResultError | ComposeResultNonFinal<Input> | ComposeResultFinal<Input, Output, Change>;
export {};
//# sourceMappingURL=compose.d.ts.map