import { collect } from "./collect.ts";
import { concurrentMap, concurrentUnorderedMap } from "./concurrent-map.ts";
import { filter } from "./filter.ts";
import { first } from "./first.ts";
import { forEach } from "./for-each.ts";
import { map } from "./map.ts";
import { reduce } from "./reduce.ts";

/**
 * Convert an array into an {@link AsyncIterableIterator}.
 * @param items An array of items.
 */
async function* toAsyncIterable<T>(
  items: Iterable<T> | AsyncIterable<T> | Array<T>,
): AsyncIterableIterator<T> {
  yield* items;
}

export interface IAsyncIter<T> extends AsyncIterable<T> {
  map<U>(mapFn: (item: T) => U | Promise<U>): IAsyncIter<U>;

  concurrentMap<U>(
    mapFn: (item: T) => Promise<U>,
    concurrency?: number,
  ): IAsyncIter<U>;

  concurrentUnorderedMap<U>(
    mapFn: (item: T) => Promise<U>,
    concurrency?: number,
  ): IAsyncIter<U>;

  filter(
    filterFn: (item: T) => boolean | Promise<boolean>,
  ): IAsyncIter<T>;

  reduce<U>(
    zero: U,
    reduceFn: (acc: U, item: T) => U | Promise<U>,
  ): Promise<U>;

  forEach(
    forEachFn: (item: T) => void | Promise<void>,
  ): Promise<void>;

  first(): Promise<T | null>;

  collect(): Promise<T[]>;
}

/**
 * Convert an array or a standard {@link AsyncIterable} to an {@link AsyncIter}.
 * @param items A collection of items.
 * @returns Items as an {@link AsyncIter}.
 */
export function asynciter<T>(
  items: Iterable<T> | AsyncIterable<T> | Array<T>,
): IAsyncIter<T> {
  return new AsyncIter(items);
}

/**
 * A decorator for `AsyncIterable`.
 */
export class AsyncIter<T> implements IAsyncIter<T> {
  protected iterator: AsyncIterable<T>;

  /**
   * Constructor.
   * @param iterable The wrapped iterable.
   */
  constructor(iterable: Iterable<T> | AsyncIterable<T> | Array<T>) {
    this.iterator = toAsyncIterable(iterable);
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
   * Map the sequence from one type to another, concurrently.
   *
   * Results are returned in order.
   *
   * @param mapFn The mapping function.
   * @param concurrency The maximum concurrency.
   * @returns An iterable of mapped values.
   */
  public concurrentMap<U>(
    mapFn: (item: T) => Promise<U>,
    concurrency?: number,
  ): AsyncIter<U> {
    const iterable = this.iterator;
    return new AsyncIter({
      async *[Symbol.asyncIterator]() {
        yield* concurrentMap(iterable, mapFn, concurrency);
      },
    });
  }

  /**
   * Map the sequence from one type to another, concurrently.
   *
   * Items are iterated out of order. This allows maximum concurrency
   * at all times, but the output order cannot be assumed to be the
   * same as the input order.
   *
   * @param mapFn The mapping function.
   * @param concurrency The maximum concurrency.
   * @returns An iterable of mapped values.
   */
  public concurrentUnorderedMap<U>(
    mapFn: (item: T) => Promise<U>,
    concurrency?: number,
  ): AsyncIter<U> {
    const iterable = this.iterator;
    return new AsyncIter({
      async *[Symbol.asyncIterator]() {
        yield* concurrentUnorderedMap(iterable, mapFn, concurrency);
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
   * Reduce a sequence to a single value.
   * @param reduce The reducing function.
   * @returns The result of applying the reducing function to each item and accumulating the result.
   */
  public async reduce<U>(
    zero: U,
    reduceFn: (acc: U, item: T) => U | Promise<U>,
  ): Promise<U> {
    return await reduce(this.iterator, zero, reduceFn);
  }

  /**
   * Perform an operation for each item in the sequence.
   * @param forEachFn The forEach function.
   */
  public async forEach(
    forEachFn: (item: T) => void | Promise<void>,
  ): Promise<void> {
    await forEach(this.iterator, forEachFn);
  }

  /**
   * Return the first item of the sequence.
   * @return The first item of the sequence.
   */
  public async first(): Promise<T | null> {
    return await first(this.iterator);
  }

  /**
   * Collect the items in this iterator to an array.
   * @returns The items of this iterator collected to an array.
   */
  public async collect(): Promise<T[]> {
    return await collect(this.iterator);
  }
}
