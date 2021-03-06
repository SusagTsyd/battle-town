#!/bin/bash -eu

rm -rf ../copy
mkdir ../copy

rsync \
  --verbose \
  --recursive \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.idea \
  --exclude=docker \
  --exclude=lib/env.js \
  . tanks:app

ssh tanks 'cd app && npm run build && pkill -f node'
