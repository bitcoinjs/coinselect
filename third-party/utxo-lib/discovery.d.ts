import { deriveAddresses } from './derivation';
import type { Network } from './networks';
export type AddressInfo = ReturnType<typeof deriveAddresses>[number];
export type AddressResult<T> = T & {
    empty: boolean;
};
export declare const countUnusedFromEnd: <T>(array: T[], isUnused: (t: T) => boolean, lookout: number) => number;
export declare const discovery: <T>(discover: (addr: AddressInfo) => Promise<AddressResult<T>>, xpub: string, type: "receive" | "change", network?: Network, lookout?: number) => Promise<AddressResult<T>[]>;
//# sourceMappingURL=discovery.d.ts.map