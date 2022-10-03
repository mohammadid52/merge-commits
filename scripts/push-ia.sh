#!/usr/bin/env sh

cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
git checkout master
git pull origin new-dev