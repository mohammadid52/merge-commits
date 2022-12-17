import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import {formatPageName} from '@components/Dashboard/Admin/UserManagement/List';
import {setPageTitle} from '@utilities/functions';
import {CreateErrorLogInput, UserPageState} from 'API';
import * as customMutations from 'customGraphql/customMutations';

interface S3UploadOptions {
  onSuccess?: (result: Object) => void;
  onError?: (error: Error) => void;
  progressCallback?: ({
    loaded,
    total,
    progress
  }: {
    loaded: number;
    total: number;
    progress: number;
  }) => void;
  auth: {
    authId: string;
    email: string;
  };
}

export const uploadImageToS3 = async (
  file: any,
  key: string,
  type: string,
  options?: S3UploadOptions
) => {
  // Upload file to s3 bucket

  try {
    const result = await Storage.put(key, file, {
      contentType: type,
      acl: 'public-read',
      ContentEncoding: 'base64',
      progressCallback: ({loaded, total}: any) => {
        const progress = (loaded * 100) / total;
        options?.progressCallback({progress, loaded, total});
      }
    });

    if (options && options?.onSuccess && typeof options?.onSuccess === 'function') {
      options.onSuccess(result);
    }
    return result;
  } catch (error) {
    logError(
      error,
      {authId: options.auth.authId, email: options.auth.email},
      'uploadImageToS3'
    );
    if (options && options?.onError && typeof options?.onError === 'function') {
      // if there is a error callback, call the onError function
      options.onError(error);
    } else {
      // otherwise throw the error to console
      console.error(error);
    }
  }
};

export const deleteImageFromS3 = async (key: string) => {
  // Remove image from bucket

  try {
    await Storage.remove(key);
    console.log('File with key: ', key, ' deleted successfully');
  } catch (error) {
    console.error('Error in deleting file from s3', {key}, error);
  }
};

export const updatePageState = async (
  pageState: UserPageState,
  auth: {authId: string; email: string; pageState: UserPageState},
  onSuccessCallback?: () => void
) => {
  if (
    pageState === UserPageState.DASHBOARD ||
    pageState === UserPageState.COMMUNITY ||
    pageState === UserPageState.GAME_CHANGERS ||
    pageState === UserPageState.NOTEBOOK
  ) {
    setPageTitle(formatPageName(pageState));
  }

  if (auth.pageState !== pageState) {
    try {
      const input = {
        authId: auth.authId,
        email: auth.email,
        pageState: pageState,
        lastPageStateUpdate: new Date().toISOString()
      };
      const res = await API.graphql(
        graphqlOperation(customMutations.updatePersonLoginTime, {input})
      );
      onSuccessCallback && onSuccessCallback();
    } catch (error) {
      logError(error, {authId: auth.authId, email: auth.email}, 'updatePageState');
      console.error('error updating page -> ', {pageState, auth}, error);
    }
  }
};

export const logError = async (
  error: Error | string,
  auth: {authId: string; email: string},
  componentName: string,
  additionalInfo?: any
) => {
<<<<<<< HEAD
  try {
    const input: CreateErrorLogInput = {
      authID: auth.authId,
      email: auth.email,
      error: JSON.stringify(error) || 'Invalid error',
      errorType:
        (typeof error === 'string' ? error : error.message) || 'Invalid error type',
      errorTime: new Date().toISOString(),
      pageUrl: location.href,
      componentName: componentName
    };
    const res = await API.graphql(
      graphqlOperation(customMutations.createErrorLog, {input})
    );
  } catch (error) {
    console.error(
      'error logging error.. this is kind of ironic -> ',
      {error, auth},
      error
    );
=======
  if (!location.origin.includes('localhost')) {
    try {
      const input: CreateErrorLogInput = {
        authID: auth.authId,
        email: auth.email,
        error: error?.toString() || 'Invalid error',
        errorType: additionalInfo?.toString() || 'Invalid error type',
        errorTime: new Date().toISOString(),
        pageUrl: location.href,
        componentName: componentName
      };
      const res = await API.graphql(
        graphqlOperation(customMutations.createErrorLog, {input})
      );
    } catch (error) {
      console.error(
        'error logging error.. this is kind of ironic -> ',
        {error, auth},
        error
      );
    }
  } else {
    console.error(error);
>>>>>>> 8dc28e996ede8ecbb7700715c44b9175d8455fbf
  }
};
