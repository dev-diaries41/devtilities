import { Counter } from "./counter";

interface PollOptions  {
  interval: number;
  maxDuration: number;
  maxErrors: number;
  onMaxErrors?: () => void;
  onMaxDuration?: () => void;
}

const DefaultPollOptions: PollOptions = {
  interval: 10 * 1000,
  maxDuration: 2 * 60 * 1000,
  maxErrors: 3
}

export class Polling {
  private callback: () => void;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number;
  private options: PollOptions;
  private errorCounter: Counter;

  constructor(callback: () => void, options: Partial<PollOptions>) {
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

  private pollCycle(): void {
    this.executeCallback();
    this.checkDuration();
  }

  private executeCallback(): void {
    try {
      this.callback();
    } catch (error: any) {
      this.handleError();
    }
  }

  private handleError(): void {
    this.errorCounter.increment();
    if (this.errorCounter.isMax()) {
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