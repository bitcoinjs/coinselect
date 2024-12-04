export type IPaymentType = 'p2pkh' | 'p2sh' | 'p2tr' | 'p2wpkh' | 'p2wsh';
export interface IUtxo {
    vout: number;
    txid: string;
    amount: string;
    coinbase: boolean;
    own: boolean;
    confirmations: number;
}

export interface IOutputPayment {
    type: 'payment';
    address: string;
    amount: string;
}

export interface IOutputSendMax {
    type: 'send-max'; // only one in TX request
    address: string;
    amount?: typeof undefined;
}

export interface IOutputOpreturn {
    type: 'opreturn';
    dataHex: string;
    amount?: typeof undefined;
    address?: typeof undefined;
}
export interface IOutputChange {
    type: 'change';
    amount: string;
}

export type IFinalOutput =
    | ComposeOutputPayment
    | ComposeOutputSendMax
    | ComposeOutputOpreturn;

export interface IChangeAddress {
    address: string;
    path: string;
}

export interface ICoinSelectParams {
    utxos: IUtxo[];
    outputs: IFinalOutput[];
    feeRate: string | number;
    changeAddress: IChangeAddress;
    network: any;
    txType: IPaymentType
    baseFee?: number;
    dustThreshold?: number;
}

export interface ICoinSelectResult {
    type: 'final';
    max?: string;
    totalSpent: string;
    fee: string;
    feePerByte: string;
    bytes: number;
    inputs: IUtxo[];
    outputs: (IFinalOutput | IOutputChange)[];
    outputsPermutation: number[];
}

declare function coinSelect(params: ICoinSelectParams): ICoinSelectResult;

export = coinSelect;