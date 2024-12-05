import { LogWriter, Log, LogMessage } from './logs';
export declare class LogsManager {
    logs: {
        [k: string]: Log;
    };
    writer: LogWriter | undefined;
    colors?: Record<string, string>;
    constructor({ colors }: {
        colors?: Record<string, string>;
    });
    initLog(prefix: string, enabled?: boolean, logWriter?: LogWriter): Log;
    setLogWriter(logWriterFactory: () => LogWriter | undefined): void;
    enableLog(enabled?: boolean): void;
    enableLogByPrefix(prefix: string, enabled: boolean): void;
    getLog(): LogMessage[];
}
//# sourceMappingURL=logsManager.d.ts.map