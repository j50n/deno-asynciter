function resolvedConcurrency(concurrency?: number | undefined) {
  if (concurrency === undefined) {
    return navigator.hardwareConcurrency;
  } else {
    const c = Math.ceil(concurrency);
    if (c < 1) {
      throw new Error(`concurrency must be greater than 0; got ${c}`);
    }
    return Math.ceil(concurrency);
  }
}

/**
 * Map the sequence from one type to another, concurrently.
 *
 * Items are iterated in order.
 *
 * @param iterable An iterable collection.
 * @param mapFn The mapping function.
 * @returns An iterator of mapped values.
 */
export async function* concurrentMap<T, U>(
  items: AsyncIterable<T>,
  mapFn: (item: T) => Promise<U>,
  concurrency?: number,
): AsyncIterableIterator<U> {
  const c = resolvedConcurrency(concurrency);

  const buffer: Promise<U>[] = [];

  for await (const item of items) {
    if (buffer.length >= c) {
      yield await buffer.shift()!;
    }

    buffer.push(mapFn(item));
  }

  while (buffer.length > 0) {
    yield await buffer.shift()!;
  }
}
