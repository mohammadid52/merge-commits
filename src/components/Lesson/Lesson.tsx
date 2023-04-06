import useAuth from '@customHooks/useAuth';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import {setPageTitle} from '@utilities/functions';
import {PersonLessonsData, UpdatePersonLessonsDataInput, UserPageState} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  createPersonLessonsData,
  createPersonLocation,
  deletePersonLocation,
  updatePersonLessonsData,
  updatePersonLocation
} from 'customGraphql/customMutations';
import {
  getPersonLessonsData,
  getPersonLocation,
  getUniversalLesson,
  lessonsByType
} from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import {logError, updatePageState} from 'graphql-functions/functions';
import {isEmpty, update} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import LessonApp from './LessonApp';
import SurveyApp from './SurveyApp';
import {SEARCH_LIMIT} from './constants';

export interface ILessonSurveyApp {
  pageStateUpdated: boolean;
  personLoading: boolean;
  personLessonData: PersonLessonsData | null;
  canContinue?: boolean;
  setPersonLessonData?: React.Dispatch<React.SetStateAction<PersonLessonsData | null>>;
  setPersonLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  invokeRequiredField?: () => void;
  updatePageInLocalStorage?: (pageIdx: number) => void;
  validateRequired?: (pageIdx: number) => boolean;
  leaveRoomLocation: (authID: string, email: string) => void;
  getLessonCurrentPage: () => Promise<number>;
  handleMutationOnPageChange: () => Promise<void>;
  resetViewAndShare?: () => void;
  getValidatedPages?: () => {
    page: number;
    isValid: boolean;
  }[];
}

const Lesson = () => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useGlobalContext();
  const {scanLessonAndFindComplicatedWord} = gContext;

  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  // const {notifications} = useNotifications('lesson');
  // const {notifications: inputNotifications} = useNotifications('input');

  const urlParams: any = useParams();

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //
  const [loaded, setLoaded] = useState<boolean>(false);

  const getSyllabusLesson = async (lessonID?: string) => {
    try {
      const universalLesson: any = await API.graphql(
        graphqlOperation(getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      setPageTitle(response?.title);
      if (response) {
        const lessonPlan = response.lessonPlan.reduce((acc: any[], page: any) => {
          return [
            ...acc,
            {
              id: page.id,
              label: page.label
            }
          ];
        }, []);

        const updatedLessonPlan = scanLessonAndFindComplicatedWord(response.lessonPlan);

        setLocalStorageData('lesson_plan', lessonPlan);
        lessonDispatch({
          type: 'SET_LESSON_DATA',
          payload: {...response, lessonPlan: updatedLessonPlan}
        });

        setLoaded(true);
      }
    } catch (error) {
      setLoaded(false);
      logError(error, {authId, email}, 'Lesson @getSyllabusLesson', error.toString());

      console.error('error getting lesson - ', lessonID, ' ', error);
    }
  };

  const {lessonID} = urlParams;

  useEffect(() => {
    if (lessonID) {
      lessonDispatch({
        type: 'SET_INITIAL_STATE',
        payload: {universalLessonID: lessonID}
      });
      getSyllabusLesson(lessonID).then((_: void) => {
        //
      });
    }
  }, []);

  const [personLessonData, setPersonLessonData] = useState<PersonLessonsData | null>(
    null
  );

  const [personLoading, setPersonLoading] = useState(true);

  const [pageStateUpdated, setPageStateUpdated] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const PAGES = lessonState.lessonData.lessonPlan;

  useEffect(() => {
    if (!personLoading && !pageStateUpdated) {
      const pages = personLessonData?.pages || '{}';
      const lessonProgress = JSON.parse(pages)?.lessonProgress || 0;

      if (PAGES) {
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonProgress > PAGES.length - 1 ? 0 : lessonProgress
        });
        setPageStateUpdated(true);
        history.push(`${match.url}/${lessonProgress}`);
      }
    }
  }, [personLoading, personLessonData, PAGES]);
  const [listPersonData, setListPersonData] = useState<any[]>([]);

  const data: PersonLessonsData[] = getLocalStorageData('lessonPersonData');

  useEffect(() => {
    setListPersonData(data);
    if (isEmpty(personLessonData)) {
      if (data && data?.length > 0) {
        const _personLessonData = data.find(
          (d: PersonLessonsData) => d.lessonID === lessonID
        );

        _personLessonData && setPersonLessonData(_personLessonData);
      }
      setPersonLoading(false);
    }
  }, []);

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  const invokeRequiredField = () => {
    const domID = getFirstEmptyFieldDomId();
    if (domID && typeof domID === 'string') {
      const domElement = document.getElementById(`${domID}_for_error`);
      if (domElement) {
        domElement.scrollIntoView({behavior: 'smooth', block: 'center'});
        domElement.classList.add('blink-error');
      }
    }
  };

  const validateRequired = (pageIdx: number) => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData || [];
      const thisPageRequired = lessonState?.requiredInputs[pageIdx] || [];

      if (thisPageData && thisPageData.length > 0) {
        // @ts-ignore
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });

        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  // create an object for all pages and setisvalid to false for each page if there are required fields

  const getValidatedPages = () => {
    if (PAGES) {
      let allPageValidations: any = [];
      PAGES.forEach((_: any, idx: number) => {
        const isValid = validateRequired(idx);

        // if previous index was invalid set current to invalid
        if (idx > 0) {
          const previousPageValidation = allPageValidations[idx - 1];
          if (!previousPageValidation.isValid) {
            allPageValidations.push({page: idx, isValid: false});
          }
        }
        // don't push if page number already exists in allPageValidations
        if (allPageValidations[idx]) {
          return;
        }

        allPageValidations.push({page: idx, isValid: isValid});
      });

      return allPageValidations;
    }
  };

  const getFirstEmptyFieldDomId = (): any => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData || [];
      const thisPageRequired = lessonState?.requiredInputs[lessonState.currentPage] || [];

      if (thisPageData && thisPageData.length > 0) {
        // @ts-ignore
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });

        if (areAnyEmpty.length > 0) {
          lessonDispatch({type: 'SET_IS_VALID', payload: {isValid: false}});
          // @ts-ignore
          return areAnyEmpty[0].domID;
        } else {
          lessonDispatch({type: 'SET_IS_VALID', payload: {isValid: true}});
          return true;
        }
      } else {
        lessonDispatch({type: 'SET_IS_VALID', payload: {isValid: true}});
        return true;
      }
    } else {
      lessonDispatch({type: 'SET_IS_VALID', payload: {isValid: false}});
      return false;
    }
  };

  const canContinue = () => {
    if (PAGES) {
      const isValid =
        validateRequired(lessonState.currentPage) &&
        lessonState.currentPage <= PAGES.length - 1;

      return isValid;
    } else {
      return false;
    }
  };

  const updatePageInLocalStorage = (page: number): void => {
    if (personLessonData) {
      let updatedPage = `{
        "currentPage":${page},
        "totalPages":${JSON.stringify(lessonState.lessonData?.lessonPlan?.length - 1)},
        "lessonProgress":${page}
      }`
        .replace(/(\s\s+|[\t\n])/g, ' ')
        .trim();

      if (listPersonData) {
        const idx = listPersonData.findIndex(
          (d: any) => d && d?.id === personLessonData.id
        );
        if (idx === -1) return;
        let test = update(listPersonData[idx], 'pages', () => updatedPage);
        const updatedData = listPersonData.splice(idx, 1, test);
        setLocalStorageData('lessonPersonData', updatedData);
      }
    }
  };

  const getLessonCurrentPage = async () => {
    try {
      let pages: any = '{}';
      if (personLessonData !== null && personLessonData !== undefined) {
        pages = personLessonData.pages;
      } else {
        if (personLessonData !== null && personLessonData !== undefined) {
          if (personLessonData) {
            const getLessonRatingDetails: any = await API.graphql(
              graphqlOperation(getPersonLessonsData, {
                // @ts-ignore
                id: personLessonData?.id || ''
              })
            );
            pages = getLessonRatingDetails.data.getPersonLessonsData.pages;
          }
        }
      }

      const currentPage = JSON.parse(pages)?.currentPage || 0;
      return currentPage;
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'Lesson @getLessonCurrentPage', 'CONFIGURATION');
    }
  };

  const [getted, setGetted] = useState(false);
  const [_, setCleared] = useState(false);
  const [created, setCreated] = useState(false);

  const getLocationData = getLocalStorageData('person_location');

  const {authId, email, pageState} = useAuth();

  const [personLocationObj, setPersonLocationObj] = useState<any>({
    id: '',
    personAuthID: '',
    personEmail: '',
    lessonID: '',
    syllabusLessonID: '',
    roomID: '',
    currentLocation: '',
    lessonProgress: ''
  });

  // ~~~~~~~~~~~~~~~~ 1 INIT ~~~~~~~~~~~~~~~ //

  useEffect(() => {
    if (!isInitialized) {
      initializeLocation();
      setIsInitialized(true);
    }
  }, [lessonState.lessonData.id]);

  // ~~~~~~~~~~~~ 2 PAGE CHANGE ~~~~~~~~~~~~ //

  useEffect(() => {
    if (created && lessonState.currentPage >= 0) {
      const pageChangeLocation = {
        ...getLocationData,
        currentLocation: lessonState.currentPage,
        lessonProgress: lessonState.lessonProgress
      };
      setPersonLocationObj(pageChangeLocation);
      updatePersonLocationFn(pageChangeLocation);
      setLocalStorageData('person_location', pageChangeLocation);
      //@ts-ignore
    }
  }, [created, lessonState.currentPage]);

  const [isInitialized, setIsInitialized] = useState(false);

  const initializeLocation = async () => {
    if (!getted) {
      const getLocation = await getPersonLocationFn();

      if (getLocation === undefined || getLocation === null) {
        await createPersonLocationFn();
      } else {
        if (getLocation.lessonID === lessonID) {
          await updatePersonLocationFn(getLocation);
        } else {
          await leaveRoomLocation(authId, email);
          await createPersonLocationFn();
        }
      }
    }
  };

  const getPersonLocationFn = async () => {
    try {
      const getUserLocation: any = await API.graphql(
        graphqlOperation(getPersonLocation, {
          personEmail: email,
          personAuthID: authId
        })
      );
      const response = getUserLocation.data.getPersonLocation;

      return response;
    } catch (error) {
      console.error('createPersonLocation - ', error);
      logError(error, {authId, email}, 'Lesson @getPersonLocation', error.toString());
    } finally {
      setGetted(true);
    }
  };

  const getRoomData = getLocalStorageData('room_info');

  const [isPageUpdatedOnPersonTable, setIsPageUpdatedOnPersonTable] = useState(false);

  useEffect(() => {
    if (!isPageUpdatedOnPersonTable) {
      updatePageState(
        UserPageState.LESSON,
        {
          authId: authId,
          email: email,
          pageState
        },
        () => setIsPageUpdatedOnPersonTable(true)
      );
    }
  }, [isPageUpdatedOnPersonTable]);

  const createPersonLocationFn = async () => {
    const {lessonID} = urlParams;

    const currentPageLocation = await getLessonCurrentPage();
    const newLocation = {
      personAuthID: authId,
      personEmail: email,
      syllabusLessonID: getRoomData.activeSyllabus,
      lessonID: lessonID,
      roomID: getRoomData.id,
      currentLocation: currentPageLocation,
      lessonProgress: '0'
    };
    try {
      const newUserLocation: any = await API.graphql(
        graphqlOperation(createPersonLocation, {
          input: newLocation
        })
      );
      const response = newUserLocation.data.createPersonLocation;

      const newLocationObj = {
        ...newLocation,
        id: response.id
      };
      setPersonLocationObj(newLocationObj);
      setLocalStorageData('person_location', newLocationObj);
    } catch (error) {
      if (error.errorType === 'DynamoDB:ConditionalCheckFailedException') {
        return;
      }
      logError(error, {authId, email}, 'Lesson @createPersonLocation', error.toString());

      console.log('createPersonLocation failed', error, newLocation);
    } finally {
      setCreated(true);
    }
  };

  // ~~~~~~~~~~ LOCATION UPDATING ~~~~~~~~~~ //

  const updatePersonLocationFn = async (updatedLocationObj: any) => {
    const currentPageLocation = await getLessonCurrentPage();
    const locationUpdateProps = {
      id: updatedLocationObj.id,
      personAuthID: updatedLocationObj.personAuthID,
      personEmail: updatedLocationObj.personEmail,
      lessonID: updatedLocationObj.lessonID,
      syllabusLessonID: updatedLocationObj.syllabusLessonID,
      roomID: updatedLocationObj.roomID,
      currentLocation: currentPageLocation,
      lessonProgress: updatedLocationObj.lessonProgress
    };

    try {
      await API.graphql(
        graphqlOperation(updatePersonLocation, {
          input: locationUpdateProps
        })
      );

      setPersonLocationObj(locationUpdateProps);
      setLocalStorageData('person_location', locationUpdateProps);
    } catch (e) {
      if (e.errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
        console.log('no existing person location object found.. creating new... ');
        createPersonLocationFn();
      } else {
        logError(e, {authId, email}, 'Lesson @updatePersonLocation', e.toString());
        console.error('updatePersonLocation - ', e, locationUpdateProps);
      }
    }
  };

  const leaveRoomLocation = async (inputAuthId: string, inputEmail: string) => {
    try {
      await API.graphql(
        graphqlOperation(deletePersonLocation, {
          input: {
            personEmail: inputEmail,
            personAuthID: inputAuthId
          }
        })
      );
      updatePageState(UserPageState.CLASS, {
        authId: authId,
        email: email,
        pageState
      });
    } catch (e) {
      logError(e, {authId, email}, 'Lesson @leaveRoomLocation', e.toString());

      console.error('error deleting location record - ', e);
    } finally {
      setCleared(true);
    }
  };

  const subscribeToLocation = () => {
    const personLocationSub = API.graphql(
      graphqlOperation(customSubscriptions.onUpdatePerson, {
        authId: authId
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onUpdatePerson;

        if (updatedStudent) {
          if (updatedStudent.authId === authId && updatedStudent.status === 'INACTIVE') {
            leaveRoomLocation(authId, email);

            updatePageState(
              UserPageState.DASHBOARD,
              {
                pageState: UserPageState.LESSON,
                authId: authId,
                email: email
              },
              () => {
                history.push('/dashboard');
              }
            );
          }
        }
      }
    });
    return personLocationSub;
  };

  let subscribe: any;
  useEffect(() => {
    if (authId) {
      subscribe = subscribeToLocation();
    }
    return () => {
      subscribe.unsubscribe();
    };
  }, []);

  const getUpdatedPagesData = () =>
    `{
  "currentPage":${JSON.stringify(lessonState.currentPage)},
  "totalPages":${JSON.stringify(lessonState.lessonData?.lessonPlan?.length - 1)},
  "lessonProgress":${JSON.stringify(lessonState.currentPage)}
  }`
      .replace(/(\s\s+|[\t\n])/g, ' ')
      .trim();

  const commonPersonLessonPayload = {
    studentAuthID: authId,
    roomId: getRoomData.id,
    studentEmail: email,
    lessonID: lessonID,
    lessonType: lessonState.lessonData?.type,

    pages: getUpdatedPagesData()
  };
  const createPersonLessonPayload: UpdatePersonLessonsDataInput = {
    ...commonPersonLessonPayload,
    id: uuidV4(),
    ratings: 0
  };
  const updatePersonLessonPayload: UpdatePersonLessonsDataInput = {
    ...commonPersonLessonPayload,
    id: personLessonData?.id || ''
  };

  const createPersonLessonsDataFn = async () => {
    const result: any = await API.graphql(
      graphqlOperation(createPersonLessonsData, {
        input: createPersonLessonPayload
      })
    );
    setPersonLessonData(result?.data?.createPersonLessonsData);
  };

  const fetchLessonPersonData = async () => {
    try {
      setPersonLoading(true);
      const lessonPersonData: any = await API.graphql(
        graphqlOperation(lessonsByType, {
          filter: {
            roomId: {eq: getRoomData.id},
            studentAuthID: {eq: authId},
            studentEmail: {eq: email}
          },
          limit: SEARCH_LIMIT
        })
      );

      const data = lessonPersonData?.data?.listPersonLessonsData?.items || [];
      setLocalStorageData('lessonPersonData', data);
      const _personLessonData = data.find((d: any) => d.lessonID === lessonID);
      if (_personLessonData) {
        setPersonLessonData(_personLessonData);
      } else {
        await createPersonLessonsDataFn();
      }
    } catch (e) {
      logError(e, {authId, email}, 'Lesson @fetchLessonPersonData', e.toString());

      console.error('listLessonPersonData: ', e);
    } finally {
      setPersonLoading(false);
    }
  };

  const handleMutationOnPageChange = async () => {
    try {
      if (!personLoading) {
        if (!personLessonData) {
          fetchLessonPersonData();
        } else if (personLessonData) {
          await API.graphql(
            graphqlOperation(updatePersonLessonsData, {
              input: updatePersonLessonPayload
            })
          );
          const updatedLocationObj = {
            ...getLocationData,
            currentLocation: lessonState.currentPage,
            lessonProgress: lessonState.currentPage
          };

          if (updatedLocationObj?.id) {
            updatePersonLocationFn(updatedLocationObj);

            setLocalStorageData('person_location', updatedLocationObj);
          } else {
            console.error('No ID for person location', personLocationObj);
          }
        }
      }
    } catch (error) {
      logError(
        error,
        {authId, email},
        'Lesson @handleMutationOnPageChange',
        error.toString()
      );

      console.error(
        '🚀 ~ file: SurveyApp.tsx ~ line 652 ~ handleSurveyMutateData ~ error',
        error
      );
    }
  };

  const props = {
    personLessonData,
    invokeRequiredField,
    setPersonLessonData,
    personLoading,
    canContinue: canContinue(),
    validateRequired,
    setPersonLoading,
    pageStateUpdated,
    updatePageInLocalStorage,
    leaveRoomLocation,
    getLessonCurrentPage,
    getValidatedPages,
    handleMutationOnPageChange
  };

  return (
    <>
      {/* <Noticebar notifications={[..._inputNotifications, ..._notifications]} /> */}
      {loaded ? isSurvey ? <SurveyApp {...props} /> : <LessonApp {...props} /> : null}
    </>
  );
};

export default React.memo(Lesson);
