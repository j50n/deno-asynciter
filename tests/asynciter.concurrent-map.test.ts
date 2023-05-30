import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { asynciter } from "../mod.ts";

function delayedResult(
  delay: () => number,
): (result: string) => Promise<string> {
  return (result: string) =>
    new Promise((resolve, _reject) => {
      const d = delay();
      setTimeout(() => {
        resolve(result);
      }, d);
    });
}

Deno.test({
  name: "I can run something concurrently.",
  async fn() {
    assertEquals(
      await asynciter(["a", "b", "c", "d", "e", "f"]).concurrentMap(
        delayedResult(() => Math.ceil(10 + Math.random() * 50)),
        2,
      ).collect(),
      ["a", "b", "c", "d", "e", "f"],
    );
  },
});

Deno.test({
  name: "I can run something concurrently, out of order.",
  async fn() {
    assertEquals(
      new Set(
        await asynciter(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
          .concurrentUnorderedMap(
            delayedResult(() => Math.ceil(10 + Math.random() * 100)),
            3,
          ).collect(),
      ),
      new Set(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]),
    );
  },
});
