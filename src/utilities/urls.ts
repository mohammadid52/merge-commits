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
        tableCleanupUrl:
          'https://3spj78f25e.execute-api.us-east-1.amazonaws.com/UniversalLessonIconoclast',
      };
      break;
    case 'demo':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/createUser-efprod',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/requestResetPassword-efprod',
        tableCleanupUrl: '',
      };
      break;
    case 'curate':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/demosite-create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/demosite-request-reset-password',
        tableCleanupUrl: '',
      };
      break;
    case 'localhost':
      return {
        createUserUrl:
          'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/create-user',
        requestResetPassword:
          'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/uatenv-request-reset-password',
        tableCleanupUrl:
          'https://3spj78f25e.execute-api.us-east-1.amazonaws.com/universalLesson',
      };
  }
};

/**
 *
 * @param configJson - imported aws config file
 * @returns
 */

import * as awsconfig2 from '../aws-exports';

export const getBackendKey = (input: any) => {
  console.log('input', input);
  if (input) {
    //@ts-ignore
    let configJson = input['default'];
    let s3BucketName = configJson['aws_user_files_s3_bucket'];

    if (/(-demosite)/.test(s3BucketName)) {
      return 'curate';
    } else if (/(-dev)/.test(s3BucketName)) {
      return 'iconoclast';
    } else if (/(-efprod)/.test(s3BucketName)) {
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
const getUrls = getCorrectUrl(getBackendKey(awsconfig2));
export const createUserUrl = getUrls.createUserUrl;
export const requestResetPassword = getUrls.requestResetPassword;
export const tableCleanupUrl = getUrls.tableCleanupUrl;
