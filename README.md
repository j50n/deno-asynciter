![example workflow](https://github.com/j50n/deno-asynciter/actions/workflows/deno.yml/badge.svg?branch=main)

# AsyncIter: Better AsyncIterables for Deno

I just want to work with `AsyncIterable` collections without using `for` loops.
Is that so wrong?

This little library exposes both functions and a fluent-style wrapper so I can
write my lazy code the way I want to: lazily.

## Quickstart

Here are some simple examples to get you started.

### Convert an `Array` to `AsyncIterable`

```typescript
const iter = asyncIter([1, 2, 3]);
for await (const it of iter) {
  console.log(it);
}
```

### map

```typescript
console.dir(await asyncIter([1, 2, 3]).map((it) => it * 2).collect());
// [ 2, 4, 6 ]
```

### filter

```typescript
console.dir(await asyncIter([1, 2, 3]).filter((it) => it > 1).collect());
// [ 2, 3 ]
```

### reduce

```typescript
console.dir(await asyncIter([1, 2, 3]).reduce(0, (a, b) => a + b));
// 6
```

### forEach

```typescript
await asyncIter([1, 2, 3]).forEach((it) => console.log(it));
// 1
// 2
// 3
```

### first

```typescript
const iter = asyncIter([1, 2, 3]);
console.dir(await iter.first());
console.dir(await iter.first());
// 1
// null
```

### collect

```typescript
console.dir(await asyncIter([1, 2, 3]).collect());
// [ 1, 2, 3 ]
```
