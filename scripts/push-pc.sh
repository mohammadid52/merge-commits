#!/usr/bin/env sh

cp ./src/config/aws-exports.pc.js ./src/aws-exports.js
git checkout test-master
git pull origin new-dev