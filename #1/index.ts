export default class AsyncCache<TInput extends Array<any> = Array<any>, TOutput = any> {
  private cache: Map<string, Promise<TOutput>> = new Map();

  constructor(private handler: (...args: TInput) => Promise<TOutput>, private timeout?: number) {
    // do something
  }

  async exec(...args: TInput): Promise<TOutput> {
    const key = JSON.stringify(args);

    if (this.cache.has(key)) {
      return this.cache.get(key) as Promise<TOutput>;
    }

    const promise = this.handler(...args);
    this.cache.set(key, promise);

    if (this.timeout) {
      setTimeout(() => this.cache.delete(key), this.timeout);
    }

    return promise;
  }
}
