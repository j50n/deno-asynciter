#!/bin/bash
set -e

udd `find . -name '*.ts'`

deno fmt
deno lint
deno check `find . -name '*.ts'`
deno test