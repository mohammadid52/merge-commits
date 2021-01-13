/* Amplify Params - DO NOT EDIT
    API_DEMOSELREADY_GRAPHQLAPIENDPOINTOUTPUT
    API_DEMOSELREADY_GRAPHQLAPIIDOUTPUT
    API_DEMOSELREADY_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    // var params = {
    //     TableName: 'Person-6oiwvxg3ezbmdc6x3bajlle2ya-dev',
    //     Key: {
    //         'email': 'ac856110@aldine-isd.org',
    //         'authId': '847ee5a3-9010-427c-b41d-5bf3db6ceb6b'
    //     }
    // };
    // console.log('params', params)
    // try {
    //     const data = await docClient.get(params).promise()
    //     console.log('data', data)
    //     const response = {
    //         statusCode: 200, 
    //         body: JSON.stringify('Hello from Lambda!'),
    //     };
    //     return response;
    // } catch (err) {
    //     console.log('err', err)
    //     const response = {
    //         statusCode: 500, 
    //         body: JSON.stringify(err),
    //     };
    //     return response;
    // }
    console.log('err', err)
    const response = {
        statusCode: 500,
        body: JSON.stringify(err),
    };
    return response;
};



