#!/usr/bin/env sh

branch=$(git symbolic-ref --short HEAD)

echo "Do you want to run cypress test on this branch? (y/N) " 
read run_test

PURPLE='\033[01;35m'
NONE='\033[00m'

commit (){
      git add ./src/aws-exports.ts
      git commit -m "update aws-exports.ts"

}



# run switch case
case $branch in
    "new-dev")
          echo ${PURPLE}"Changing environment to Iconoclast production because you are in new-dev branch"${NONE}
          cp ./src/config/aws-exports.ia.js ./src/aws-exports.ts
          commit
        ;;
    "master")
          echo ${PURPLE}"Changing environment to Iconoclast production because you are in master branch"${NONE}
          cp ./src/config/aws-exports.ia.js ./src/aws-exports.ts
          commit
        ;;
    "master-curate")
          echo ${PURPLE}"Changing environment to Project Curate production because you are in master-curate branch"${NONE}
          cp ./src/config/aws-exports.pc.js ./src/aws-exports.ts
          commit
        ;;
    *)
          echo ${PURPLE}"Changing environment to Development"${NONE}
          cp ./src/config/aws-exports.uatenv.js ./src/aws-exports.ts
          commit
          
esac


if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
  echo "Running cypress test..."
  npm run cypress:run-everything
  git pull
  git push origin ${branch}

else 
    echo "Skipping cypress test..."
    git pull
    git push origin ${branch}
    fi
