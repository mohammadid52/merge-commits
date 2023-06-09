import {formatPageName} from 'utilities/functions';
import {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {setPageTitle, withZoiqFilter} from '@utilities/functions';
import {setLocalStorageData} from '@utilities/localStorage';
import {CreateDicitionaryInput, CreateErrorLogInput, Person, UserPageState} from 'API';

import {createErrorLog, updatePersonLoginTime} from 'customGraphql/customMutations';
import {
  getAssignedInstitutionToStaff,
  getDashboardDataForCoTeachers,
  getInstitutionsList,
  listCurricula,
  listDicitionaries,
  listQuestionDatas,
  listRooms
} from 'customGraphql/customQueries';
import {createDicitionary, updatePersonLessonsData} from 'graphql/mutations';
import {getPerson as getPersonAPI} from 'graphql/queries';
import {isEmpty} from 'lodash';
import {allowedAuthIds} from 'state/GlobalState';
import {v4 as uuidV4} from 'uuid';
import {getUniqItems} from '@utilities/strings';
import {SEARCH_LIMIT} from '@components/Lesson/constants';

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
      options.onError(error as Error);
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
      await API.graphql(graphqlOperation(updatePersonLoginTime, {input}));
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
    await API.graphql(graphqlOperation(createErrorLog, {input}));
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

    await API.graphql(graphqlOperation(createDicitionary, {input}));
  } catch (error) {
    console.error(error);
    logError(
      error,
      {authId: formData.authID, email: formData.email},
      'functions @addNewDictionary'
    );
  }
};

export const getDictionaries = async () => {
  try {
    const res: any = await API.graphql(graphqlOperation(listDicitionaries));

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
  }
};

const zoiqFilter = (authId: string) =>
  allowedAuthIds.includes(authId) ? [] : [{isZoiq: {ne: true}}];

export const checkUniqRoomName = async (
  instituteId: string,
  roomName: string,
  authId: string
): Promise<boolean> => {
  try {
    const list: any = await API.graphql(
      graphqlOperation(listRooms, {
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
    let institutions: any = await API.graphql(
      graphqlOperation(getInstitutionsList, {
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
  }
};

export const getInstitutionList = async (authId: string, email: string) => {
  try {
    const list: any = await API.graphql(
      graphqlOperation(listInstitutions, {filter: withZoiqFilter({})})
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
  if (email && authId) {
    let userInfo: any = await API.graphql(
      graphqlOperation(getPersonAPI, {email, authId})
    );
    userInfo = userInfo.data.getPerson;
    return userInfo;
  }
}

export async function getInstInfo(authId: string) {
  try {
    let instInfo: any = {};

    instInfo = await API.graphql(
      graphqlOperation(getAssignedInstitutionToStaff, {
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
    await API.graphql(graphqlOperation(updatePersonLoginTime, {input}));
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
      graphqlOperation(listCurricula, {
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
      graphqlOperation(getDashboardData, {
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
      graphqlOperation(getDashboardDataForTeachers, {
        filter: {teacherAuthID: {eq: authId}}
      })
    );
    const assignedRoomsAsCoTeacher: any = await API.graphql(
      graphqlOperation(getDashboardDataForCoTeachers, {
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
      graphqlOperation(updatePersonLessonsData, {
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

export const getUserCheckpoints = (person: Person) => {
  let studentClasses: any = person.classes?.items.map((item: any) => item?.class);
  studentClasses = studentClasses.filter((d: any) => d !== null);

  const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
    if (item?.room) {
      return [...roomAcc, item.room];
    } else {
      return roomAcc;
    }
  }, []);

  const studentCurriculars: any = studentRooms
    .map((item: any) => item?.curricula?.items)
    .flat(1);

  const uniqCurriculars: any =
    studentCurriculars.length > 0
      ? getUniqItems(
          studentCurriculars.filter((d: any) => d !== null),
          'curriculumID'
        )
      : [];

  const studCurriCheckp: any =
    uniqCurriculars.length > 0
      ? uniqCurriculars
          .map((item: any) => item?.curriculum?.checkpoints?.items)
          .flat(1)
          .filter(Boolean)
      : [];

  const studentCheckpoints: any =
    studCurriCheckp.length > 0
      ? studCurriCheckp.map((item: any) => item?.checkpoint)
      : [];

  const sCheckpoints: any[] = [];

  studentCheckpoints.forEach((item: any) => {
    if (item && item.scope !== 'private') sCheckpoints.push(item);
  });

  const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');

  const sortedCheckpointQ = uniqCheckpoints.map((checkpointObj: any) => {
    return {
      ...checkpointObj,
      questions: {
        items: checkpointObj.questionSeq
          ? checkpointObj.questionSeq.map((idStr: string) => {
              return checkpointObj.questions.items.find(
                (questionItem: any) => questionItem.question.id === idStr
              );
            })
          : checkpointObj.questions.items
      }
    };
  });

  const uniqCheckpointIDs: any = sortedCheckpointQ.map((item: any) => item?.id);

  return {
    checkpoints: uniqCheckpoints,
    checkpointIds: uniqCheckpointIDs,
    qids: sortedCheckpointQ
  };
};

export const getQuestionData = async (
  email: string,
  authId: string,
  checkpointIDs: any[]
) => {
  const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
    return {
      checkpointID: {
        eq: item
      }
    };
  });
  const filter = {
    and: [
      {email: {eq: email}},
      {authID: {eq: authId}},
      {syllabusLessonID: {eq: '999999'}},
      {
        or: [...checkpointIDFilter]
      }
    ]
  };
  const results: any = await API.graphql(
    graphqlOperation(listQuestionDatas, {
      limit: SEARCH_LIMIT,
      filter: filter
    })
  );
  const questionData: any = results.data.listQuestionData?.items;
  return questionData;
};
