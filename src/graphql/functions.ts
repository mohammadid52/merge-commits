import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import {UserPageState} from 'API';
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
  if (auth.pageState !== pageState) {
    try {
      const input = {
        authId: auth.authId,
        email: auth.email,
        pageState: pageState
      };
      const res = await API.graphql(
        graphqlOperation(customMutations.updatePersonLoginTime, {input})
      );
      console.log(res);
      onSuccessCallback && onSuccessCallback();
    } catch (error) {
      console.error('error updating page -> ', {pageState, auth}, error);
    }
  }
};
