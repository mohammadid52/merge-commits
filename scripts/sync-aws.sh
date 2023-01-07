#!/usr/bin/env sh
set -e

branch=$(git symbolic-ref --short HEAD)

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'
PURPLE='\033[01;35m'
CYAN='\033[01;36m'
WHITE='\033[01;37m'
BOLD='\033[1m'
UNDERLINE='\033[4m'

remove () {
    rm -rf amplify
    echo ${RED}"Removed existing amplify folder"${NONE}
}

copy_content_schema(){
    cp ./src/api.schema.graphql ./amplify/backend/api/demoselready/schema.graphql
    echo ${GREEN}"<---Copied all contents from api.schema.graphql to schema.graphql--->"${NONE}
}

push_to_cloud(){
    amplify push \
    --yes || true
    echo ${GREEN}"<---Pushed to cloud--->"${NONE}
}



switch_profiles(){
    select envName in dev demosite
    do
        case $envName in
            "dev")
                AMPLIFY_ENVIRONMENT="dev"
                break;;
            "demosite")
                AMPLIFY_ENVIRONMENT="demosite"
                break;;
            *) echo "invalid option $envName";;
        esac
    done

}


if [ "$AWS_ACCESS_ID" = ""  ] || [ "$AWS_SECRET_ACCESS_KEY" = "" ] ; then
    echo ${RED}"<---Aws config is missing--->"${NONE}
    exit 0

else 
    IFS='|'

 
    remove # remove current amplify folder
    
    switch_profiles #switch backend profile [only variables]

    AMPLIFY_APP_ID="d3009lcqngzhv4"
    AWS_REGION='us-east-1'


    AWSCLOUDFORMATIONCONFIG="{\
    \"useProfile\":false,\
    \"accessKeyId\":\"$AWS_ACCESS_ID\"\
    \"secretAccessKey\":\"$AWS_SECRET_ACCESS_KEY\"\
    \"region\":\"$AWS_REGION\"\
    }"
    
    AMPLIFY="{\
    \"appId\":\"$AMPLIFY_APP_ID\",\
    \"envName\":\"$AMPLIFY_ENVIRONMENT\",\
    }"

    PROVIDERS="{\
    \"awscloudformation\":$AWSCLOUDFORMATIONCONFIG}"


    amplify pull \
    --amplify $AMPLIFY \
    --providers $PROVIDERS \
    --yes || true

    echo ${GREEN}"<---Successfully pulled... now copying content from api.schema.graphql to schema.graphql--->"${NONE}

    copy_content_schema
    
    push_to_cloud
    
    fi