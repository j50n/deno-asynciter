import { asynciter } from "../mod.ts";

console.dir(await asynciter([1, 2, 3]).map((it) => it * 2).collect());
console.dir(await asynciter([1, 2, 3]).filter((it) => it > 1).collect());
console.dir(await asynciter([1, 2, 3]).reduce(0, (a, b) => a + b));

await asynciter([1, 2, 3]).forEach((it) => console.log(it));

const iter = asynciter([1, 2, 3]);
console.dir(await iter.first());
console.dir(await iter.first());

console.dir(await asynciter([1, 2, 3]).collect());
