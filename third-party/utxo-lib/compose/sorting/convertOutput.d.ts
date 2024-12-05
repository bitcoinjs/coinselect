import { CoinSelectOutputFinal, ComposeChangeAddress, ComposeFinalOutput } from '../../types';
export declare const convertOutput: (selectedOutput: CoinSelectOutputFinal, composeOutput: ComposeFinalOutput | ({
    type: "change";
} & ComposeChangeAddress)) => import("../../types").ComposeOutputOpreturn | {
    amount: string;
    type: "change";
    address: string;
} | {
    type: "payment";
    amount: string;
    address: string;
};
//# sourceMappingURL=convertOutput.d.ts.map