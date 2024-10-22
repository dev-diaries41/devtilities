"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
class Counter {
    maxCount;
    count;
    constructor(maxCount) {
        this.maxCount = maxCount;
        this.count = 0;
    }
    increment() {
        if (this.isMax())
            return;
        this.count++;
    }
    decrement() {
        this.count--;
    }
    reset() {
        this.count = 0;
    }
    isMax() {
        return this.maxCount !== undefined && this.count >= this.maxCount;
    }
}
exports.Counter = Counter;
