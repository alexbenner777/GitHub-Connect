#!/bin/bash
set -e

export PNPM_PREFIX="$HOME/.local"
mkdir -p "$PNPM_PREFIX"
npm install --global pnpm@10 --prefix "$PNPM_PREFIX" --silent
export PATH="$PNPM_PREFIX/bin:$PATH"

pnpm install --no-frozen-lockfile
pnpm --filter @workspace/trends-landing run build:railway
pnpm --filter @workspace/api-server run build
