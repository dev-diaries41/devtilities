"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    start;
    end;
    startTimer() {
        this.start = performance.now();
        if (!this.start)
            throw new Error('Timer not started: Unknown Error');
        return parseFloat((this.start).toFixed(3));
    }
    endTimer() {
        if (!this.start)
            throw new Error('Time not started: Start timer first');
        this.end = performance.now();
        return parseFloat((this.end - this.start).toFixed(3));
    }
    resetTimer() {
        this.start = undefined;
        this.end = undefined;
    }
    async timeoutFunction(callback, timeout) {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout));
        try {
            return await Promise.race([callback(), timeoutPromise]);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Timer = Timer;
