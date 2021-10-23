import { toAsyncIterable } from "./asynciter.ts";
import { sh } from "./sh.ts";

Deno.test("sh", async () => {
  for await (
    const line of sh({
      stdin: toAsyncIterable(["a", "b", "c"]),
      cmd: ["wc", "-l"],
    })
  ) {
    console.log(`***${line}***`);
  }
});
