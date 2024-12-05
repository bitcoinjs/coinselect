type TAllKeys<T> = T extends any ? keyof T : never;
type TIndexValue<T, K extends PropertyKey, D = never> = T extends any ? K extends keyof T ? T[K] : D : never;
type TPartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>> extends infer O ? {
    [P in keyof O]: O[P];
} : never;
type TFunction = (...a: any[]) => any;
type TPrimitives = string | number | boolean | bigint | symbol | Date | TFunction;
type TMerged<T> = [T] extends [Array<any>] ? {
    [K in keyof T]: TMerged<T[K]>;
} : [T] extends [TPrimitives] ? T : [T] extends [object] ? TPartialKeys<{
    [K in TAllKeys<T>]: TMerged<TIndexValue<T, K>>;
}, never> : T;
interface IObject {
    [key: string]: any;
}
export declare const mergeDeepObject: {
    <T extends IObject[]>(...objects: T): TMerged<T[number]>;
    options: IOptions;
    withOptions<T extends IObject[]>(options: Partial<IOptions>, ...objects: T): TMerged<T[number]>;
};
interface IOptions {
    mergeArrays: boolean;
    dotNotation: boolean;
}
export {};
//# sourceMappingURL=mergeDeepObject.d.ts.map