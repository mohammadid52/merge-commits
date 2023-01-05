#!/usr/bin/env sh
 set -e

branch=$(git symbolic-ref --short HEAD)



echo $TEST_VAR

remove () {
    rm -rf amplify
}

copy_content_schema(){
    cp ./src/api.schema.graphql ./amplify/backend/api/demoselready/schema.graphql
    echo "<---copied--->"
}

push_to_cloud(){
    amplify push api \
    --yes || true

    echo "pushed"
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
    echo "Aws config is missing"
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
    echo "success pulled.. now copying content from api.schema.graphql to schema.graphql"

    copy_content_schema
    
    push_to_cloud
    
    fi