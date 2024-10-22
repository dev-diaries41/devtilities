"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryHandler = void 0;
class RetryHandler {
    maxRetries;
    currentRetry;
    constructor(maxRetries = 3) {
        this.maxRetries = maxRetries;
        this.currentRetry = 0;
    }
    async retry(func, errorHandler) {
        try {
            return await func();
        }
        catch (error) {
            this.currentRetry++;
            if (this.currentRetry > this.maxRetries)
                throw error;
            const shouldRetry = await errorHandler(error);
            if (!shouldRetry)
                throw error;
            return this.retry(func, errorHandler);
        }
        finally {
            this.reset();
        }
    }
    reset() {
        this.currentRetry = 0;
    }
}
exports.RetryHandler = RetryHandler;
