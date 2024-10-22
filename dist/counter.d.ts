export declare class Counter {
    maxCount?: number;
    count: number;
    constructor(maxCount?: number);
    increment(): void;
    decrement(): void;
    reset(): void;
    isMax(): boolean;
}
