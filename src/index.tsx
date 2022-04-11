// import Amplify from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import React, {useEffect} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import 'react-image-crop/lib/ReactCrop.scss';
import awsconfig from './aws-exports2';
import App from './components/App';
import './index.html';
import './style/style.css';
import './style/style.scss';

// Amplify.configure(awsconfig);

Amplify.configure({
  aws_appsync_region: awsconfig.aws_appsync_region,
  aws_appsync_graphqlEndpoint: awsconfig.aws_appsync_graphqlEndpoint,
  aws_appsync_authenticationType: awsconfig.aws_appsync_authenticationType,
  graphql_endpoint: awsconfig.aws_appsync_graphqlEndpoint,
  aws_appsync_apiKey: awsconfig.aws_appsync_apiKey,
  graphql_endpoint_iam_region: awsconfig.aws_appsync_region,
  Auth: {
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    region: awsconfig.aws_cognito_region,
    userPoolId: awsconfig.aws_user_pools_id,
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
  },
  Storage: {
    AWSS3: {
      bucket: awsconfig.aws_user_files_s3_bucket,
      region: awsconfig.aws_user_files_s3_bucket_region,
    },
  },
});

const Page: React.FC = () => {
  useEffect(() => {
    // console.log('createUserUrl = ', createUserUrl);
    // console.log('requestResetPassword = ', requestResetPassword);
    // console.log('tableCleanupUrl = ', tableCleanupUrl);
    // console.log('Auth.configure()', Auth.configure());
  }, []);
  return <App />;
};

ReactDOM.render(<Page />, document.getElementById('app'));
