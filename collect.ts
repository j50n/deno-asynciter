/**
 * Collect the items in this iterator to an array.
 * @returns The items of this iterator collected to an array.
 */
export async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
