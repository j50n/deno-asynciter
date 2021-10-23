import { AsyncIterableExtras, toAsyncIterable } from "./asynciter.ts";
import { BufReader, BufWriter, TextProtoReader } from "./deps/std.ts";

const encoder = new TextEncoder();
const LF = encoder.encode("\n");

/** Parameters for {@link AsyncIterableExtras4Sh.pipe()}. */
interface ShPipedParams {
  /** The command. */
  cmd: string[] | [URL, ...string[]];
  /** Optional environment definition. */
  env?: { [key: string]: string };
}

/** Parameters for {@link sh()}. */
interface ShParams extends ShPipedParams {
  /** Optional stdin. */
  stdin?: AsyncIterable<string>;
}

export function shex(
  iterator: AsyncIterable<string> | string[],
): AsyncIterableExtras4Sh {
  if (iterator instanceof Array) {
    return shex(toAsyncIterable(iterator));
  } else {
    return new AsyncIterableExtras4Sh(iterator);
  }
}

export class AsyncIterableExtras4Sh extends AsyncIterableExtras<string> {
  /**
   * Constructor.
   * @param iterator The wrapped iterator.
   */
  constructor(iterator: AsyncIterable<string>) {
    super(iterator);
  }

  public pipe(params: ShPipedParams): AsyncIterableExtras4Sh {
    return sh({ ...params, stdin: this });
  }
}

/**
 * ### Example
 * ````typescript
 * for await (const line of sh({cmd: ["ls", "-la"]})){
 *   console.log(line);
 * }
 * ````
 * @param params Parameters.
 */
export function sh(params: ShParams): AsyncIterableExtras4Sh {
  return shex(shinner(params));
}

async function* shinner(params: ShParams): AsyncIterableIterator<string> {
  const { cmd, env, stdin } = params;
  const proc = Deno.run({
    cmd,
    env,
    stdin: stdin ? "piped" : undefined,
    stdout: "piped",
    stderr: "inherit"
  });

  let inputDriver;
  if (stdin) {
    inputDriver = (async () => {
      if (proc.stdin == null) {
        throw new Error("missing expected stdin");
      }
      const bw = new BufWriter(proc.stdin);
      try {
        for await (const lineIn of stdin) {
          await bw.write(encoder.encode(lineIn));
          await bw.write(LF);
        }
      } finally {
        await bw.flush();
        await proc.stdin.close();
      }
    })();
  }

  const stdout = new TextProtoReader(new BufReader(proc.stdout));

  try {
    while (true) {
      const line = await stdout.readLine();
      if (line == null) {
        break;
      } else {
        yield line;
      }
    }
  } finally {
    await proc.stdout.close();
  }

  const status = await proc.status();
  if (!status.success) {
    throw new Error(`process returned error code: ${status.code}`);
  }

  if (inputDriver) {
    await inputDriver;
  }

  await proc.close();
}
