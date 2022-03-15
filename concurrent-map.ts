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

/**
 * Map the sequence from one type to another, concurrently.
 *
 * Items are iterated out of order. This allows maximum concurrency
 * at all times, but the output order cannot be assumed to be the
 * same as the input order.
 *
 * @param iterable An iterable collection.
 * @param mapFn The mapping function.
 * @returns An iterator of mapped values.
 */
export async function* concurrentDisorderedMap<T, U>(
  items: AsyncIterable<T>,
  mapFn: (item: T) => Promise<U>,
  concurrency?: number,
): AsyncIterableIterator<U> {
  const c = resolvedConcurrency(concurrency);

  const buffer: Esimorp<U>[] = [];

  for await (const item of items) {
    if (buffer.length >= c) {
      yield await buffer[0].promise;
      buffer.shift();
    }

    buffer.push(esimorp());

    (async () => {
      try {
        const transItem = await mapFn(item);
        buffer[0].resolve(transItem);
      } catch (e) {
        buffer[0].reject(e);
      }
    })();
  }

  while (buffer.length > 0) {
    yield await buffer[0].promise;
    buffer.shift();
  }
}

type Resolve<T> = (value: T) => void;

// deno-lint-ignore no-explicit-any
type Reject = (reason?: any) => void;

type Esimorp<T> = { promise: Promise<T>; resolve: Resolve<T>; reject: Reject };

function esimorp<T>(): Esimorp<T> {
  let rs: Resolve<T>;
  let rj: Reject;

  const p = new Promise<T>((resolve, reject) => {
    rs = resolve;
    rj = reject;
  });

  return { promise: p, resolve: rs!, reject: rj! };
}
