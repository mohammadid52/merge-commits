#!/usr/bin/env sh

branch=$(git symbolic-ref --short HEAD)

echo "Do you want to run cypress test on this branch? (y/N) " 
read run_test

commit (){
      git add ./src/aws-exports.js
      git commit -m "update aws-exports.js"
}

# run switch case
case $branch in
    "new-dev")
          echo "Changing environment to Iconoclast production"
          cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
          commit
        ;;
    "master")
          echo "Changing environment to Iconoclast production"
          cp ./src/config/aws-exports.ia.js ./src/aws-exports.js
          commit
        ;;
    "master-curate")
          echo "Changing environment to Project Curate production"
          cp ./src/config/aws-exports.pc.js ./src/aws-exports.js
          commit
        ;;
    *)
          echo "Changing environment to Development"
          cp ./src/config/aws-exports.uatenv.js ./src/aws-exports.js
          commit
          
esac





if [ "$run_test" = "y" ] || [ "$run_test" = "Y" ]; then
  echo "Running cypress test..."
  npm run cypress:run
  git push origin ${branch}

else 
    echo "Skipping cypress test..."
    git push origin ${branch}
    fi
