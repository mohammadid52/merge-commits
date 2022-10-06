#!/usr/bin/env sh

branch=$(git symbolic-ref --short HEAD)

echo "Do you want to run cypress test on this branch? (y/N) " 
read run_test

if [ "$branch" == "new-dev" ]; then
  cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
  git add ./src/aws-exports.js
  git commit -m "update aws-exports.js"
  fi

if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
  echo "Running cypress test..."
  npm run cypress:run
  git push origin ${branch}

else 
    echo "Skipping cypress test..."
    git push origin ${branch}
    fi
