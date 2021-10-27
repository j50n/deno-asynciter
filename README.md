![example workflow](https://github.com/j50n/deno-asynciter/actions/workflows/deno.yml/badge.svg)

# Better AsyncIterables for Deno

Early days. I am still working out the details of the first version of this
library. Expect the API to be unstable for a bit longer, and try it out if you
want. The tests should provide a few nice examples until I can write some proper
documentation.

## Notes

- The function versions of each operation are broken out into separate files.
  You don't have to load in the whole library if you just want to use
  `collect()`, for example.
