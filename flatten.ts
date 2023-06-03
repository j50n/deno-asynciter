/**
 * Flatten the iterable.
 * @param iterable An iterable collection containing iterable collections.
 * @returns An iterator where a level of indirection has been removed.
 */
export async function* flatten<T>(
  iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>,
): AsyncIterableIterator<T> {
  for await (const iter of iterable) {
    yield* iter;
  }
}
