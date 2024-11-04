import { Counter } from "./counter";

interface PollOptions {
  interval: number;
  maxDuration: number;
  maxErrors: number;
  onMaxErrors?: () => void;
  onMaxDuration?: () => void;
}

const DefaultPollOptions: PollOptions = {
  interval: 10 * 1000,
  maxDuration: 2 * 60 * 1000,
  maxErrors: 3,
};

export class Polling {
  private callback: () => void | Promise<void>;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number;
  private options: PollOptions;
  private errorCounter: Counter;

  constructor(callback: () => void | Promise<void>, options: Partial<PollOptions>) {
    this.callback = callback;
    this.options = { ...DefaultPollOptions, ...options };
    this.startTime = 0;
    this.errorCounter = new Counter(this.options.maxErrors);
  }

  start(): void {
    if (!this.intervalId) {
      this.startTime = Date.now();
      this.intervalId = setInterval(this.pollCycle.bind(this), this.options.interval);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async pollCycle(): Promise<void> {
    await this.executeCallback(); // Call async method
    this.checkDuration();
  }

  private async executeCallback(): Promise<void> {
    try {
      const result = this.callback();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error: any) {
      this.handleError();
    }
  }

  private handleError(): void {
    this.errorCounter.increment();
    console.log(`Error count: ${this.errorCounter.count}`);
    if (this.errorCounter.isMax()) {
      console.log("Max errors reached, stopping polling.");
      this.options.onMaxErrors?.();
      this.stop();
    }
  }

  private checkDuration(): void {
    if (Date.now() - this.startTime >= this.options.maxDuration) {
      this.options.onMaxDuration?.();
      this.stop();
    }
  }
}
