/**
 * Filter the sequence to contain just the items that pass a test.
 * @param iterable An iterable collection.
 * @param filterFn The filter function; `true` to keep the item, `false` to discard.
 * @returns An iterator returning the values that pass the filter function.
 */
export async function* filter<T>(
  iterable: AsyncIterable<T>,
  filterFn: (item: T) => boolean | Promise<boolean>,
): AsyncIterableIterator<T> {
  for await (const item of iterable) {
    if (await filterFn(item)) {
      yield item;
    }
  }
}
