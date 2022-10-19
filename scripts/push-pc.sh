#!/usr/bin/env sh

git checkout master-curate
git pull origin master-curate
git pull origin new-dev
cp ./src/config/aws-exports.pc.js ./src/aws-exports.js