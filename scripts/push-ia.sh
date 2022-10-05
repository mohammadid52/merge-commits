#!/usr/bin/env sh

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'
PURPLE='\033[01;35m'
CYAN='\033[01;36m'
WHITE='\033[01;37m'
BOLD='\033[1m'
UNDERLINE='\033[4m'

 branch=$(git symbolic-ref --short HEAD)


cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
git checkout master
git pull origin new-dev


echo "Now you are on" ${UNDERLINE}$branch${NONE}
echo ${RED}"Please make sure the changes are correct before you push to " ${UNDERLINE}$branch ${NONE} "branch"
echo ${GREEN}"If everything is correct, please run the following command to push to " ${UNDERLINE}$branch ${NONE} "branch"

echo ${WHITE}"npm run push"
