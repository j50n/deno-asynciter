import { collect } from "./collect.ts";
import { filter } from "./filter.ts";
import { map } from "./map.ts";

/**
 * Convert an array into an {@link AsyncIterableIterator}.
 * @param items An array of items.
 */
async function* toAsyncIterable<T>(
  items: Array<T>,
): AsyncIterableIterator<T> {
  yield* items;
}

/**
 * Convert an array or a standard {@link AsyncIterable} to an {@link AsyncIter}.
 * @param items A collection of items.
 * @returns Items as an {@link AsyncIter}.
 */
export function asyncIter<T>(items: AsyncIterable<T> | Array<T>): AsyncIter<T> {
  return new AsyncIter(items);
}

/**
 * A decorator for `AsyncIterable`.
 */
export class AsyncIter<T> implements AsyncIterable<T> {
  protected iterator: AsyncIterable<T>;

  /**
   * Constructor.
   * @param iterable The wrapped iterable.
   */
  constructor(iterable: AsyncIterable<T> | Array<T>) {
    if (Array.isArray(iterable)) {
      this.iterator = toAsyncIterable(iterable);
    } else {
      this.iterator = iterable;
    }
  }

  public async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    for await (const item of this.iterator) {
      yield item;
    }
  }

  /**
   * Map the sequence from one type to another.
   * @param mapFn The mapping function.
   * @returns An iterable of mapped values.
   */
  public map<U>(mapFn: (item: T) => U | Promise<U>): AsyncIter<U> {
    const iterable = this.iterator;
    return new AsyncIter({
      async *[Symbol.asyncIterator]() {
        yield* map(iterable, mapFn);
      },
    });
  }

  /**
   * Filter the sequence to contain just the items that pass a test.
   * @param filterFn The filter function.
   * @returns An iterator returning the values that passed the filter function.
   */
  public filter(
    filterFn: (item: T) => boolean | Promise<boolean>,
  ): AsyncIter<T> {
    const iterable = this.iterator;
    return new AsyncIter({
      async *[Symbol.asyncIterator]() {
        yield* filter(iterable, filterFn);
      },
    });
  }

  /**
   * Reduce a sequence to a single number.
   * @param reduce The reducing function.
   * @returns The result of applying the reducing function to each item and accumulating the result.
   */
  public async reduce<U>(
    zero: U,
    reduceFn: (acc: U, item: T) => U | Promise<U>,
  ): Promise<U> {
    let acc = zero;
    for await (const item of this.iterator) {
      acc = await reduceFn(acc, item);
    }
    return acc;
  }

  /**
   * Perform an operation for each item in the sequence.
   * @param foreachFn The foreach function.
   */
  public async foreach(
    foreachFn: (item: T) => void | Promise<void>,
  ): Promise<void> {
    for await (const item of this.iterator) {
      await foreachFn(item);
    }
  }

  /**
   * Return the first item of the sequence.
   * @return The first item of the sequence.
   */
  public async first(): Promise<T | null> {
    for await (const item of this.iterator) {
      return item;
    }
    return null;
  }

  /**
   * Collect the items in this iterator to an array.
   * @returns The items of this iterator collected to an array.
   */
  public async collect(): Promise<T[]> {
    return await collect(this.iterator);
  }
}
