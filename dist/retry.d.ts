export declare class RetryHandler {
    private maxRetries;
    private currentRetry;
    constructor(maxRetries?: number);
    retry<T>(func: () => Promise<T>, errorHandler: (error: unknown) => Promise<boolean>): Promise<T>;
    reset(): void;
}
