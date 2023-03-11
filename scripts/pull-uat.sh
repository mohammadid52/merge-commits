#!/usr/bin/env sh

git pull origin stagingdevelopment
git pull origin new-dev
cp ./src/config/aws-exports.uatenv.js ./src/aws-exports.ts