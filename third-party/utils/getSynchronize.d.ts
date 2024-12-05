import { getMutex } from './getMutex';
export declare const getSynchronize: (mutex?: ReturnType<typeof getMutex>) => <T>(action: () => T, lockId?: keyof any) => T extends Promise<unknown> ? T : Promise<T>;
export type Synchronize = ReturnType<typeof getSynchronize>;
//# sourceMappingURL=getSynchronize.d.ts.map