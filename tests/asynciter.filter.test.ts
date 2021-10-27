import { assertArrayIncludes } from "../deps/asserts.ts";
import { asyncIter } from "../asynciter.ts";
import { collect } from "../collect.ts";
import { filter } from "../filter.ts";

Deno.test("function filter some values", async () => {
  assertArrayIncludes<string>(
    ["a", "b"],
    await collect(
      filter(asyncIter(["a", "b", "c"]), (it) => it <= "b"),
    ),
    "filter out some values",
  );
});

Deno.test("object filter some values", async () => {
  assertArrayIncludes<string>(
    ["a", "b"],
    await asyncIter(["a", "b", "c"]).filter((it) => it <= "b").collect(),
    "filter out some values",
  );
});
