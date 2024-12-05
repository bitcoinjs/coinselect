export type LogMessage = {
    level: string;
    prefix: string;
    message: any[];
    timestamp: number;
};
export type LogWriter = {
    add: (message: LogMessage) => void;
};
export declare class Log {
    prefix: string;
    enabled: boolean;
    css: string;
    messages: LogMessage[];
    logWriter: LogWriter | undefined;
    MAX_ENTRIES: number;
    constructor(prefix: string, enabled: boolean, logWriter?: LogWriter);
    setColors(colors: Record<string, string>): void;
    addMessage({ level, prefix, timestamp }: {
        level: string;
        prefix: string;
        timestamp?: number;
    }, ...args: any[]): void;
    setWriter(logWriter: any): void;
    log(...args: any[]): void;
    error(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    debug(...args: any[]): void;
    getLog(): LogMessage[];
}
//# sourceMappingURL=logs.d.ts.map