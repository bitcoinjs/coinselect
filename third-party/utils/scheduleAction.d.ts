export type ScheduledAction<T> = (signal?: AbortSignal) => Promise<T>;
type AttemptParams = {
    timeout?: number;
    gap?: number;
};
export type ScheduleActionParams = {
    delay?: number;
    deadline?: number;
    attempts?: number | readonly AttemptParams[];
    signal?: AbortSignal;
    attemptFailureHandler?: (error: Error) => Error | void;
} & AttemptParams;
export declare const scheduleAction: <T>(action: ScheduledAction<T>, params: ScheduleActionParams) => Promise<T>;
export {};
//# sourceMappingURL=scheduleAction.d.ts.map