type DeferredManagerOptions = {
    timeout?: number;
    onTimeout?: (promiseId: number) => void;
    initialId?: number;
};
export type DeferredManager<T> = {
    length: () => number;
    nextId: () => number;
    create: (timeout?: number) => {
        promiseId: number;
        promise: Promise<T>;
    };
    resolve: (promiseId: number, value: T) => boolean;
    reject: (promiseId: number, error: Error) => boolean;
    rejectAll: (error: Error) => void;
};
export declare const createDeferredManager: <T = any>(options?: DeferredManagerOptions) => DeferredManager<T>;
export {};
//# sourceMappingURL=createDeferredManager.d.ts.map