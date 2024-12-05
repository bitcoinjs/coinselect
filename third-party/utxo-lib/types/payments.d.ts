import type { Network } from '../networks';
export type PaymentName = 'p2pk' | 'p2pkh' | 'p2sh' | 'p2tr' | 'p2wpkh' | 'p2wsh' | 'p2ms' | 'embed' | 'sstxchange' | 'sstxcommitment' | 'sstxpkh' | 'sstxsh';
export interface Payment {
    name?: PaymentName;
    network?: Network;
    output?: Buffer;
    data?: Buffer[];
    m?: number;
    n?: number;
    pubkeys?: Buffer[];
    input?: Buffer;
    signatures?: Buffer[];
    pubkey?: Buffer;
    signature?: Buffer;
    address?: string;
    hash?: Buffer;
    redeem?: Payment;
    witness?: Buffer[];
    amount?: string;
}
export declare type PaymentCreator = (a: Payment, opts?: PaymentOpts) => Payment;
export declare type PaymentFunction = () => Payment;
export interface PaymentOpts {
    validate?: boolean;
    allowIncomplete?: boolean;
}
export type StackElement = Buffer | number;
export type Stack = StackElement[];
export type StackFunction = () => Stack;
//# sourceMappingURL=payments.d.ts.map