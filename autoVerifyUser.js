/* Amplify Params - DO NOT EDIT
	AUTH_DEMOSELREADY58BE52E5_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// const AWS = require('aws-sdk');
import { CognitoIdentityServiceProvider } from "@aws-sdk/client-cognito-identity";

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { email } = body;
        const signUpResp = await cognitoidentityserviceprovider.adminCreateUser({
            UserPoolId: process.env.AUTH_DEMOSELREADY58BE52E5_USERPOOLID,
            Username: email,
            TemporaryPassword: 'xIconoclast.5x',
            UserAttributes: [{ Name: 'email', Value: email }],
            MessageAction: 'SUPPRESS'
        }).promise()
        const response = {
            statusCode: 200,
            body: JSON.stringify(signUpResp),
        };
        return response;
    } catch (err) {
        const response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(err),
        };
        return response;
    }
};
