#!/bin/bash
set -e

export PNPM_HOME="$HOME/.pnpm"
mkdir -p "$PNPM_HOME"
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_HOME="$PNPM_HOME" sh -
export PATH="$PNPM_HOME:$PATH"

pnpm install --no-frozen-lockfile
pnpm --filter @workspace/trends-landing run build:railway
pnpm --filter @workspace/api-server run build
