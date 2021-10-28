/**
 * Perform an operation for each item in the sequence.
 * @param forEachFn The forEach function.
 */
export async function forEach<T>(
  iterable: AsyncIterable<T>,
  forEachFn: (item: T) => void | Promise<void>,
): Promise<void> {
  for await (const item of iterable) {
    await forEachFn(item);
  }
}
