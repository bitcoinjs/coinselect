export interface UTXO {
    txid: string | Buffer,
    vout: number,
    value: number,
    nonWitnessUtxo? : Buffer,
    witnessUtxo? : {
        script: Buffer,
        value: number
    }
    redeemScript?: Buffer,
    witnessScript?: Buffer,
    isTaproot?: boolean
}
export interface Target {
    address?: string,
    script?: Buffer,
    value?: number
}
export interface SelectedUTXO {
    inputs?: UTXO[],
    outputs?: Target[],
    fee: number
}
export default function coinSelect(utxos: UTXO[], outputs: Target[], feeRate: number): SelectedUTXO;
