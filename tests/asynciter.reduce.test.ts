import { asynciter } from "../asynciter.ts";
import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { reduce } from "../reduce.ts";

Deno.test("function reduce some values", async () => {
  assertEquals(
    6,
    await reduce(asynciter([1, 2, 3]), 0, (a, b) => a + b),
    "reduce can be used to find the sum of some numbers",
  );
});

Deno.test("object reduce some values", async () => {
  assertEquals(
    6,
    await asynciter([1, 2, 3]).reduce(0, (a, b) => a + b),
    "reduce can be used to find the sum of some numbers",
  );
});
