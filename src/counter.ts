export class Counter {
    maxCount?: number;
    count: number;

    constructor(maxCount?: number) {
        this.maxCount = maxCount;
        this.count = 0;
    }

    increment(): void {
        if (this.isMax()) return;
        this.count++;
    }

    decrement(): void {
        this.count--;
    }

    reset(): void {
        this.count = 0;
    }

    isMax(): boolean {
        return this.maxCount !== undefined && this.count >= this.maxCount;
    }
}
