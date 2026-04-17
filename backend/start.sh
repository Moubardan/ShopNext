#!/bin/sh
yarn build
yarn seed
node dist/main
