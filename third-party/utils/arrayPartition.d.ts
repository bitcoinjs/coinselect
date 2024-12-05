type ArrayPartition = {
    <T, S extends T>(array: T[], condition: (elem: T) => elem is S): [S[], Exclude<T, S>[]];
    <T>(array: T[], condition: (elem: T) => boolean): [T[], T[]];
};
export declare const arrayPartition: ArrayPartition;
export {};
//# sourceMappingURL=arrayPartition.d.ts.map