![example workflow](https://github.com/j50n/deno-asynciter/actions/workflows/deno.yml/badge.svg?branch=main)

# AsyncIter: Better AsyncIterables for Deno

I just want to work with `AsyncIterable` collections without using `for` loops.
Is that so wrong?

This little library exposes both functions and a fluent-style wrapper so I can
write my lazy code the way I want to: lazily.

It also supports easy in-order and out-of-order concurrent execution - with
limits.

## Quickstart

Here are some simple examples to get you started.

### Convert an `Array` to `AsyncIterable`

```typescript
const iter = asynciter([1, 2, 3]);
for await (const it of iter) {
  console.log(it);
}
```

### map

```typescript
console.dir(await asynciter([1, 2, 3]).map((it) => it * 2).collect());
// [ 2, 4, 6 ]
```

### [concurrent-map.ts](./concurrent-map.ts)

There are four items in the array, but the operation will run in about two
seconds because the operation is concurrent.

```ts
function delayedDouble(delay: number): (n: number) => Promise<string> {
  return (n: number) =>
    new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(2 * n);
      }, delay);
    });
}

await asynciter([1, 2, 3, 4]).concurrentMap(
  delayedDouble(1000),
  2,
).collect();

// [2, 4, 6, 8]
```

### filter

```typescript
console.dir(await asynciter([1, 2, 3]).filter((it) => it > 1).collect());
// [ 2, 3 ]
```

### reduce

```typescript
console.dir(await asynciter([1, 2, 3]).reduce(0, (a, b) => a + b));
// 6
```

### forEach

```typescript
await asynciter([1, 2, 3]).forEach((it) => console.log(it));
// 1
// 2
// 3
```

### first

```typescript
const iter = asynciter([1, 2, 3]);
console.dir(await iter.first());
console.dir(await iter.first());
// 1
// null
```

### collect

```typescript
console.dir(await asynciter([1, 2, 3]).collect());
// [ 1, 2, 3 ]
```
