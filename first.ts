/**
 * Return the first item of the sequence.
 * @return The first item of the sequence.
 */
export async function first<T>(iterable: AsyncIterable<T>): Promise<T | null> {
  for await (const item of iterable) {
    return item;
  }
  return null;
}
