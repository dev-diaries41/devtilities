export declare class Timer {
    start: number | undefined;
    end: number | undefined;
    startTimer(): number;
    endTimer(): number;
    resetTimer(): void;
    timeoutFunction<T>(callback: () => Promise<T>, timeout: number): Promise<T | null>;
}
