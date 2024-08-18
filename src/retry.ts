export class RetryHandler {
  private maxRetries: number;
  private currentRetry: number;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
    this.currentRetry = 0;
  }

  async retry<T>(func: () => Promise<T>, errorHandler: (error: unknown) => Promise<boolean>): Promise<T> {
    try {
      return await func();
    } catch (error) {
      this.currentRetry++;
      if (this.currentRetry > this.maxRetries) throw error;

      const shouldRetry = await errorHandler(error);
      if (!shouldRetry) throw error;

      return this.retry(func, errorHandler);
    } finally {
      this.reset();
    }
  }

  reset() {
    this.currentRetry = 0;
  }
}
