// Design for single-use usecases
export class RetryHandler {
  private readonly maxRetries: number;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
  }

  async retry<T>(func: () => Promise<T>, errorHandler: (error: unknown) => Promise<boolean>): Promise<T> {
    let currentRetry = 0;

    while (true) {
      try {
        return await func();
      } catch (error) {
        currentRetry++;
        if (currentRetry > this.maxRetries) throw error;

        const shouldRetry = await errorHandler(error);
        if (!shouldRetry) throw error;
      }
    }
  }
}
