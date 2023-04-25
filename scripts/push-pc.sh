#!/usr/bin/env sh

git checkout master-curate
git pull origin master-curate
git pull origin new-dev
cp ./src/config/aws-exports.pc.js ./src/aws-exports.js
npm run build


echo "Now you are on" ${UNDERLINE}$branch${NONE}
echo ${RED}"Please make sure the changes are correct before you push to " ${UNDERLINE}$branch ${NONE} "branch"
echo ${GREEN}"If everything is correct, please run the following command to push to " ${UNDERLINE}$branch ${NONE} "branch"

echo ${WHITE}"npm run push"