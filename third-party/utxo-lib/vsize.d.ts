import type { Network } from './networks';
export declare const getTransactionVbytesFromAddresses: (inputs: string[], outputs: string[], network: Network) => number;
type GetTransactionVbytesParam = {
    vin: {
        addresses?: string[];
    }[];
    vout: {
        addresses?: string[];
    }[];
};
export declare const getTransactionVbytes: ({ vin, vout }: GetTransactionVbytesParam, network: Network) => number;
export {};
//# sourceMappingURL=vsize.d.ts.map