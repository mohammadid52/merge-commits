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

// ~~~~~~~~~~~~~ USER RELATED ~~~~~~~~~~~~ //
export const createUserUrl =
  'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/create-user';
export const requestResetPassword =
  'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/uatenv-request-reset-password';

/**
   * PROD: 
   * 
   * export const createUserUrl = 'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/prod-create-user';
export const requestResetPassword = 'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/prod-request-reset-password';
   * 
   * CUR:
   * 
   * export const createUserUrl = 'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/demosite-create-user';
export const requestResetPassword = 'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/demosite-request-reset-password';


DEMOSITE:
export const createUserUrl = 'https://9jk0le8cae.execute-api.us-east-1.amazonaws.com/demosite-create-user';
export const requestResetPassword = 'https://eogdfg6pj0.execute-api.us-east-1.amazonaws.com/demosite-request-reset-password';
   */

// ~~~~~~~~~~~~ TABLE CLEANUP ~~~~~~~~~~~~ //
export const tableCleanupUrl =
  'https://3spj78f25e.execute-api.us-east-1.amazonaws.com/universalLesson';
