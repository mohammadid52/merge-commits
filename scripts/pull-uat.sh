#!/usr/bin/env sh

git pull origin stagingdevelopment
cp ./src/config/aws-exports.uatenv.js ./src/aws-exports.js