import {Amplify} from 'aws-amplify';
// @ts-ignore
import awsconfig from 'aws-exports';
import App from 'components/App';
import {createRoot} from 'react-dom/client';
import 'style/style.css';
import 'style/style.scss';

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
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id
  },
  Storage: {
    AWSS3: {
      bucket: awsconfig.aws_user_files_s3_bucket,
      region: awsconfig.aws_user_files_s3_bucket_region
    }
  }
});

const root = createRoot(document.getElementById('app')!);

root.render(<App />);
