import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import {formatPageName} from '@components/Dashboard/Admin/UserManagement/List';
import {setPageTitle, withZoiqFilter} from '@utilities/functions';
import {CreateDicitionaryInput, CreateErrorLogInput, UserPageState} from 'API';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as customMutations from 'customGraphql/customMutations';
import {setLocalStorageData} from '@utilities/localStorage';
import {isEmpty} from 'lodash';
import {v4 as uuidV4} from 'uuid';
import {allowedAuthIds} from '@contexts/GlobalContext';

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

  if (auth.pageState !== pageState && Boolean(auth?.email && auth?.authId)) {
    try {
      const input = {
        authId: auth.authId,
        email: auth.email,
        pageState: pageState,
        lastPageStateUpdate: new Date().toISOString()
      };
      await API.graphql(graphqlOperation(customMutations.updatePersonLoginTime, {input}));
      onSuccessCallback && onSuccessCallback();
    } catch (error) {
      logError(error, {authId: auth.authId, email: auth.email}, 'updatePageState');
      console.error('error updating page -> ', {pageState, auth}, error);
    }
  }
};

export const logError = async (
  error: any,
  auth: {authId: string; email: string},
  componentName: string,
  additionalInfo?: any
) => {
  // if (!location.origin.includes('localhost')) {
  try {
    const input: CreateErrorLogInput = {
      authID: auth.authId,
      email: auth.email,
      error: JSON.stringify(error?.stack) || JSON.stringify(error) || 'Invalid error',
      errorType: JSON.stringify(additionalInfo) || 'Invalid error type',
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
  // } else {
  //   console.error(error);
  // }
};

export const addNewDictionary = async (formData: CreateDicitionaryInput) => {
  try {
    const input: CreateDicitionaryInput = {
      authID: formData.authID,
      email: formData.email,
      id: uuidV4(),
      englishPhrase: formData.englishPhrase,
      englishDefinition: formData.englishDefinition,
      englishAudio: Boolean(formData?.englishAudio) ? formData.englishAudio : '',
      translation: isEmpty(formData.translation) ? [] : formData.translation
    };

    const res: any = await API.graphql(
      graphqlOperation(mutations.createDicitionary, {input})
    );
  } catch (error) {
    console.error(error);
    logError(
      error,
      {authId: formData.authID, email: formData.email},
      'functions @addNewDictionary'
    );
  } finally {
  }
};

export const getDictionaries = async () => {
  try {
    const res: any = await API.graphql(graphqlOperation(queries.listDicitionaries));

    const data = res.data.listDicitionaries.items;
    if (data && data.length > 0) {
      setLocalStorageData('dictionaries', data);
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  } finally {
  }
};

export const checkUniqRoomName = async (
  instituteId: string,
  roomName: string,
  authId: string
) => {
  try {
    const zoiqFilter = allowedAuthIds.includes(authId)
      ? []
      : [{isZoiq: {eq: false}}, {isZoiq: {attributeExists: false}}];
    const list: any = await API.graphql(
      graphqlOperation(queries.listRooms, {
        filter: withZoiqFilter(
          {institutionID: {eq: instituteId}, name: {eq: roomName}},
          zoiqFilter
        )
      })
    );
    return list.data.listRooms.items.length === 0 ? true : false;
  } catch (error) {
    console.error(error);
  }
};
