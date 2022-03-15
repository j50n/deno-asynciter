import { assertArrayIncludes } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { asynciter } from "../asynciter.ts";
import { collect } from "../collect.ts";
import { map } from "../map.ts";

Deno.test("function map some values", async () => {
  assertArrayIncludes<string>(
    ["A", "B", "C"],
    await collect(
      map(asynciter(["a", "b", "c"]), (it) => it.toUpperCase()),
    ),
    "maps some values",
  );
});

Deno.test("function map empty collection", async () => {
  assertArrayIncludes<string>(
    [],
    await collect(
      map(asynciter([] as string[]), (it) => it.toUpperCase()),
    ),
    "no values are mapped",
  );
});

Deno.test("object map some values", async () => {
  assertArrayIncludes<string>(
    ["A", "B", "C"],
    await asynciter(["a", "b", "c"]).map((it) => it.toUpperCase()).collect(),
    "maps some values",
  );
});
