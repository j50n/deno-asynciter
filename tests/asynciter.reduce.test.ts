import { asyncIter } from "../asynciter.ts";
import { assertEquals } from "../deps/asserts.ts";
import { reduce } from "../reduce.ts";

Deno.test("function reduce some values", async () => {
  assertEquals(
    6,
    await reduce(asyncIter([1, 2, 3]), 0, (a, b) => a + b),
    "reduce can be used to find the sum of some numbers",
  );
});

Deno.test("object reduce some values", async () => {
  assertEquals(
    6,
    await asyncIter([1, 2, 3]).reduce(0, (a, b) => a + b),
    "reduce can be used to find the sum of some numbers",
  );
});
