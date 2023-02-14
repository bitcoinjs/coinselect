export interface UTXO {
    txid: string,
    vout: number,
    value: number,
    nonWitnessUtxo? : Buffer,
    witnessUtxo? : {
        script: Buffer,
        value: number
    }
}
export interface Target {
    address: string,
    value: number
}
export interface SelectedUTXO {
    inputs: UTXO[],
    outputs: Target[],
    fee: number
}
export default function coinSelect(utxos: UTXO[], outputs: Target[], feeRate: number): SelectedUTXO;
