#!/bin/bash
set -e

deno fmt
deno lint
deno test