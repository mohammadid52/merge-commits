import API, {graphqlOperation} from '@aws-amplify/api';
import {Auth} from '@aws-amplify/auth';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {UniversalLessonStudentData} from '../../API';
import {GlobalContext} from '../../contexts/GlobalContext';
import * as customQueries from '../../customGraphql/customQueries';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import usePrevious from '../../customHooks/previousProps';
import * as mutations from '../../graphql/mutations';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentExerciseData,
  StudentPageInput,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import SaveQuit from './Foot/SaveQuit';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';

const LessonApp = () => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();
  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //
  const [overlay, setOverlay] = useState<string>('');
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);
  //  NAVIGATION CONSTANTS
  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  // ##################################################################### //
  // ######################### SUBSCRIPTION SETUP ######################## //
  // ##################################################################### //
  let subscription: any;
  const [subscriptionData, setSubscriptionData] = useState<any>();

  // ----------- 1 ---------- //
  //  PUT LESSON SUBSCRIPTION FUNCTION IN CONTEXT  //

  useEffect(() => {
    if (lessonState.lessonData.id) {
      lessonDispatch({
        type: 'SET_SUBSCRIBE_FUNCTION',
        payload: {
          subscribeFunc: subscribeToRoom,
        },
      });
    }
  }, [lessonState.lessonData.id]);

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
      },
    });

    return roomSubscription;
  };

  // ----------- 3 ---------- //

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    console.log('updateOnIncomingSubscriptionData - ', subscriptionData);
    setLocalStorageData('room_info', {
      ...getRoomData,
      ClosedPages: subscriptionData.ClosedPages,
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

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //
  const getSyllabusLesson = async (lessonID?: string) => {
    // lessonID will be undefined for testing
    try {
      const universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
    } catch (e) {
      console.error('error getting lesson - ', lessonID, ' ', e);
    }
  };

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    const {lessonID} = urlParams;
    if (lessonID) {
      lessonDispatch({type: 'SET_INITIAL_STATE', payload: {universalLessonID: lessonID}});
      getSyllabusLesson(lessonID).then((_: void) =>
        console.log('Lesson Mount - ', 'Lesson fetched!')
      );
    }
    return () => {
      const leaveRoom = leaveRoomLocation();
      Promise.resolve(leaveRoom).then((_: void) => {
        if (subscription) {
          subscription.unsubscribe();
        }
        lessonDispatch({type: 'CLEANUP'});
      });
      // if (subscription) {
      //   subscription.unsubscribe();
      // }
      // lessonDispatch({type: 'CLEANUP'});
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
  useEffect(() => {
    if (lessonState.lessonData && lessonState.lessonData.id) {
      setLessonDataLoaded(true);
      // Initialize page url and context
      if (CURRENT_PAGE !== '' && CURRENT_PAGE !== undefined) {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: CURRENT_PAGE});
        history.push(`${match.url}/${CURRENT_PAGE}`);
      } else {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
        history.push(`${match.url}/${0}`);
      }

      // Initialize closed pages based on room-configuration

      if (
        lessonState.lessonData.lessonPlan &&
        lessonState.lessonData.lessonPlan.length > 0
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
                                input: [''],
                              },
                            ],
                          };
                        },
                        {reqId: [], pgInput: []}
                      );

                      const exerciseObj = {
                        id: partContent.id,
                        entryData: formSubInputs.pgInput,
                      };

                      return {
                        requiredIdAcc: [
                          ...partInputAcc.requiredIdAcc,
                          ...formSubInputs.reqId,
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput,
                        ],
                        pageExerciseAcc: isExercise
                          ? [...partInputAcc.pageExerciseAcc, exerciseObj]
                          : partInputAcc.pageExerciseAcc,
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
                            input: [''],
                          },
                        ],
                        pageExerciseAcc: partInputAcc.pageExerciseAcc,
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
                    ...partInputs.requiredIdAcc,
                  ],
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc,
                  ],
                  pageExerciseAcc: [
                    ...pageInputsAcc.pageExerciseAcc,
                    ...partInputs.pageExerciseAcc,
                  ],
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
            exercises: [...inputs.exercises, reducedPageInputs.pageExerciseAcc],
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
          exerciseData: mappedPages.exercises,
        },
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
          update: false,
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
            : [...acc.exerciseData, []],
        };
      },
      {
        pageData: [],
        exerciseData: [],
      }
    );
  };

  // -------- MERGING ------- //
  const mergedStudentData = (studentDataArray: any[], initStudentDataArray: any[]) => {
    const differenceData = studentDataArray.reduce(
      //@ts-ignore
      (diffArray: any[], loadedInput: StudentPageInput[] | [], pageIdx: number) => {
        const notYetSavedData = initStudentDataArray[pageIdx].reduce(
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
    const extraPagesArray = lessonPlanPages.reduce(
      (extraPageArray: any[], lessonPage: UniversalLessonPage) => {
        const findInStudentDataRecords = studentDataRecords.find(
          (data: UniversalLessonStudentData) => data.lessonPageID === lessonPage.id
        );
        if (findInStudentDataRecords === undefined) {
          return [...extraPageArray, lessonPage];
        } else {
          return extraPageArray;
        }
      },
      []
    );
    const currentLessonRecords = studentDataRecords.reduce(
      (currentLessonRecords: any[], studentData: UniversalLessonStudentData) => {
        const isStudentDataFromLesson = lessonPlanPages.find(
          (lessonPage: UniversalLessonPage) => lessonPage.id === studentData.lessonPageID
        );
        if (isStudentDataFromLesson !== undefined) {
          return [...currentLessonRecords, studentData];
        } else {
          return currentLessonRecords;
        }
      },
      []
    );
    return {
      extraPages: extraPagesArray,
      currentRecords: currentLessonRecords,
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
      };

      const newStudentData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalLessonStudentData, {
          input,
        })
      );
      const returnedData = newStudentData.data.createUniversalLessonStudentData;
      return returnedData;
    });
    return createdRecords;
  };

  // ~~~~~~~~~~~ THE MAIN FUNTION ~~~~~~~~~~ //
  const getOrCreateStudentData = async () => {
    const {lessonID} = urlParams;
    const syllabusID = getRoomData.activeSyllabus;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    // console.log('getOrCreateData - user - ', user);

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
          lessonID: {eq: lessonID},
          syllabusLessonID: {eq: syllabusID},
        },
      };

      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      );

      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentDatas.items;

      const filteredData = filterExtraPages(PAGES, studentDataRows);
      const extraPages = filteredData.extraPages;
      const currentStudentData = filteredData.currentRecords;

      /**
       * NEW RECORD CREATION LOGIC:
       *   - if no student records for this lesson, make all new records per page
       *   - if student records exist, but an additional page has been added, create records for these pages
       */
      if (studentDataRows?.length === 0) {
        const createNewRecords = await loopCreateStudentData(
          PAGES,
          lessonID,
          studentAuthId,
          email
        );
        const newRecords = await Promise.all(createNewRecords);
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: studentDataIdArray(newRecords),
          },
        });
      } else if (extraPages?.length > 0 && currentStudentData?.length > 0) {
        const createExtraRecords = await loopCreateStudentData(
          extraPages,
          lessonID,
          studentAuthId,
          email
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
        // console.log('merged data', finalData);
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: combinedStudentDataIdArray,
            filteredStudentData: finalData,
            filteredExerciseData: concatExerciseData,
          },
        });
      } else if (currentStudentData?.length > 0 && extraPages?.length === 0) {
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
            filteredExerciseData: concatExerciseData,
          },
        });
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
  // ####################### MANAGE PERSON LOCATION ###################### //
  // ##################################################################### //

  const [personLocationObj, setPersonLocationObj] = useState<any>(undefined);
  const previousLocation = usePrevious(personLocationObj);

  useEffect(() => {
    if (personLocationObj && personLocationObj.id) {
      updatePersonLocation(personLocationObj);
      setLocalStorageData('person_location', personLocationObj);
    }
  }, [personLocationObj]);

  // ~~~~~~ LESSON LOAD LOCATION FETC ~~~~~~ //

  const getPersonLocation = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    let input = {
      personAuthID: {eq: studentAuthId},
      personEmail: email,
    };

    try {
      let userLocations: any = await API.graphql(
        graphqlOperation(customQueries.listPersonLocations, input)
      );

      const responseItems = userLocations.data.listPersonLocations.items;
      // console.log('getPersonLocation - ', responseItems);

      if (responseItems.length > 0) {
        await leaveRoomLocation();
        await createPersonLocation();
      } else {
        await createPersonLocation();
      }
    } finally {
      // console.log('personLocation setup!');
    }
  };

  const createPersonLocation = async () => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    const newLocation = {
      personAuthID: studentAuthId,
      personEmail: email,
      syllabusLessonID: getRoomData.activeSyllabus,
      lessonID: lessonID,
      roomID: getRoomData.id,
      currentLocation: '0',
      lessonProgress: '0',
    };
    try {
      const newUserLocation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, {input: newLocation})
      );
      const response = newUserLocation.data.createPersonLocation;
      const newLocationObj = {
        ...newLocation,
        id: response.id,
      };
      setPersonLocationObj(newLocationObj);
    } catch (e) {
      // console.error('createPersonLocation - ', e);
    }
  };

  useEffect(() => {
    if (personLocationObj === undefined) {
      const fetchLocation = getPersonLocation();
      Promise.resolve(fetchLocation).then((_: any) => {
        console.log('...initialized location');
      });
    }
  }, [lessonState.lessonData.id]);

  // ~~~~~~~~~~ LOCATION UPDATING ~~~~~~~~~~ //

  const updatePersonLocation = async (updatedLocationObj: any) => {
    const locationUpdateProps = {
      id: updatedLocationObj.id,
      personAuthID: updatedLocationObj.personAuthID,
      personEmail: updatedLocationObj.personEmail,
      lessonID: updatedLocationObj.lessonID,
      syllabusLessonID: updatedLocationObj.syllabusLessonID,
      roomID: updatedLocationObj.roomID,
      currentLocation: updatedLocationObj.currentLocation,
      lessonProgress: updatedLocationObj.lessonProgress,
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: locationUpdateProps})
      );
    } catch (e) {
      console.error('updatePersonLocation - ', e);
    }
  };

  const leaveRoomLocation = async () => {
    const storedLocation = getLocalStorageData('person_location');
    try {
      const deletePersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.deletePersonLocation, {
          input: {
            personEmail: storedLocation.personEmail,
            personAuthID: storedLocation.personAuthID,
          },
        })
      );
      // console.log('left room...', storedLocation);
    } catch (e) {
      // console.error('error deleting location record - ', e);
    }
  };

  useEffect(() => {
    if (personLocationObj && personLocationObj.id && lessonState.currentPage >= 0) {
      setPersonLocationObj({
        ...personLocationObj,
        currentLocation: lessonState.currentPage,
        lessonProgress: lessonState.lessonProgress,
      });
    }
  }, [lessonState.currentPage]);

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

  const userAtEnd = () => {
    return lessonState.currentPage === lessonState.lessonData?.lessonPlan?.length - 1;
  };

  return (
    <>
      <FloatingSideMenu />
      <div
        className={`${theme.bg} w-full h-full flex flex-col items-start dark-scroll overflow-y-auto`}>
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

        <div className="fixed z-50">
          <LessonHeaderBar
            lessonDataLoaded={lessonDataLoaded}
            overlay={overlay}
            setOverlay={setOverlay}
            isAtEnd={isAtEnd}
            setisAtEnd={setisAtEnd}
            handleRequiredNotification={handleRequiredNotification}
          />
        </div>
        <div className="relative top-6 lesson-body-container">
          {!lessonDataLoaded ? (
            <div className="mt-4 mb-8 lesson-page-container">
              <LessonPageLoader />
            </div>
          ) : (
            <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
              {/*{lessonDataLoaded && <Body />}*/}
              {/* ADD LESSONWRAPPER HERE */}
              <div className="mt-4 mb-8 lesson-page-container">
                <CoreUniversalLesson />
                {userAtEnd() ? <SaveQuit roomID={getRoomData?.id} /> : null}
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
