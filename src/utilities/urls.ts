// ##################################################################### //
// ############################### BACKUP ############################## //
// ##################################################################### //
// ~~~~~~~~~~~~~~~~~ DEV ~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~ EDGESPROD ~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~ DEMOSITE ~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~ UATENV ~~~~~~~~~~~~~~~ //

export const getCorrectUrl = (clientKey: string) => {
  console.log('getCorrectURL - ', clientKey);
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
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/createUser-edgesprod',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/requestResetPassword-edgesprod',
      };
    case 'curate':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/demosite-create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/demosite-request-reset-password',
      };
    case 'localhost':
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
export const getBackendKey = () => {
  const awsconfig = require('../aws-exports');
  if (awsconfig) {
    //@ts-ignore
    let configJson = awsconfig['default'];
    let s3BucketName = configJson['aws_user_files_s3_bucket'];

    if (/(-demosite)/.test(s3BucketName)) {
      return 'curate';
    } else if (/(-dev)/.test(s3BucketName)) {
      return 'iconoclast';
    } else if (/(-edgesprod)/.test(s3BucketName)) {
      return 'demo';
    } else if (/(-uatenv)/.test(s3BucketName)) {
      return 'localhost';
    }
  } else {
    return 'localhost';
  }
};

// ##################################################################### //
// ############################### OUTPUT ############################## //
// ##################################################################### //
export const createUserUrl = getCorrectUrl(getBackendKey()).createUserUrl;
export const requestResetPassword = getCorrectUrl(getBackendKey()).requestResetPassword;
export const tableCleanupUrl =
  'https://3spj78f25e.execute-api.us-east-1.amazonaws.com/universalLesson';
