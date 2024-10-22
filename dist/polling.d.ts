interface PollOptions {
    interval: number;
    maxDuration: number;
    maxErrors: number;
    onMaxErrors?: () => void;
    onMaxDuration?: () => void;
}
export declare class Polling {
    private callback;
    private intervalId;
    private startTime;
    private options;
    private errorCounter;
    constructor(callback: () => void, options: Partial<PollOptions>);
    start(): void;
    stop(): void;
    private pollCycle;
    private executeCallback;
    private handleError;
    private checkDuration;
}
export {};
