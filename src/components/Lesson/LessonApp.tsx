import React, {useContext, useEffect, useState} from 'react';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import {GlobalContext} from '../../contexts/GlobalContext';
import {exampleUniversalLesson} from './UniversalLessonBuilder/example_data/exampleUniversalLessonData';
import Foot from './Foot/Foot';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import * as customQueries from '../../customGraphql/customQueries';
import * as queries from '../../graphql/queries';
import {Auth} from '@aws-amplify/auth';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';
import {UniversalLessonStudentData} from '../../API';

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
  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
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
    if (lessonID !== '') {
      const universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      setTimeout(() => {
        lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
      }, 1000);
    } else {
      setTimeout(() => {
        lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
      }, 1000);
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
      if (subscription) {
        subscription.unsubscribe();
      }
      lessonDispatch({type: 'CLEANUP'});
    };
  }, []);

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //
  // ~~~~~~~~~~~~~ LESSON SETUP ~~~~~~~~~~~~ //
  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (lessonState.lessonData) {
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
        lessonDispatch({type: 'SET_CLOSED_PAGES', payload: getRoomData.ClosedPages});
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
      const mappedPages = PAGES.map((page: UniversalLessonPage) => {
        const allessonPageageParts = page.pageContent;
        const initialessonPageageData = allessonPageageParts.reduce(
          (pageData: StudentPageInput[], pagePart: PagePart) => {
            if (pagePart.hasOwnProperty('partContent')) {
              const pagePartContent = pagePart.partContent.reduce(
                (pagePartAcc: any[], partContent: PartContent) => {
                  const isForm = /form/g.test(partContent.type);
                  const isOtherInput = /input/g.test(partContent.type);
                  if (isForm) {
                    // map through partContent sub array
                    return [
                      ...pagePartAcc,
                      ...partContent.value.map((partContentSub: PartContentSub) => {
                        return {
                          domID: partContentSub.id,
                          input: [''],
                        };
                      }),
                    ];
                  } else if (isOtherInput) {
                    return [
                      ...pagePartAcc,
                      {
                        domID: partContent.id,
                        input: [''],
                      },
                    ];
                  } else {
                    return pagePartAcc;
                  }
                },
                []
              );
              return [...pageData, ...pagePartContent];
            } else {
              return pageData;
            }
          },
          []
        );
        return initialessonPageageData;
      });
      lessonDispatch({type: 'SET_INITIAL_STUDENT_DATA', payload: mappedPages});
      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ################# GET OR CREATE STUDENT DATA RECORDS ################ //
  // ##################################################################### //

  // tempDataIdArray for new student data initialization
  let tempDataIdArray: any = [];

  // ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
  const studentDataIdArray = (studentDataArray: any[]) => {
    const idArr = studentDataArray
      .reduce((acc: any[], dataObj: any, idx: number) => {
        const idObj = {
          id: dataObj.id,
          pageIdx: lessonState.lessonData.lessonPlan.findIndex(
            (lessonPlanObj: any) => lessonPlanObj.id === dataObj.lessonPageID
          ),
          lessonPageID: dataObj.lessonPageID,
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
        currentLocation: indexOfPage,
        lessonProgress: '0',
        pageData: lessonState.studentData[indexOfPage],
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
    const user = await Auth.currentAuthenticatedUser();
    const authId = user.attributes.sub;
    const email = user.attributes.email;

    try {
      const listFilter = {filter: {lessonID: lessonID, studentAuthID: authId}};
      const studentData: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessonStudentDatas, {
          listFilter,
        })
      );

      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentDatas.items;
      // find out if there are any missing records for pages
      const extraPages = PAGES.reduce(
        (extraPageArray: any[], lessonPage: UniversalLessonPage) => {
          const findInStudentDataRows = studentDataRows.find(
            (data: UniversalLessonStudentData) => data.lessonPageID === lessonPage.id
          );
          if (findInStudentDataRows === undefined) {
            return [...extraPageArray, lessonPage];
          } else {
            return extraPageArray;
          }
        },
        []
      );

      /**
       * NEW RECORD CREATION LOGIC:
       *   - if no student records for this lesson, make all new records per page
       *   - if student records exist, but an additional page has been added, create records for these pages
       */
      if (studentDataRows?.length === 0) {
        const createNewRecords = await loopCreateStudentData(
          PAGES,
          lessonID,
          authId,
          email
        );
        const newRecords = await Promise.all(createNewRecords);
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: studentDataIdArray([...newRecords, ...studentDataRows]),
          },
        });
      } else if (extraPages?.length > 0 && studentDataRows?.length > 0) {
        const createExtraRecords = await loopCreateStudentData(
          extraPages,
          lessonID,
          authId,
          email
        );
        const extraRecords = await Promise.all(createExtraRecords);
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: studentDataIdArray([...extraRecords, ...studentDataRows]),
          },
        });
      } else if (studentDataRows?.length === PAGES?.length) {
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {dataIdReferences: studentDataIdArray(studentDataRows)},
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

  const [personLocationObj, setPersonLocationObj] = useState<any>();

  const createPersonLocation = async () => {
    const newLocation = {
      personAuthID: state.user.authId,
      personEmail: state.user.email,
      syllabusLessonID: lessonState.syllabusLessonID,
      roomID: '0',
      currentLocation: lessonState.currentPage,
      lessonProgress: lessonState.lessonProgress,
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, {input: newLocation})
      );
    } catch (e) {
      console.error('createPersonLocation - ', e);
    } finally {
      try {
        const getNewLocation = await getPersonLocation();
        console.log('getNewLocation - ', getNewLocation);
      } catch (e) {
        console.log('getNewLocation after Create - ', e);
      }
    }
  };

  const getPersonLocation = async () => {
    try {
      let userInfo: any = await API.graphql(
        graphqlOperation(customQueries.getPersonLocation, {
          personAuthID: state.user.authId,
          personEmail: state.user.email,
        })
      );
      userInfo = userInfo.data.getPersonLocation;
      return userInfo || null;
    } finally {
      console.log('getPersonLocation funnction completed');
    }
  };

  const updatePersonLocation = async () => {
    const updatedLocation = {
      id: personLocationObj && personLocationObj.id ? personLocationObj.id : '',
      personAuthID: state.user.authId,
      personEmail: state.user.email,
      syllabusLessonID: lessonState.universalLessonID,
      roomID: getRoomData.id,
      currentLocation: lessonState.currentPage,
      lessonProgress: lessonState.lessonProgress,
    };

    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: updatedLocation})
      );
    } catch (e) {
      console.error('updatePersonLocation - ', e);
    } finally {
      setPersonLocationObj(updatedLocation);
    }
  };

  const handleUpdatePersonLocation = async (locationObj: any) => {
    if (locationObj && Object.keys(locationObj).length > 0 && locationObj.id !== '') {
      await updatePersonLocation();
    } else {
      const getLocation = await getPersonLocation();
      if (getLocation !== null) {
        setPersonLocationObj(getLocation);
      } else {
        await createPersonLocation();
      }
    }
  };

  useEffect(() => {
    handleUpdatePersonLocation(personLocationObj);
  }, [lessonState.currentPage]);

  return (
    <>
      <FloatingSideMenu />
      <div className={`${theme.bg} w-full flex flex-col items-start`}>
        <LessonHeaderBar
          lessonDataLoaded={lessonDataLoaded}
          overlay={overlay}
          setOverlay={setOverlay}
        />
        {/*<NotificationBar />*/}

        <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
          {/*{lessonDataLoaded && <Body />}*/}
          {/* ADD LESSONWRAPPER HERE */}
          <CoreUniversalLesson />
        </ErrorBoundary>

        {lessonDataLoaded && <Foot />}
      </div>
    </>
  );
};

export default LessonApp;
