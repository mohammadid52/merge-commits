import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {formatPageName} from '@components/Dashboard/Admin/UserManagement/List';
import {allowedAuthIds} from '@contexts/GlobalContext';
import {setPageTitle, withZoiqFilter} from '@utilities/functions';
import {setLocalStorageData} from '@utilities/localStorage';
import {CreateDicitionaryInput, CreateErrorLogInput, UserPageState} from 'API';
import {Auth, Storage} from 'aws-amplify';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {isEmpty} from 'lodash';
import {v4 as uuidV4} from 'uuid';

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
      contentEncoding: 'base64',
      progressCallback: ({loaded, total}: any) => {
        const progress = (loaded * 100) / total;
        options?.progressCallback?.({progress, loaded, total});
      }
    });

    if (options && options?.onSuccess && typeof options?.onSuccess === 'function') {
      options.onSuccess(result);
    }
    return result;
  } catch (error) {
    if (options?.auth) {
      logError(
        error,
        {authId: options?.auth?.authId, email: options?.auth?.email},
        'uploadImageToS3'
      );
    }
    if (options && options?.onError && typeof options?.onError === 'function') {
      // if there is a error callback, call the onError function
      options.onError(error);
    } else {
      // otherwise throw the error to console
      console.error(error);
    }

    return '';
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
    await API.graphql(graphqlOperation(customMutations.createErrorLog, {input}));
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

    await API.graphql(graphqlOperation(mutations.createDicitionary, {input}));
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

const zoiqFilter = (authId: string) =>
  allowedAuthIds.includes(authId) ? [] : [{isZoiq: {ne: true}}];

export const checkUniqRoomName = async (
  instituteId: string,
  roomName: string,
  authId: string
) => {
  try {
    const list: any = await API.graphql(
      graphqlOperation(queries.listRooms, {
        filter: withZoiqFilter(
          {institutionID: {eq: instituteId}, name: {eq: roomName}},
          zoiqFilter(authId)
        )
      })
    );
    return list.data.listRooms.items.length === 0 ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const listInstitutions = async (authId: string, email: string) => {
  try {
    // setInstitutionsLoading(true);
    let institutions: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionsList, {
        filter: withZoiqFilter({}, zoiqFilter(authId))
      })
    );
    institutions = institutions?.data.listInstitutions?.items || [];
    institutions = institutions.map((inst: any) => {
      return {
        id: inst.id,
        label: inst.name,
        value: inst.name
      };
    });
    return institutions;
  } catch (error) {
    logError(error, {authId, email}, 'functions @listInstitutions');
    console.error('🚀 ~ file: Csv.tsx ~ line 122 ~ listInstitutions ~ error', error);
  } finally {
    // setInstitutionsLoading(false);
  }
};

export const getInstitutionList = async (authId: string, email: string) => {
  try {
    const list: any = await API.graphql(
      graphqlOperation(queries.listInstitutions, {filter: withZoiqFilter({})})
    );
    const sortedList = list.data.listInstitutions?.items.sort((a: any, b: any) =>
      a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
    );
    const InstituteList = sortedList.map((item: any) => ({
      id: item.id,
      name: `${item.name ? item.name : ''}`,
      value: `${item.name ? item.name : ''}`
    }));

    return InstituteList;
  } catch (error) {
    logError(error, {authId, email}, 'functions @getInstitutionList');
    console.log('🚀 ~ file: functions.ts:261 ~ getInstitutionList ~ error', error);
  }
};

export async function getPerson(email: string, authId: string) {
  let userInfo: any = await API.graphql(
    graphqlOperation(queries.getPerson, {email, authId})
  );
  userInfo = userInfo.data.getPerson;
  return userInfo;
}

export async function getInstInfo(authId: string) {
  try {
    let instInfo: any = {};

    instInfo = await API.graphql(
      graphqlOperation(customQueries.getAssignedInstitutionToStaff, {
        filter: {staffAuthID: {eq: authId}}
      })
    );

    return instInfo;
  } catch (error) {
    console.error(error);
  }
}

export async function updateLoginTime(id: string, authId: string, email: string) {
  try {
    const time = new Date().toISOString();
    const input = {
      id: id,
      authId: authId,
      email: email,
      lastLoggedIn: time,
      lastPageStateUpdate: time,
      pageState: UserPageState.LOGGED_IN
    };
    await API.graphql(graphqlOperation(customMutations.updatePersonLoginTime, {input}));
  } catch (error) {
    console.error(error);
  }
}

export async function signIn(
  username: string,
  password: string,
  cookies: {setCookie: any; removeCookie: any}
) {
  const user = await Auth.signIn(username, password);

  cookies.setCookie(
    'auth',
    {email: username, authId: user.username},
    {secure: false, path: '/'}
  );
  sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
  return user;
}

export const checkUniqCurricularName = async (instId: string, name: string) => {
  try {
    const list: any = await API.graphql(
      graphqlOperation(queries.listCurricula, {
        filter: {
          institutionID: {eq: instId},
          name: {eq: name}
        }
      })
    );
    return list.data.listCurricula.items.length === 0 ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getDashboardData = async (authId: string, email: string) => {
  try {
    const dashboardDataFetch: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardData, {
        authId: authId,
        email: email
      })
    );

    // @ts-ignore
    let arrayOfResponseObjects =
      (await dashboardDataFetch?.data?.getPerson?.classes?.items) || [];

    if (arrayOfResponseObjects && arrayOfResponseObjects.length) {
      arrayOfResponseObjects = arrayOfResponseObjects.filter(
        (item: any) => item.class !== null
      );
    }

    return arrayOfResponseObjects;
  } catch (error) {
    logError(error, {authId: authId, email: email}, 'Dashboard @getDashboardData');

    console.error('getDashbaordData -> ', error);
  }
};

const getDashboardDataForTeachers = async (authId: string, email: string) => {
  try {
    const dashboardDataFetch: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardDataForTeachers, {
        filter: {teacherAuthID: {eq: authId}}
      })
    );
    const assignedRoomsAsCoTeacher: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
        filter: {teacherAuthID: {eq: authId}}
      })
    );
    const response = await dashboardDataFetch;
    let arrayOfResponseObjects = [
      ...response?.data?.listRooms?.items,
      ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items?.map((item: any) => ({
        ...item,
        ...item.room,
        teacher: item.room?.teacher
      }))
    ];
    arrayOfResponseObjects = arrayOfResponseObjects.map(() => {
      return {class: {rooms: {items: arrayOfResponseObjects}}};
    });

    return arrayOfResponseObjects;
  } catch (error) {
    logError(
      error,
      {authId: authId, email: email},
      'Dashboard @getDashboardDataForTeachers'
    );
    console.error('getDashboardDataForTeachers -> ', error);
    return [];
  }
};

export const dashboardFunctions = {getDashboardData, getDashboardDataForTeachers};

export const handleLessonMutationRating = async (
  id: string,
  lessonID: string,
  ratingValue: string
) => {
  try {
    await API.graphql(
      graphqlOperation(mutations.updatePersonLessonsData, {
        input: {
          id,
          lessonID: lessonID,
          ratings: ratingValue
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};
