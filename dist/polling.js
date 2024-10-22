"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polling = void 0;
const counter_1 = require("./counter");
const DefaultPollOptions = {
    interval: 10 * 1000,
    maxDuration: 2 * 60 * 1000,
    maxErrors: 3
};
class Polling {
    callback;
    intervalId = null;
    startTime;
    options;
    errorCounter;
    constructor(callback, options) {
        this.callback = callback;
        this.options = { ...DefaultPollOptions, ...options };
        this.startTime = 0;
        this.errorCounter = new counter_1.Counter(this.options.maxErrors);
    }
    start() {
        if (!this.intervalId) {
            this.startTime = Date.now();
            this.intervalId = setInterval(this.pollCycle.bind(this), this.options.interval);
        }
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    pollCycle() {
        this.executeCallback();
        this.checkDuration();
    }
    executeCallback() {
        try {
            this.callback();
        }
        catch (error) {
            this.handleError();
        }
    }
    handleError() {
        this.errorCounter.increment();
        if (this.errorCounter.isMax()) {
            this.options.onMaxErrors?.();
            this.stop();
        }
    }
    checkDuration() {
        if (Date.now() - this.startTime >= this.options.maxDuration) {
            this.options.onMaxDuration?.();
            this.stop();
        }
    }
}
exports.Polling = Polling;
