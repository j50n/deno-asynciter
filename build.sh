#!/bin/bash
set -e

HERE="$(realpath "$(dirname "$0")")"

deno install -rf --allow-read="$HERE/" --allow-write="$HERE/" --allow-net https://deno.land/x/udd/main.ts

udd `find "$HERE" -name '*.ts'`

deno fmt
deno lint
deno check `find "$HERE" -name '*.ts'`
deno test