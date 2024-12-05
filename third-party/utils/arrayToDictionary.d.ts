type DictionaryKey = string | number;
type GetKey<T> = (item: T) => unknown;
type Key<Fn extends GetKey<any>, R = ReturnType<Fn>> = R extends DictionaryKey ? R : never;
type ArrayToDictionary = {
    <T, Fn extends GetKey<T>>(array: T[], getKey: Fn, multiple?: false): Record<Key<Fn>, T>;
    <T, Fn extends GetKey<T>>(array: T[], getKey: Fn, multiple: true): Record<Key<Fn>, T[]>;
};
export declare const arrayToDictionary: ArrayToDictionary;
export {};
//# sourceMappingURL=arrayToDictionary.d.ts.map