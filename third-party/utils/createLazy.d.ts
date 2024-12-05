export declare const createLazy: <T, TArgs extends Array<any>>(initLazy: (...args: TArgs) => Promise<T>, disposeLazy?: (t: T) => void) => {
    get: () => T | undefined;
    getPending: () => Promise<T> | undefined;
    getOrInit: (...args: TArgs) => Promise<T>;
    dispose: () => void;
};
//# sourceMappingURL=createLazy.d.ts.map