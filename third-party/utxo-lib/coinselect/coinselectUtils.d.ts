import BN from 'bn.js';
import { CoinSelectPaymentType, CoinSelectAlgorithm, CoinSelectOptions, CoinSelectInput, CoinSelectOutput, CoinSelectOutputFinal } from '../types';
import { Network } from '../networks';
export declare const ZERO: BN;
export declare const INPUT_SCRIPT_LENGTH: Record<CoinSelectPaymentType, number>;
export declare const OUTPUT_SCRIPT_LENGTH: Record<CoinSelectPaymentType, number>;
type Vin = {
    type: CoinSelectInput['type'];
    script: {
        length: number;
    };
    weight?: number;
};
type VinVout = {
    script: {
        length: number;
    };
    weight?: number;
};
export declare function getVarIntSize(length: number): 5 | 1 | 3 | 9;
export declare function inputWeight(input: Vin): number;
export declare function inputBytes(input: Vin): number;
export declare function outputWeight(output: VinVout): number;
export declare function outputBytes(output: VinVout): number;
export declare function getFeeForBytes(feeRate: number, bytes: number): number;
export declare function transactionWeight(inputs: Vin[], outputs: VinVout[]): number;
export declare function transactionBytes(inputs: Vin[], outputs: VinVout[]): number;
export declare function getDustAmount(feeRate: number, { txType, longTermFeeRate, dustThreshold, }: Pick<CoinSelectOptions, 'txType' | 'longTermFeeRate' | 'dustThreshold'>): number;
export declare function bignumberOrNaN(v?: BN | string): BN | undefined;
export declare function bignumberOrNaN<F extends boolean>(v?: BN | string, forgiving?: F): F extends true ? BN : BN | undefined;
export declare function sumOrNaN(range: {
    value?: BN;
}[]): BN | undefined;
export declare function sumOrNaN<F extends boolean>(range: {
    value?: BN;
}[], forgiving: F): F extends true ? BN : BN | undefined;
export declare function getFeePolicy(network?: Network): "bitcoin" | "doge" | "zcash";
export declare function getFee(inputs: CoinSelectInput[], outputs: CoinSelectOutput[], feeRate: number, { feePolicy, ...options }?: Partial<CoinSelectOptions>): number;
export declare function finalize(inputs: CoinSelectInput[], outputs: CoinSelectOutput[], feeRate: number, options: CoinSelectOptions): {
    fee: number;
    inputs?: undefined;
    outputs?: undefined;
} | {
    inputs: CoinSelectInput[];
    outputs: CoinSelectOutputFinal[];
    fee: number;
};
export declare function anyOf(algorithms: CoinSelectAlgorithm[]): CoinSelectAlgorithm;
export declare function utxoScore(x: CoinSelectInput, feeRate: number): BN;
export declare function sortByScore(feeRate: number): (a: CoinSelectInput, b: CoinSelectInput) => number;
export declare function filterCoinbase(utxos: CoinSelectInput[], minConfCoinbase: number): CoinSelectInput[];
export {};
//# sourceMappingURL=coinselectUtils.d.ts.map