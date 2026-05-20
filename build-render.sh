#!/bin/bash
set -e

npx --yes pnpm@10 install --no-frozen-lockfile
npx --yes pnpm@10 --filter @workspace/trends-landing run build:prod
npx --yes pnpm@10 --filter @workspace/api-server run build
