#!/bin/bash
set -e

udd `find . -name '*.ts'`

deno fmt
deno lint
deno test