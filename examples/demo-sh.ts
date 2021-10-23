#!/usr/bin/env -S deno run --allow-run

import { sleep } from "../../lib/util.ts";
import { shex } from "../mod.ts";

console.dir(Deno.resources())

await shex(["a", "b", "c", "d", "e"]).pipe({cmd:["grep", "-P", "^[abc]$"]}).pipe({cmd: ["wc", "-l"]}).foreach( line => console.log(line));
console.log(await shex(["a", "b", "c", "d", "e"]).pipe({cmd:["grep", "-P", "^[abc]$"]}).pipe({cmd:["head", "-n", "1"]}).foreach(line => console.log(line)));

while(true){
    await sleep(1000);
    console.dir(Deno.resources());
}
