/**
 * Convert an array into an {@link AsyncIterableIterator}.
 * @param items An array of items.
 */
export async function* toAsyncIterable<T>(
  items: Array<T>,
): AsyncIterableIterator<T> {
  yield* items;
}

/**
 * Factory function for {@link AsyncIterableExtras}.
 * @param iterator The wrapped iterator.
 * @returns
 */
export function ex<T>(
  iterator: AsyncIterable<T> | Array<T>,
): AsyncIterableExtras<T> {
  if (iterator instanceof Array) {
    return ex(toAsyncIterable(iterator));
  } else {
    return new AsyncIterableExtras(iterator);
  }
}

/**
 * A decorator for `AsyncIterable`.
 */
export class AsyncIterableExtras<T> implements AsyncIterable<T> {
  /**
   * Constructor.
   * @param iterator The wrapped iterator.
   */
  constructor(protected iterator: AsyncIterable<T>) {
  }

  public async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    for await (const item of this.iterator) {
      yield item;
    }
  }

  /**
   * Map the sequence from one type to another.
   * @param mapFn The mapping function.
   * @returns An iterator of mapped values.
   */
  public map<U>(mapFn: (item: T) => U | Promise<U>): AsyncIterableExtras<U> {
    const iterator = this.iterator;
    return new AsyncIterableExtras({
      async *[Symbol.asyncIterator]() {
        for await (const item of iterator) {
          yield await mapFn(item);
        }
      },
    });
  }

  /**
   * Filter the sequence to contain just the items that pass a test.
   * @param filterFn The filter function.
   * @returns An iterator returning the values that passed the filter function.
   */
  public filter<U>(
    filterFn: (item: T) => boolean | Promise<boolean>,
  ): AsyncIterableExtras<T> {
    const iterator = this.iterator;
    return new AsyncIterableExtras({
      async *[Symbol.asyncIterator]() {
        for await (const item of iterator) {
          if (await filterFn(item)) {
            yield item;
          }
        }
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
    for await(const item of this.iterator){
        await foreachFn(item);
    }
  }

  /**
   * Return the first item of the sequence.
   * @return The first item of the sequence.
   */
   public async first(): Promise<T|null> {
    for await(const item of this.iterator){
        return item;
    }
    return null;
  }

  /**
   * Collect the items in this iterator to an array.
   * @returns The items of this iterator collected to an array.
   */
  public async collect(): Promise<T[]> {
    const result = [];
    for await (const item of this.iterator) {
      result.push(item);
    }
    return result;
  }
}
