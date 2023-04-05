import {API, graphqlOperation} from 'aws-amplify';
import {
  CreateUniversalArchiveDataInput,
  CreateUniversalLessonWritingExcercisesInput,
  UniversalLessonStudentData as UniversalLessonStudentDataFromAPI
} from 'API';

import {useGlobalContext} from 'contexts/GlobalContext';
import {
  getRoomSetup,
  getUniversalLessonStudentData,
  listUniversalLessonStudentDatas
} from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import {
  createUniversalArchiveData,
  createUniversalLessonStudentData,
  createUniversalLessonWritingExcercises
} from 'graphql/mutations';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentExerciseData,
  StudentPageInput,
  UniversalLessonPage,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import {ILessonSurveyApp} from './Lesson';
import LessonSurveyAppWrapper from './LessonSurveyAppWrapper';

// ~~~~~~~~~~ FILTER EXTRA PAGES ~~~~~~~~~ //
const filterExtraPages = (lessonPlanPages: any[], studentDataRecords: any[]) => {
  const goAhead = typeof studentDataRecords !== 'undefined';
  const extraPagesArray = lessonPlanPages.reduce(
    (extraPageArray: any[], lessonPage: UniversalLessonPage) => {
      const findInStudentDataRecords = goAhead
        ? studentDataRecords.find(
            (data: UniversalLessonStudentData) =>
              //@ts-ignore
              data.lessonPageID === lessonPage.id
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

// ~ FILTER/MERGE PAGEDATA & EXERCISEDATA  //
// ------- FILTERING ------ //
const filterStudentData = (studentDataIdArray: any[], studentDataArray: any[]) => {
  return studentDataIdArray.reduce(
    (
      acc: {
        pageData: StudentPageInput[];
        exerciseData: StudentExerciseData[];
      },
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

// ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
const studentDataIdArray = (studentDataArray: any[], lessonPlan: any[]) => {
  const idArr = studentDataArray
    .reduce((acc: any[], studentDataIdObj: any) => {
      const indexOfPage = lessonPlan?.findIndex(
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
      return -1;
    });
  return idArr;
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

const LessonApp = (props: ILessonSurveyApp) => {
  const {leaveRoomLocation, getLessonCurrentPage} = props;
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //

  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const displayData = gContext.lessonState.displayData;
  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const getRoomData = getLocalStorageData('room_info');
  const urlParams: any = useParams();
  const {lessonID} = urlParams;

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const PAGES = lessonState?.lessonData?.lessonPlan;

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

  // ----------- 3 ---------- //

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    setLocalStorageData('room_info', {
      ...getRoomData,
      ClosedPages: subscriptionData.ClosedPages
    });

    lessonDispatch({
      type: 'SET_ROOM_SUBSCRIPTION_DATA',
      payload: subscriptionData
    });
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

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //

  // ~~~~~~~~~~~~~~~ GET ROOM ~~~~~~~~~~~~~~ //

  const getRoomSetupFn = async (roomID: string) => {
    try {
      const initialRoomSetup = await API.graphql(
        graphqlOperation(getRoomSetup, {id: roomID})
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

  useEffect(() => {
    if (lessonState.lessonData && lessonState.lessonData.id) {
      setLessonDataLoaded(true);

      // Initialize closed pages based on room-configuration

      if (
        lessonState.lessonData.lessonPlan &&
        lessonState.lessonData.lessonPlan?.length > 0
      ) {
        getRoomSetupFn(getRoomData.id);
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
          const pageParts = page?.pageContent || [];

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
                      const formSubInputs = partContent?.value?.reduce(
                        // @ts-ignore
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
                        // @ts-ignore
                        entryData: formSubInputs?.pgInput || []
                      };

                      return {
                        requiredIdAcc: [
                          ...partInputAcc.requiredIdAcc,
                          // @ts-ignore
                          ...formSubInputs.reqId
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          // @ts-ignore
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

  // ~~~~~~~ RECORD CREATION FUNTION ~~~~~~~ //
  const loopCreateStudentData = async (
    lessonPages: any[],
    lessonID: string,
    authId: string,
    email: string
  ) => {
    const createdRecords = lessonPages.map(async (lessonPage: any) => {
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
        graphqlOperation(createUniversalLessonStudentData, {
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
          PAGES.map(async (page: any) => {
            let studentData: any = await API.graphql(
              graphqlOperation(getUniversalLessonStudentData, {
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

        setLessonDataLoaded(true);
        resolve(result);
        return [];
      } catch (e) {
        console.error('loopFetchStudentData - ', e);
        return [];
      }
    });

  const getOrCreateStudentData = async () => {
    try {
      // existing student rowss
      const studentDataRows: UniversalLessonStudentDataFromAPI[] = (
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
            dataIdReferences: studentDataIdArray(newRecords, PAGES)
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
          const combinedStudentDataIdArray = studentDataIdArray(combinedRecords, PAGES);
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
            const existStudentDataIdArray = studentDataIdArray(currentStudentData, PAGES);
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
      initializeStudentData().then(() => {
        lessonDispatch({type: 'LESSON_LOADED', payload: true});
      });
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
        graphqlOperation(listUniversalLessonStudentDatas, listFilter)
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

  // ~~~~~~ LESSON LOAD LOCATION FETC ~~~~~~ //

  // ##################################################################### //
  // ######################### NAVIGATION CONTROL ######################## //
  // ##################################################################### //

  const loopCreateStudentArchiveAndExcerciseData = async (_: string) => {
    const studentDataRows: UniversalLessonStudentDataFromAPI[] =
      await _loopFetchStudentData();
    const currentPageLocation = await getLessonCurrentPage();

    const result = studentDataRows.map(async (item: any) => {
      const input: CreateUniversalLessonWritingExcercisesInput = {
        id: uuidV4(),
        syllabusLessonID: item.syllabusLessonID,
        lessonID: item.lessonID,
        lessonPageID: item.lessonPageID,
        studentID: item.studentID,
        studentAuthID: item.studentAuthID,
        studentEmail: item.studentEmail,
        roomID: item.roomID,
        currentLocation: currentPageLocation.toString(),
        lessonProgress: item.lessonProgress,
        pageData: item.pageData,
        hasExerciseData: item.hasExerciseData,
        exerciseData: item.exerciseData
      };
      let newStudentData: any;
      let returnedData: any;

      if (item.hasExerciseData) {
        // adding lesson name to writing exercise table
        input.lessonName = lessonState?.lessonData?.title || '';

        console.info('\x1b[33m *Moving lesson data to writing exercise table... \x1b[0m');

        newStudentData = await API.graphql(
          graphqlOperation(createUniversalLessonWritingExcercises, {
            input
          })
        );
      } else {
        const inputForArchive: CreateUniversalArchiveDataInput = {
          // Everything is the same
          ...input
        };

        newStudentData = await API.graphql(
          graphqlOperation(createUniversalArchiveData, {
            input: inputForArchive
          })
        );
        console.info('\x1b[33m *Archiving rest of the pages... \x1b[0m');
      }
      returnedData = newStudentData.data.createUniversalArchiveData;

      return returnedData;
    });

    return result;
  };

  const createStudentArchiveData = async (onSuccessCallback?: () => void) => {
    try {
      const result = await loopCreateStudentArchiveAndExcerciseData(lessonID);
      if (onSuccessCallback && typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
      return result;
    } catch (e) {
      console.error(
        'error @createStudentArchiveData in LessonApp.tsx creating journal data - ',
        e
      );
      return null;
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //

  return (
    <LessonSurveyAppWrapper
      type="lesson"
      lessonDataLoaded={lessonDataLoaded}
      createJournalData={createStudentArchiveData}
      {...props}
    />
  );
};

export default LessonApp;
