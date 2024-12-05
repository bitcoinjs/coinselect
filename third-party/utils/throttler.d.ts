export declare class Throttler {
    private readonly delay;
    private readonly intervals;
    private readonly callbacks;
    constructor(delay: number);
    throttle(id: string, callback: () => void): void;
    private tick;
    cancel(id: string): void;
    dispose(): void;
}
//# sourceMappingURL=throttler.d.ts.map