#!/usr/bin/env sh

branch=$(git symbolic-ref --short HEAD)

echo "Do you want to run cypress test on this branch? (y/N) " 
read run_test

PURPLE='\033[01;35m'
NONE='\033[00m'

commit (){
      git add ./src/aws-exports.js
      git commit -m "update aws-exports.js"

}

final (){
      git pull
      git push origin ${branch}
      npm run find-deadcode && tsc
}



# run switch case
case $branch in

    "master-curate")
          echo ${PURPLE}"Changing environment to Project Curate production because you are in master-curate branch"${NONE}
          cp ./src/config/aws-exports.pc.js ./src/aws-exports.js
          commit
        ;;
    *)
          echo ${PURPLE}"Changing environment to Development"${NONE}
          cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
          commit
          
esac


if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
  echo "Running cypress test..."
  npm run cypress:run-everything
  final

else 
    echo "Skipping cypress test..."
    final
    fi
