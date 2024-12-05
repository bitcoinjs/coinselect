export interface Deferred<Resolve = void, Arg = string | number | undefined> {
    id: Arg;
    promise: Promise<Resolve>;
    resolve: (t: Resolve) => void;
    reject: (e: Error) => void;
}
export type DeferredResponse<D> = D extends Deferred<infer R> ? R : never;
interface CreateDeferred {
    <Resolve = void, Arg = undefined>(id?: Arg): Deferred<Resolve, Arg>;
    <Resolve = void, Arg = string | number>(id: Arg): Deferred<Resolve, Arg>;
}
export declare const createDeferred: CreateDeferred;
export {};
//# sourceMappingURL=createDeferred.d.ts.map