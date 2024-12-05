import { EventEmitter } from 'events';
type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type IsUnion<T, U extends T = T> = T extends unknown ? ([U] extends [T] ? 0 : 1) : 2;
type EventReceiver<T> = IsUnion<T> extends 1 ? (event: T) => void : T extends (...args: any[]) => any ? T : T extends undefined ? () => void : (event: T) => void;
export interface TypedEmitter<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    once<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    addListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    prependListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    prependOnceListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    removeListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this;
    removeAllListeners<K extends EventKey<T>>(event?: K): this;
    emit<K extends EventKey<T>>(eventName: K, ...params: Parameters<EventReceiver<T[K]>>): boolean;
    listeners<K extends EventKey<T>>(eventName: K): EventReceiver<T[K]>[];
    rawListeners<K extends EventKey<T>>(eventName: K): EventReceiver<T[K]>[];
}
export declare class TypedEmitter<T extends EventMap> extends EventEmitter {
    listenerCount<K extends EventKey<T>>(eventName: K): number;
}
export {};
//# sourceMappingURL=typedEventEmitter.d.ts.map