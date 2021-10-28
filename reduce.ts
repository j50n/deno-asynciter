/**
 * Reduce a sequence to a single value.
 * @param reduce The reducing function.
 * @returns The result of applying the reducing function to each item and accumulating the result.
 */
export async function reduce<T, U>(
  iterable: AsyncIterable<T>,
  zero: U,
  reduceFn: (acc: U, item: T) => U | Promise<U>,
): Promise<U> {
  let acc = zero;
  for await (const item of iterable) {
    acc = await reduceFn(acc, item);
  }
  return acc;
}
