export class Timer {
  public start: number | undefined;
  end: number | undefined;

  startTimer() {
      this.start = performance.now();
      if (!this.start) throw new Error('Timer not started: Unknown Error');
      return parseFloat((this.start).toFixed(3))
  }

  endTimer() {
      if (!this.start) throw new Error('Time not started: Start timer first');
      this.end = performance.now();
      return parseFloat((this.end - this.start).toFixed(3));
  }

  resetTimer(){
    this.start = undefined;
    this.end = undefined
  }

  async timeoutFunction<T>(callback: () => Promise<T>, timeout: number): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
    );
    return await Promise.race([callback(), timeoutPromise]);
    } 
}
