import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import 'components/Dashboard/GameChangers/styles/Flickity.scss';
import 'components/Dashboard/GameChangers/styles/GameChanger.scss';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentExerciseData,
  StudentPageInput,
  UniversalJournalData,
  UniversalLessonPage,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import ErrorBoundary from '../Error/ErrorBoundary';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import {ILessonSurveyApp} from './Lesson';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import {
  UniversalLessonStudentData as UniversalLessonStudentDataFromAPI,
  UpdateUniversalJournalDataInput
} from 'API';
import useAuth from '@customHooks/useAuth';
const LessonApp = ({getSyllabusLesson}: ILessonSurveyApp) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //

  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const displayData = gContext.lessonState.displayData;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  const history = useHistory();
  const match = useRouteMatch();

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const getRoomData = getLocalStorageData('room_info');
  const urlParams: any = useParams();
  const {lessonID} = urlParams;
  const isOnDemand = user.onDemand;

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const [overlay, setOverlay] = useState<string>('');
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);

  const [allUniversalJournalData, setAllUniversalJournalData] = useState<
    UniversalJournalData[]
  >([]);

  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  const topLessonRef = useRef();

  // ##################################################################### //
  // ######################### SUBSCRIPTION SETUP ######################## //
  // ##################################################################### //

  let subscription: any;
  const [subscriptionData, setSubscriptionData] = useState<any>();

  // ----------- 1 ---------- //

  // ----------- 2 ---------- //
  //  UPDATE CONTEXT WITH SUBSCRIPTION DATA  //

  const subscribeToRoom = () => {
    const roomSubscription = API.graphql(
      graphqlOperation(customSubscriptions.onChangeRoom, {id: getRoomData.id})
      // @ts-ignore
    ).subscribe({
      next: (roomData: any) => {
        const updatedRoomData = roomData.value.data.onChangeRoom;

        setSubscriptionData(updatedRoomData);
      }
    });

    return roomSubscription;
  };

  // ----------- 3 ---------- //

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    setLocalStorageData('room_info', {
      ...getRoomData,
      ClosedPages: subscriptionData.ClosedPages
    });
    lessonDispatch({type: 'SET_ROOM_SUBSCRIPTION_DATA', payload: subscriptionData});
  };

  // ----------- 4 ---------- //
  /**
   * Once step 2 updates subscriptionData,
   * this useEffect will invoke the function
   * at step 3
   *
   */

  useEffect(() => {
    if (subscriptionData) {
      updateOnIncomingSubscriptionData(subscriptionData);
    }
  }, [subscriptionData]);

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    const leaveUnload = () => {
      const leaveRoom = leaveRoomLocation(user?.authId, user?.email);
      Promise.resolve(leaveRoom).then((_: void) => {
        if (subscription) {
          subscription.unsubscribe();
        }
        lessonDispatch({type: 'CLEANUP'});
      });
    };

    console.log('lesson loaded....');

    return () => {
      leaveUnload();
    };
  }, []);

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //

  // ~~~~~~~~~~~~~~~ GET ROOM ~~~~~~~~~~~~~~ //

  const getRoomSetup = async (roomID: string) => {
    try {
      const initialRoomSetup = await API.graphql(
        graphqlOperation(customQueries.getRoomSetup, {id: roomID})
      );
      //@ts-ignore
      const response = initialRoomSetup.data.getRoom;
      setSubscriptionData(response);
    } catch (e) {
      console.error('error gettingRoom - ', e);
    }
  };

  // ~~~~~~~~~~~~~ LESSON SETUP ~~~~~~~~~~~~ //

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);
  const {lessonData, misc} = lessonState;

  const [pageStateUpdated, setPageStateUpdated] = useState(false);

  useEffect(() => {
    if (
      misc?.personLessonData &&
      misc?.personLessonData?.lessonID &&
      misc?.personLessonData?.lessonID === lessonData?.id
    ) {
      const data = misc?.personLessonData?.data[0];

      const pages = data?.pages || '{}';
      const lessonProgress = JSON.parse(pages).lessonProgress || 0;

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: lessonProgress});
      setLessonDataLoaded(true);
      setPageStateUpdated(true);
      history.push(`${match.url}/${lessonProgress}`);
    }
  }, [lessonData.id, misc?.personLessonData]);

  useEffect(() => {
    if (lessonState.lessonData && lessonState.lessonData.id) {
      setLessonDataLoaded(true);

      // Initialize closed pages based on room-configuration

      if (
        !isOnDemand &&
        lessonState.lessonData.lessonPlan &&
        lessonState.lessonData.lessonPlan?.length > 0
      ) {
        getRoomSetup(getRoomData.id);
        subscription = subscribeToRoom();
      }
    }
  }, [lessonState.lessonData.id]);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //

  const initializeStudentData = async () => {
    if (studentDataInitialized === false && PAGES) {
      const mappedPages = PAGES.reduce(
        (
          inputs: {
            required: any[];
            initialized: any[];
            exercises: any[];
          },
          page: UniversalLessonPage
        ) => {
          const pageParts = page.pageContent;

          const reducedPageInputs = pageParts.reduce(
            (
              pageInputsAcc: {
                requiredIdAcc: string[];
                pageInputAcc: StudentPageInput[];
                pageExerciseAcc: any[];
              },
              pagePart: PagePart
            ) => {
              if (pagePart.hasOwnProperty('partContent')) {
                const partInputs = pagePart.partContent.reduce(
                  (
                    partInputAcc: {
                      requiredIdAcc: string[];
                      pageInputAcc: any[];
                      pageExerciseAcc: any[];
                    },
                    partContent: PartContent
                  ) => {
                    //  CHECK WHICH INPUT TYPE  //
                    const isForm = /form/g.test(partContent.type);
                    const isOtherInput = /input/g.test(partContent.type);
                    const isExercise = /exercise/g.test(partContent.type);

                    // -------- IF FORM ------- //
                    if (isForm) {
                      const formSubInputs = partContent.value.reduce(
                        (
                          subPartAcc: {reqId: string[]; pgInput: any[]},
                          partContentSub: PartContentSub
                        ) => {
                          return {
                            ...subPartAcc,
                            reqId: partContentSub.isRequired
                              ? [...subPartAcc.reqId, partContentSub.id]
                              : subPartAcc.reqId,
                            pgInput: [
                              ...subPartAcc.pgInput,
                              {
                                domID: partContentSub.id,
                                input: ['']
                              }
                            ]
                          };
                        },
                        {reqId: [], pgInput: []}
                      );

                      const exerciseObj = {
                        id: partContent.id,
                        entryData: formSubInputs?.pgInput || []
                      };

                      return {
                        requiredIdAcc: [
                          ...partInputAcc.requiredIdAcc,
                          ...formSubInputs.reqId
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput
                        ],
                        pageExerciseAcc: isExercise
                          ? [...partInputAcc.pageExerciseAcc, exerciseObj]
                          : partInputAcc.pageExerciseAcc
                      };
                    }
                    // ---- IF OTHER INPUT ---- //
                    else if (isOtherInput) {
                      return {
                        requiredIdAcc: partContent.isRequired
                          ? [...partInputAcc.requiredIdAcc, partContent.id]
                          : partInputAcc.requiredIdAcc,
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          {
                            domID: partContent.id,
                            input: ['']
                          }
                        ],
                        pageExerciseAcc: partInputAcc.pageExerciseAcc
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  {requiredIdAcc: [], pageInputAcc: [], pageExerciseAcc: []}
                );

                return {
                  requiredIdAcc: [
                    ...pageInputsAcc.requiredIdAcc,
                    ...partInputs.requiredIdAcc
                  ],
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc
                  ],
                  pageExerciseAcc: [
                    ...pageInputsAcc.pageExerciseAcc,
                    ...partInputs.pageExerciseAcc
                  ]
                };
              } else {
                return pageInputsAcc;
              }
            },
            {requiredIdAcc: [], pageInputAcc: [], pageExerciseAcc: []}
          );

          return {
            required: [...inputs.required, reducedPageInputs.requiredIdAcc],
            initialized: [...inputs.initialized, reducedPageInputs.pageInputAcc],
            exercises: [...inputs.exercises, reducedPageInputs.pageExerciseAcc]
          };
        },

        {required: [], initialized: [], exercises: []}
      );

      // console.log('mappedPages - ', mappedPages);

      lessonDispatch({
        type: 'SET_INITIAL_STUDENT_DATA',
        payload: {
          requiredInputs: mappedPages.required,
          studentData: mappedPages.initialized,
          exerciseData: mappedPages.exercises
        }
      });
      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ################# GET OR CREATE STUDENT DATA RECORDS ################ //
  // ##################################################################### //

  // ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
  const studentDataIdArray = (studentDataArray: any[]) => {
    const idArr = studentDataArray
      .reduce((acc: any[], studentDataIdObj: any, idx: number) => {
        const indexOfPage = lessonState?.lessonData?.lessonPlan?.findIndex(
          (lessonPlanPage: UniversalLessonPage) =>
            lessonPlanPage.id === studentDataIdObj.lessonPageID
        );
        const idObj = {
          id: studentDataIdObj.id,
          pageIdx: indexOfPage,
          lessonPageID: studentDataIdObj.lessonPageID,
          update: false
        };
        return [...acc, idObj];
      }, [])
      .sort((dataID1: any, dataID2: any) => {
        if (dataID1.pageIdx < dataID2.pageIdx) {
          return -1;
        }
        if (dataID1.pageIdx > dataID2.pageIdx) {
          return 1;
        }
      });
    return idArr;
  };

  // ~ FILTER/MERGE PAGEDATA & EXERCISEDATA  //
  // ------- FILTERING ------ //
  const filterStudentData = (studentDataIdArray: any[], studentDataArray: any[]) => {
    return studentDataIdArray.reduce(
      (
        acc: {pageData: StudentPageInput[]; exerciseData: StudentExerciseData[]},
        dataIdObj: any
      ) => {
        const findPageData = studentDataArray.find(
          (studentDataIdObj: UniversalLessonStudentData) =>
            studentDataIdObj.id === dataIdObj.id
        )?.pageData;
        const findExerciseData = studentDataArray.find(
          (studentDataIdObj: UniversalLessonStudentData) =>
            studentDataIdObj.id === dataIdObj.id
        )?.exerciseData;

        return {
          pageData: Array.isArray(findPageData)
            ? [...acc.pageData, findPageData]
            : [...acc.pageData, []],
          exerciseData: Array.isArray(findExerciseData)
            ? [...acc.exerciseData, findExerciseData]
            : [...acc.exerciseData, []]
        };
      },
      {
        pageData: [],
        exerciseData: []
      }
    );
  };

  // -------- MERGING ------- //
  const mergedStudentData = (studentDataArray: any[], initStudentDataArray: any[]) => {
    const differenceData = studentDataArray?.reduce(
      //@ts-ignore
      (diffArray: any[], loadedInput: StudentPageInput[] | [], pageIdx: number) => {
        const notYetSavedData = initStudentDataArray[pageIdx]?.reduce(
          (diffPageData: any[], initPageData: any) => {
            const foundInLoaded = loadedInput.find(
              (inputObj: any) => inputObj.domID === initPageData.domID
            );
            if (foundInLoaded) {
              return diffPageData;
            } else {
              return [...diffPageData, initPageData];
            }
          },
          []
        );

        return [...diffArray, [...loadedInput, ...notYetSavedData]];
      },
      []
    );

    return differenceData;
  };

  // ~~~ CHECK AD MERGE NEW EXERCISE DATA ~~ //
  const mergedExerciseData = (exerciseDataArray: any[], initExerciseDataArray: any[]) => {
    const differenceData = exerciseDataArray.reduce(
      //@ts-ignore
      (diffArray: any[], loadedInput: StudentExerciseData[] | [], pageIdx: number) => {
        const notYetSavedData = initExerciseDataArray[pageIdx].reduce(
          (diffExerciseData: any[], initExerciseData: any) => {
            const foundInLoaded = loadedInput.find(
              (inputObj: any) => inputObj.id === initExerciseData.id
            );
            if (foundInLoaded) {
              return diffExerciseData;
            } else {
              return [...diffExerciseData, initExerciseData];
            }
          },
          []
        );

        return [...diffArray, [...loadedInput, ...notYetSavedData]];
      },
      []
    );

    return differenceData;
  };

  // ~~~~~~~~~~ FILTER EXTRA PAGES ~~~~~~~~~ //
  const filterExtraPages = (lessonPlanPages: any[], studentDataRecords: any[]) => {
    const goAhead = typeof studentDataRecords !== 'undefined';
    const extraPagesArray = lessonPlanPages.reduce(
      (extraPageArray: any[], lessonPage: UniversalLessonPage) => {
        const findInStudentDataRecords = goAhead
          ? studentDataRecords.find(
              //@ts-ignore
              (data: UniversalLessonStudentData) => data.lessonPageID === lessonPage.id
            )
          : undefined;
        if (typeof findInStudentDataRecords === 'undefined') {
          return [...extraPageArray, lessonPage];
        } else {
          return extraPageArray;
        }
      },
      []
    );
    const currentLessonRecords = goAhead
      ? studentDataRecords.reduce(
          (currentLessonRecords: any[], studentData: UniversalLessonStudentData) => {
            const isStudentDataFromLesson = lessonPlanPages.find(
              (lessonPage: UniversalLessonPage) =>
                //@ts-ignore
                lessonPage.id === studentData.lessonPageID
            );
            if (isStudentDataFromLesson !== undefined) {
              return [...currentLessonRecords, studentData];
            } else {
              return currentLessonRecords;
            }
          },
          []
        )
      : [];
    return {
      extraPages: extraPagesArray,
      currentRecords: currentLessonRecords
    };
  };

  // ~~~~~~~ RECORD CREATION FUNTION ~~~~~~~ //
  const loopCreateStudentData = async (
    lessonPages: any[],
    lessonID: string,
    authId: string,
    email: string
  ) => {
    const createdRecords = lessonPages.map(async (lessonPage: any, idx: number) => {
      const indexOfPage = lessonState?.lessonData?.lessonPlan?.findIndex(
        (lessonPlanPage: UniversalLessonPage) => lessonPlanPage.id === lessonPage.id
      );
      const input = {
        id: `${authId}-${getRoomData.id}-${lessonID}-${lessonPage.id}`,
        syllabusLessonID: getRoomData.activeSyllabus,
        lessonID: lessonID,
        lessonPageID: lessonPage.id,
        studentID: authId,
        studentAuthID: authId,
        studentEmail: email,
        roomID: getRoomData.id,
        currentLocation: indexOfPage,
        lessonProgress: '0',
        pageData: lessonState.studentData[indexOfPage],
        hasExerciseData: lessonState.exerciseData[indexOfPage]?.length > 0,
        exerciseData: lessonState.exerciseData[indexOfPage],
        date: new Date().toISOString()
      };

      const newStudentData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalLessonStudentData, {
          input
        })
      );
      const returnedData = newStudentData.data.createUniversalLessonStudentData;
      return returnedData;
    });
    return createdRecords;
  };

  // ~~~~~~~~~~~ THE MAIN FUNTION ~~~~~~~~~~ //
  /******************************************
   * GETS THE PREVIOUSLY SAVED STUDENT DATA *
   * IF THERE IS ANY, AND SETS IT IN STATE  *
   ******************************************/

  const _loopFetchStudentData = async (): Promise<UniversalLessonStudentDataFromAPI[]> =>
    new Promise(async (resolve) => {
      try {
        setLessonDataLoaded(false);
        // fetch by pages

        let result: any = [];

        await Promise.all(
          PAGES.map(async (page: any, idx: number) => {
            let studentData: any = await API.graphql(
              graphqlOperation(queries.getUniversalLessonStudentData, {
                id: `${user.authId}-${getRoomData.id}-${lessonID}-${page.id}`
                // filter: {...filterObj.filter, lessonPageID: {eq: page.id}}
              })
            );

            let studentDataObject = studentData.data.getUniversalLessonStudentData;
            result.push(studentDataObject);
          })
        );

        /**
         * combination of last fetch results
         * && current fetch results
         */

        lessonDispatch({type: 'LESSON_LOADED', payload: true});

        // console.log('no more - ', combined);
        setLessonDataLoaded(true);
        resolve(result);
      } catch (e) {
        console.error('loopFetchStudentData - ', e);
        return [];
      }
    });

  const getOrCreateStudentData = async () => {
    // const syllabusID = getRoomData.activeSyllabus;

    // console.log('getOrCreateData - user - ', user);

    try {
      // const studentData: any = await API.graphql(
      //   graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      // );

      // existing student rowss
      const studentDataRows: UniversalLessonStudentDataFromAPI[] = await (
        await _loopFetchStudentData()
      ).filter(Boolean);

      /**
       * NEW RECORD CREATION LOGIC:
       *   - if no student records for this lesson, make all new records per page
       *   - if student records exist, but an additional page has been added, create records for these pages
       */
      if (
        typeof studentDataRows === 'undefined' ||
        (studentDataRows && studentDataRows?.length === 0)
      ) {
        const createNewRecords = await loopCreateStudentData(
          PAGES,
          lessonID,
          user.authId,
          user.email
        );
        const newRecords = await Promise.all(createNewRecords);
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            studentDataRows,
            dataIdReferences: studentDataIdArray(newRecords)
          }
        });
      } else {
        const filteredData = filterExtraPages(PAGES, studentDataRows);
        const extraPages = filteredData.extraPages;
        const currentStudentData = filteredData.currentRecords;

        if (extraPages?.length > 0 && currentStudentData?.length > 0) {
          const createExtraRecords = await loopCreateStudentData(
            extraPages,
            lessonID,
            user.authId,
            user.email
          );
          const extraRecords = await Promise.all(createExtraRecords);
          const combinedRecords = [...extraRecords, ...currentStudentData];
          const combinedStudentDataIdArray = studentDataIdArray(combinedRecords);
          const filteredData = filterStudentData(
            combinedStudentDataIdArray,
            combinedRecords
          );
          const finalData = mergedStudentData(
            filteredData.pageData,
            lessonState.studentData
          );
          const concatExerciseData = mergedExerciseData(
            filteredData.exerciseData,
            lessonState.exerciseData
          );

          lessonDispatch({
            type: 'LOAD_STUDENT_DATA',
            payload: {
              dataIdReferences: combinedStudentDataIdArray,
              filteredStudentData: finalData,
              filteredExerciseData: concatExerciseData
            }
          });
        } else if (currentStudentData?.length > 0 && extraPages?.length === 0) {
          try {
            const existStudentDataIdArray = studentDataIdArray(currentStudentData);
            const filteredData = filterStudentData(
              existStudentDataIdArray,
              currentStudentData
            );
            const finalData = mergedStudentData(
              filteredData.pageData,
              lessonState.studentData
            );
            const concatExerciseData = mergedExerciseData(
              filteredData.exerciseData,
              lessonState.exerciseData
            );
            // console.log('merged data', finalData);
            lessonDispatch({
              type: 'LOAD_STUDENT_DATA',
              payload: {
                dataIdReferences: existStudentDataIdArray,
                filteredStudentData: finalData,
                filteredExerciseData: concatExerciseData
              }
            });
          } catch (error) {
            console.error('Something wrong when loading student data', error);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ~~ INITIALIZE STUDENT DATA STRUCTURE ~~ //
  useEffect(() => {
    if (
      !lessonState.loaded &&
      lessonState.lessonData.lessonPlan &&
      lessonState.lessonData.lessonPlan.length > 0
    ) {
      initializeStudentData();
    }
  }, [lessonState.lessonData.lessonPlan]);

  // ~~~~~ GET & CREATE DB DATA RECORDS ~~~~ //
  useEffect(() => {
    if (
      !lessonState.loaded &&
      lessonState.studentData &&
      lessonState.studentData?.length === PAGES?.length
    ) {
      getOrCreateStudentData();
    }
  }, [lessonState.studentData]);

  // ##################################################################### //
  // ############### GET OTHER STUDENT SHARED DATA RECORDS ############### //
  // ##################################################################### //

  const getSharedStudentData = async (inputAuthID: string, inputPageID: string) => {
    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: inputAuthID},
          lessonID: {eq: lessonID},
          lessonPageID: {eq: inputPageID},
          roomID: {eq: getRoomData.id}
        }
      };

      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      );
      const studentDataRows = studentData.data.listUniversalLessonStudentData.items || [];

      if (studentDataRows?.length > 0) {
        lessonDispatch({
          type: 'LOAD_STUDENT_SHARE_DATA',
          payload: [...studentDataRows[0].pageData]
        });
      }
    } catch (e) {
      console.error('getSharedStudentData - ', e);
    }
  };

  const clearShareData = () => {
    lessonDispatch({type: 'UNLOAD_STUDENT_SHARE_DATA'});
  };

  useEffect(() => {
    const sharedAuthID = displayData[0].studentAuthID;
    const sharedPageID = displayData[0].lessonPageID;
    const isOtherStudent = sharedAuthID !== user.authId;
    if (
      displayData[0].studentAuthID &&
      displayData[0].studentAuthID !== '' &&
      isOtherStudent
    ) {
      getSharedStudentData(sharedAuthID, sharedPageID);
    } else {
      if (lessonState.sharedData && lessonState?.sharedData?.length > 0) {
        clearShareData();
      }
    }
  }, [displayData]);

  // ##################################################################### //
  // ####################### MANAGE PERSON LOCATION ###################### //
  // ##################################################################### //

  const [getted, setGetted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [created, setCreated] = useState(false);

  const getLocationData = getLocalStorageData('person_location');

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
    if (!isOnDemand && personLocationObj.id === '') {
      initializeLocation();
    }
  }, [lessonState.lessonData.id]);

  // ~~~~~~~~~~~~ 2 PAGE CHANGE ~~~~~~~~~~~~ //

  useEffect(() => {
    if (!isOnDemand && created && lessonState.currentPage >= 0) {
      const pageChangeLocation = {
        ...getLocationData,
        currentLocation: lessonState.currentPage,
        lessonProgress: lessonState.lessonProgress
      };
      setPersonLocationObj(pageChangeLocation);
      updatePersonLocation(pageChangeLocation);
      setLocalStorageData('person_location', pageChangeLocation);
      //@ts-ignore
      topLessonRef?.current?.scrollIntoView();
    }
  }, [created, lessonState.currentPage]);

  const initializeLocation = async () => {
    if (!getted) {
      const getLocation = await getPersonLocation();

      if (getLocation === undefined || getLocation === null) {
        await createPersonLocation();
      } else {
        if (getLocation.lessonID === lessonID) {
          await updatePersonLocation(getLocation);
        } else {
          await leaveRoomLocation(user.authId, user.email);
          await createPersonLocation();
        }
      }
    }
  };

  // ~~~~~~ LESSON LOAD LOCATION FETC ~~~~~~ //

  const getPersonLocation = async () => {
    try {
      const getUserLocation: any = await API.graphql(
        graphqlOperation(queries.getPersonLocation, {
          personEmail: user.email,
          personAuthID: user.authId
        })
      );
      const response = getUserLocation.data.getPersonLocation;

      return response;
    } catch (e) {
      // console.error('createPersonLocation - ', e);
    } finally {
      setGetted(true);
    }
  };

  const getPersonLessonsDataId = (): string =>
    listPersonLessonsData?.find((_d: any) => _d.lessonID === lessonID)?.id || '';

  const getLessonCurrentPage = async () => {
    try {
      const getLessonRatingDetails: any = await API.graphql(
        graphqlOperation(queries.getPersonLessonsData, {
          id: getPersonLessonsDataId()
          // lessonID: lessonID,
          // studentEmail: user.email,
          // studentAuthID: user.authId
        })
      );
      const pageNumber = getLessonRatingDetails.data.getPersonLessonsData.pages;
      const currentPage = JSON.parse(pageNumber).currentPage;
      return currentPage;
    } catch (error) {}
  };

  const createPersonLocation = async () => {
    const {lessonID} = urlParams;

    const currentPageLocation = await getLessonCurrentPage();
    const newLocation = {
      personAuthID: user?.authId,
      personEmail: user?.email,
      syllabusLessonID: getRoomData.activeSyllabus,
      lessonID: lessonID,
      roomID: getRoomData.id,
      currentLocation: currentPageLocation,
      lessonProgress: '0'
    };
    try {
      const newUserLocation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, {input: newLocation})
      );
      const response = newUserLocation.data.createPersonLocation;
      const newLocationObj = {
        ...newLocation,
        id: response.id
      };
      setPersonLocationObj(newLocationObj);
      setLocalStorageData('person_location', newLocationObj);
    } catch (e) {
      // console.error('createPersonLocation - ', e);
    } finally {
      setCreated(true);
    }
  };

  // ~~~~~~~~~~ LOCATION UPDATING ~~~~~~~~~~ //

  const updatePersonLocation = async (updatedLocationObj: any) => {
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
        graphqlOperation(mutations.updatePersonLocation, {input: locationUpdateProps})
      );
      setLocalStorageData('person_location', locationUpdateProps);
    } catch (e) {
      console.error('updatePersonLocation - ', e);
    }
  };

  const leaveRoomLocation = async (inputAuthId: string, inputEmail: string) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.deletePersonLocation, {
          input: {
            personEmail: inputEmail,
            personAuthID: inputAuthId
          }
        })
      );
    } catch (e) {
      console.error('error deleting location record - ', e);
    } finally {
      setCleared(true);
    }
  };

  // ##################################################################### //
  // ######################### NAVIGATION CONTROL ######################## //
  // ##################################################################### //

  const [showRequiredNotification, setShowRequiredNotification] = useState<boolean>(
    false
  );
  const handleRequiredNotification = () => {
    if (!showRequiredNotification) {
      setShowRequiredNotification(true);
      setTimeout(() => {
        setShowRequiredNotification(false);
      }, 1250);
    }
  };

  const {authId} = useAuth();
  const updateJournalData = async (
    studentDataRows: UniversalLessonStudentDataFromAPI[]
  ) => {
    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: authId},
          lessonID: {eq: lessonID},
          type: {eq: 'class-note'}
        }
      };
      const journalData: any = await API.graphql(
        graphqlOperation(queries.listUniversalJournalData, listFilter)
      );

      const items = journalData.data.listUniversalJournalData?.items || [];

      let res: any[] = [];
      items.forEach((item: any) => {
        res.push(
          ...item.entryData.filter((entry: any) => entry.type.includes('content-custom'))
        );
      });

      let newArray: any = studentDataRows.map((item) => {
        // const value = res.find((r) => r.domID === item.domID);
        return item.pageData.filter((element) =>
          res.find((r) => r.domID === element.domID)
        );
      });
      newArray = newArray.filter((item: any) => item.length > 0)[0];
      newArray = newArray.map((item: any) => ({
        domID: item.domID,
        input: item.input[0],
        type: 'content-custom'
      }));

      const input = {
        id: items[0].id,
        entryData: newArray
      };

      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      console.log('updated journal data...');
    }
  };

  const loopCreateStudentArchiveAndExcerciseData = async (lessonID: string) => {
    const studentDataRows: UniversalLessonStudentDataFromAPI[] = await _loopFetchStudentData();
    const currentPageLocation = await getLessonCurrentPage();

    const result = studentDataRows.map(async (item: any) => {
      const input = {
        syllabusLessonID: item.syllabusLessonID,
        lessonID: item.lessonID,
        lessonPageID: item.lessonPageID,
        studentID: item.studentID,
        studentAuthID: item.studentAuthID,
        studentEmail: item.studentEmail,
        roomID: item.roomID,
        currentLocation: currentPageLocation,
        lessonProgress: item.lessonProgress,
        pageData: item.pageData,
        hasExerciseData: item.hasExerciseData,
        exerciseData: item.exerciseData,
        lessonName: lessonState?.lessonData?.title || ''
      };
      let newStudentData: any;
      let returnedData: any;

      if (item.hasExerciseData) {
        console.info('\x1b[33m *Moving lesson data to writing exercise table... \x1b[0m');
        newStudentData = await API.graphql(
          graphqlOperation(mutations.createUniversalLessonWritingExcercises, {
            input
          })
        );
      } else {
        delete input.lessonName;
        newStudentData = await API.graphql(
          graphqlOperation(mutations.createUniversalArchiveData, {
            input
          })
        );
        console.info('\x1b[33m *Archiving rest of the pages... \x1b[0m');
      }
      returnedData = newStudentData.data.createUniversalArchiveData;

      return returnedData;
    });

    // updateJournalData(studentDataRows);
    return result;
  };

  const createStudentArchiveData = async () => {
    try {
      const result = await loopCreateStudentArchiveAndExcerciseData(lessonID);
      return result;
    } catch (e) {
      console.error(
        'error @createStudentArchiveData in LessonApp.tsx creating journal data - ',
        e
      );
    }
  };

  useEffect(() => {
    handleLessonMutateData();
  }, [lessonState.currentPage]);

  const getLessonCompletedValue = async () => {
    try {
      const getLessonRatingDetails: any = await API.graphql(
        graphqlOperation(queries.getPersonLessonsData, {
          id: getPersonLessonsDataId(),
          filter: {
            lessonID: {eq: lessonID},
            studentEmail: {eq: user.email},
            studentAuthId: {eq: user.authId}
          }
        })
      );

      const pageNumber = getLessonRatingDetails.data.getPersonLessonsData.pages;
      const lessonProgress = JSON.parse(pageNumber).lessonProgress;
      const totalPages = JSON.parse(pageNumber).totalPages;
      return {
        lessonProgress,
        totalPages
      };
    } catch (error) {}
  };

  const [listPersonLessonsData, setListPersonLessonsData] = useState([]);

  const handleLessonMutateData = async () => {
    try {
      let payload;
      let existingLesson: any;

      const personLessonData = lessonState?.misc?.personLessonData;
      const isSameAndDataExists =
        personLessonData?.lessonID === lessonID && personLessonData?.data?.length > 0;

      if (isSameAndDataExists) {
        existingLesson = personLessonData?.data;
      } else {
        existingLesson = await API.graphql(
          graphqlOperation(queries.listPersonLessonsData, {
            filter: {
              roomId: {eq: getRoomData.id},
              lessonID: {eq: lessonID},
              studentAuthID: {eq: user.authId},
              studentEmail: {eq: user.email}
            }
          })
        );
        lessonDispatch({
          type: 'SET_PERSON_LESSON_DATA',
          payload: {
            lessonID: lessonID,
            data: existingLesson?.data?.listPersonLessonsData?.items || []
          }
        });
      }

      const items = isSameAndDataExists
        ? existingLesson
        : existingLesson?.data?.listPersonLessonsData?.items || [];

      if (!items?.length) {
        payload = {
          id: uuidV4(),
          studentAuthID: user.authId,
          roomId: getRoomData.id,
          studentEmail: user.email,
          lessonID: lessonID,
          lessonType: lessonState.lessonData?.type,
          //prettier-ignore
          pages: `{
            "currentPage":${JSON.stringify(lessonState.currentPage)},
            "totalPages":${JSON.stringify(lessonState.lessonData?.lessonPlan?.length - 1)},
            "lessonProgress":${JSON.stringify(lessonState.currentPage)}
            }`.replace(/(\s\s+|[\t\n])/g, ' ').trim(),
          ratings: 0
        };

        await API.graphql(
          graphqlOperation(mutations.createPersonLessonsData, {
            input: payload
          })
        );
      } else {
        setListPersonLessonsData(items);
        payload = {
          id: items?.find((_d: any) => _d.lessonID === lessonID)?.id,

          pages: `{
            "currentPage":${JSON.stringify(lessonState.currentPage)},
            "totalPages":${JSON.stringify(
              lessonState.lessonData?.lessonPlan?.length - 1
            )},
            "lessonProgress":${JSON.stringify(lessonState.currentPage)}
            }`
            .replace(/(\s\s+|[\t\n])/g, ' ')
            .trim()
        };
        await API.graphql(
          graphqlOperation(mutations.updatePersonLessonsData, {
            input: payload
          })
        );
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: Start.tsx ~ line 215 ~ handleLessonMutateData ~ error',
        error
      );
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  return (
    <>
      {/* 
      TODO: Add this again later
      */}
      {/* <FloatingSideMenu /> */}
      <div
        className={`${theme.bg} w-full h-full flex flex-col items-start dark-scroll overflow-y-auto`}
        ref={topLessonRef}>
        <div
          className={`opacity-${
            showRequiredNotification
              ? '100 translate-x-0 transform z-100'
              : '0 translate-x-10 transform'
          } absolute bottom-5 right-5 w-96 py-4 px-6 rounded-md shadow bg-gray-800 duration-300 transition-all`}>
          <p className="text-white font-medium tracking-wide">
            <span className="text-red-500">*</span>Please fill all the required fields
          </p>
        </div>

        <div className="fixed " style={{zIndex: 5000}}>
          <LessonHeaderBar
            lessonDataLoaded={lessonDataLoaded}
            overlay={overlay}
            setOverlay={setOverlay}
            pageStateUpdated={pageStateUpdated}
            getLessonCompletedValue={
              listPersonLessonsData.length > 0 && getLessonCompletedValue
            }
            createJournalData={createStudentArchiveData}
            isAtEnd={isAtEnd}
            setisAtEnd={setisAtEnd}
            handleRequiredNotification={handleRequiredNotification}
          />
        </div>
        <div
          className={`${
            breakpoint === 'xs' || breakpoint === 'sm' ? 'top-2' : 'top-6'
          } relative lesson-body-container `}>
          {!lessonDataLoaded ? (
            <div className="mt-4 mb-8 lesson-page-container">
              <LessonPageLoader />
            </div>
          ) : (
            <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
              {/* ADD LESSONWRAPPER HERE */}
              <div className="mt-4 mb-8 lesson-page-container">
                <CoreUniversalLesson createJournalData={createStudentArchiveData} />
              </div>
            </ErrorBoundary>
          )}

          {lessonDataLoaded && (
            <Foot
              isAtEnd={isAtEnd}
              setisAtEnd={setisAtEnd}
              handleRequiredNotification={handleRequiredNotification}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LessonApp;
