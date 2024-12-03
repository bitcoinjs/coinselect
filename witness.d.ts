import { Network } from 'bitcoinjs-lib';

export interface UTXO {
    txId: string;
    vout: number;
    value: string | number;
    address?: string;
    path?: string;
    [key: string]: any;
}

export interface Output {
    address: string;
    value: string | number;
    [key: string]: any;
}

export interface CoinSelectParams {
    utxos: UTXO[];
    outputs: Output[];
    feeRate: string | number;
    changeAddress: string;
    network: Network;
    dustThreshold: number;
}

export interface CoinSelectResult {
    fee: string;
    inputs: UTXO[];
    outputs: Output[];
    changeOutput?: Output;
}

declare function coinSelect(params: CoinSelectParams): CoinSelectResult;

export = coinSelect;