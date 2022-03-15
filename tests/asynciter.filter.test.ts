import { assertArrayIncludes } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { asynciter } from "../asynciter.ts";
import { collect } from "../collect.ts";
import { filter } from "../filter.ts";

Deno.test("function filter some values", async () => {
  assertArrayIncludes<string>(
    ["a", "b"],
    await collect(
      filter(asynciter(["a", "b", "c"]), (it) => it <= "b"),
    ),
    "filter out some values",
  );
});

Deno.test("object filter some values", async () => {
  assertArrayIncludes<string>(
    ["a", "b"],
    await asynciter(["a", "b", "c"]).filter((it) => it <= "b").collect(),
    "filter out some values",
  );
});
