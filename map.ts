/**
 * Map the sequence from one type to another.
 * @param iterable An iterable collection.
 * @param mapFn The mapping function.
 * @returns An iterator of mapped values.
 */
export async function* map<T, U>(
  iterable: AsyncIterable<T>,
  mapFn: (item: T) => U | Promise<U>,
): AsyncIterableIterator<U> {
  for await (const item of iterable) {
    yield await mapFn(item);
  }
}
