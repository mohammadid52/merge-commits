const awsconfig = require('../aws-exports');

const getCorrectUrl = (clientKey: string) => {
  switch (clientKey) {
    case 'iconoclast':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/prod-create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/prod-request-reset-password',
      };
    case 'demo':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/prod-create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/prod-request-reset-password',
      };
    case 'curate':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/demosite-create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/demosite-request-reset-password',
      };
    default:
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/uatenv-request-reset-password',
      };
  }
};

/**
 *
 * @param configJson - imported aws config file
 * @returns
 */
export const getBackendKey = (configJson: string): string => {
  if (configJson) {
    //@ts-ignore
    let s3BucketName = configJson['aws_user_files_s3_bucket'];
    if (s3BucketName) {
      if (s3BucketName.match(/^(demosite)/)) {
        return 'curate';
      } else if (s3BucketName.match(/^(dev)/)) {
        return 'iconoclast';
      } else if (s3BucketName.match(/^(edgesprod)/)) {
        return 'demo';
      } else if (s3BucketName.match(/^(uatenv)/)) {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
  console.log('configJson', awsconfig);
};

// ~~~~~~~~~~~~ TABLE CLEANUP ~~~~~~~~~~~~ //
export const tableCleanupUrl =
  'https://3spj78f25e.execute-api.us-east-1.amazonaws.com/universalLesson';
