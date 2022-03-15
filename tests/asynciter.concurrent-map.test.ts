import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { asynciter } from "../mod.ts";

function delayedResult(delay: number): (result: string) => Promise<string> {
  return (result: string) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(result);
      }, delay);
    });
}

Deno.test({
  name: "I can run something concurrently.",
  async fn() {
    assertEquals(
      await asynciter(["a", "b", "c", "d"]).concurrentMap(
        delayedResult(20),
        2,
      ).collect(),
      ["a", "b", "c", "d"],
    );
  },
});
