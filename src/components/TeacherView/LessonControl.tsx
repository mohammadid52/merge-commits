import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import ClassRoster from './ClassRoster';
import PositiveAlert from '../General/Popup';
import {useOutsideAlerter} from '../General/hooks/outsideAlerter';
import TopMenu from './TopMenu';
import StudentWindowTitleBar from './StudentWindow/StudentWindowTitleBar';
import QuickRegister from '../Auth/QuickRegister';
import {dateString} from '../../utilities/time';
import ErrorBoundary from '../Error/ErrorBoundary';
import {GlobalContext} from '../../contexts/GlobalContext';
import {exampleUniversalLesson} from '../Lesson/UniversalLessonBuilder/example_data/exampleUniversalLessonData';
import CoreUniversalLesson from '../Lesson/UniversalLesson/views/CoreUniversalLesson';
import {useParams} from 'react-router';
import usePrevious from '../../customHooks/previousProps';
import {
  StudentPageInput,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../../interfaces/UniversalLessonInterfaces';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as subscriptions from '../../graphql/subscriptions';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';

const LessonControl = () => {
  const {dispatch, lessonState, lessonDispatch, controlState, theme} = useContext(
    GlobalContext
  );
  const match = useRouteMatch();
  const history = useHistory();
  const urlParams: any = useParams();
  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //
  const handlePageChange = (pageNr: number) => {
    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});
  };

  const [fullscreen, setFullscreen] = useState(false);
  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  const {visible, setVisible} = useOutsideAlerter(false);
  const [quickRegister, setQuickRegister] = useState(false);
  const [homePopup, setHomePopup] = useState(false);
  const [lessonButton, setLessonButton] = useState(false);

  const handleClick = () => {
    setVisible((prevState: any) => !prevState);
  };
  const handleHomePopup = () => {
    setHomePopup((prevState: any) => !prevState);
  };
  const handleLessonButton = () => {
    setLessonButton((prevState: any) => !prevState);
  };
  const handleGoToUserManagement = () => {
    history.push('/dashboard/manage-users');
  };
  const handleHome = async () => {
    await handleRoomUpdate({id: getRoomData.id, studentViewing: ''});
    history.push(`/dashboard/lesson-planner/${getRoomData.id}`);
  };

  // ##################################################################### //
  // ######################### SUBSCRIPTION SETUP ######################## //
  // ##################################################################### //
  let subscription: any;
  const [subscriptionData, setSubscriptionData] = useState<any>();

  // ----------- 1 ---------- //

  const subscribeToStudent = () => {
    const {lessonID} = urlParams;
    const syllabusID = getRoomData.activeSyllabus; // in the table this is called SyllabusLessonID, but it's just the syllabusID

    const subscriptionFilter = {
      filter: {
        studentAuthID: {eq: lessonState.studentViewing},
        lessonID: {eq: lessonID},
        syllabusLessonID: {eq: syllabusID},
      },
    };

    const studentDataSubscription = API.graphql(
      graphqlOperation(subscriptions.onChangeUniversalLessonStudentData, {
        studentAuthID: lessonState.studentViewing,
        syllabusLessonID: syllabusID,
        lessonID: lessonID,
      })
      //@ts-ignore
    ).subscribe({
      next: (studentData: any) => {
        const updatedStudentData =
          studentData.value.data.onChangeUniversalLessonStudentData;
        setSubscriptionData(updatedStudentData);
      },
    });

    return studentDataSubscription;
  };

  // ----------- 2 ---------- //

  const updateOnIncomingStudentSubscriptionData = (subscriptionData: any) => {
    const getPageIdx = lessonState.universalStudentDataID.find(
      (dataRef: any) => dataRef.id === subscriptionData.id
    )?.pageIdx;
    const getPageData = subscriptionData.pageData;
    lessonDispatch({
      type: 'LOAD_STUDENT_SUBSCRIPTION_DATA',
      payload: {stDataIdx: getPageIdx, subData: getPageData},
    });
  };

  // ----------- 3 ---------- //

  useEffect(() => {
    if (subscriptionData) {
      updateOnIncomingStudentSubscriptionData(subscriptionData);
    }
  }, [subscriptionData]);

  // ##################################################################### //
  // ##################### INITIAL STUDENT DATA FETCH #################### //
  // ##################################################################### //

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

  // ~~~~~~ FILTER STUDENT DATA ARRAYS ~~~~~ //
  const filterStudentData = (studentDataIdArray: any[], studentDataArray: any[]) => {
    return studentDataIdArray.reduce((acc: StudentPageInput[], dataIdObj: any) => {
      const findPageData = studentDataArray.find(
        (dataObj: UniversalLessonStudentData) => dataObj.id === dataIdObj.id
      )?.pageData;
      if (Array.isArray(findPageData)) {
        return [...acc, findPageData];
      } else {
        return [];
      }
    }, []);
  };

  // ~~~~~~~~~~~ THE MAIN FUNTION ~~~~~~~~~~ //
  const getStudentData = async (studentAuthId: string) => {
    const {lessonID} = urlParams;
    const syllabusID = getRoomData.activeSyllabus; // in the table this is called SyllabusLessonID, but it's just the syllabusID

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
          lessonID: {eq: lessonID},
          syllabusLessonID: {eq: syllabusID},
        },
      };
      const studentData: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessonStudentDatas, listFilter)
      );

      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentDatas.items;

      if (studentDataRows.length > 0) {
        subscription = subscribeToStudent();

        const existStudentDataIdArray = studentDataIdArray(studentDataRows);
        const filteredData = filterStudentData(existStudentDataIdArray, studentDataRows);

        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: existStudentDataIdArray,
            filteredStudentData: filteredData,
          },
        });
      } else {
        throw 'No student data records for this lesson...';
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ~~~~~~~~~~~~~~~ CLEAN UP ~~~~~~~~~~~~~~ //

  const clearStudentData = async () => {
    lessonDispatch({type: 'UNLOAD_STUDENT_DATA'});
  };

  useEffect(() => {
    if (lessonState.studentViewing === '') {
      lessonDispatch({type: 'UNLOAD_STUDENT_DATA'});
    }

    if (lessonState.studentViewing !== '') {
      clearStudentData().then((_: void) =>
        getStudentData(lessonState.studentViewing).then((_: void) =>
          console.log('getStudentData teacher - ', 'getted')
        )
      );
    }
  }, [lessonState.studentViewing]);

  // ##################################################################### //
  // ################## STUDENT SHARE AND VIEW CONTROLS ################## //
  // ##################################################################### //
  const handleQuitShare = () => {
    dispatch({type: 'QUIT_SHARE_MODE'});
    setIsSameStudentShared(false);
  };

  const handleQuitViewing = () => {
    dispatch({type: 'QUIT_STUDENT_VIEWING'});
    setIsSameStudentShared(false);
  };

  /**
   * VIEWING A STUDENT
   *  1. compare new studentViewing ID
   *  2. if it's not the same as before, and not ''
   *  3. unsubscribe
   *  4. mutate the room table
   *
   *  --then--
   *  5. subscribe
   */

  const handleRoomUpdate = async (payload: any) => {
    if (typeof payload === 'object' && Object.keys(payload).length > 0) {
      try {
        const updateRoom: any = await API.graphql(
          graphqlOperation(mutations.updateRoom, {
            input: payload,
          })
        );
      } catch (e) {
        console.error('handleRoomUpdate - ', e);
      }
    } else {
      console.log('incorrect data for handleRoomUpdate() - ', payload);
    }
  };

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
      console.error('getSyllabusLesson() - error fetching lesson', e);
    }

    // else {
    //   setTimeout(() => {
    //     lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
    //   }, 1000);
    // }
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
  useEffect(() => {
    if (lessonState.lessonData) {
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
      history.push(`${match.url}/${0}`);

      const getRoomData = getLocalStorageData('room_info');
      setLocalStorageData('room_info', {...getRoomData, studentViewing: ''});

      if (
        lessonState.lessonData.lessonPlan &&
        lessonState.lessonData.lessonPlan.length > 0
      ) {
        lessonDispatch({
          type: 'SET_ROOM_SUBSCRIPTION_DATA',
          payload: {
            ClosedPages: getRoomData.ClosedPages,
            studentViewing: '',
          },
        });
      }
    }
  }, [lessonState.lessonData.id]);

  // ##################################################################### //
  // ################### OTHER SHARING / VIEWING LOGIC ################### //
  // ##################################################################### //

  // ~~~~~~ AUTO PAGE NAVIGATION LOGIC ~~~~~ //
  useEffect(() => {
    if (lessonState.studentViewing !== '') {
      const viewedStudentLocation = controlState.roster.find(
        (student: any) => student.personAuthID === lessonState.studentViewing
      )?.currentLocation;

      if (viewedStudentLocation !== '') {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: viewedStudentLocation});
        history.push(`${match.url}/${viewedStudentLocation}`);
      } else {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
        history.push(`${match.url}/0`);
      }
    }
  }, [controlState.roster, lessonState.studentViewing]);

  // ~~~~~ PREVENT DOUBLE SHARING LOGIC ~~~~ //
  const [isSameStudentShared, setIsSameStudentShared] = useState(false);
  // useEffect(() => {
  //   if (
  //     !state.displayData ||
  //     !state.displayData.studentInfo ||
  //     !state.studentViewing.studentInfo ||
  //     !state.studentViewing.studentInfo.student
  //   ) {
  //     setIsSameStudentShared(false);
  //   }
  //
  //   if (
  //     state.displayData &&
  //     state.displayData.studentInfo &&
  //     state.studentViewing.studentInfo &&
  //     state.studentViewing.studentInfo.student
  //   ) {
  //     if (
  //       state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id
  //     ) {
  //       setIsSameStudentShared(true);
  //     }
  //
  //     if (
  //       state.displayData.studentInfo.id !== state.studentViewing.studentInfo.student.id
  //     ) {
  //       setIsSameStudentShared(false);
  //     }
  //
  //     if (
  //       state.displayData.studentInfo.id ===
  //         state.studentViewing.studentInfo.student.id &&
  //       !state.studentViewing.live
  //     ) {
  //       setIsSameStudentShared(false);
  //     }
  //   }
  // }, [state.displayData, state.studentViewing]);

  // ~ SHARE A VIEWED STUDENT'S DATA LOGIC ~ //
  const handleShareStudentData = async () => {
    // if (state.studentViewing.studentInfo) {
    //   let displayData = {
    //     breakdownComponent: state.studentViewing.studentInfo.currentLocation
    //       ? state.studentViewing.studentInfo.currentLocation
    //       : state.studentViewing.studentInfo.lessonProgress,
    //     studentInfo: {
    //       id: state.studentViewing.studentInfo.student.id,
    //       firstName: state.studentViewing.studentInfo.student.firstName,
    //       preferredName: state.studentViewing.studentInfo.student.preferredName
    //         ? state.studentViewing.studentInfo.student.preferredName
    //         : null,
    //       lastName: state.studentViewing.studentInfo.student.lastName,
    //     },
    //     warmUpData: state.studentViewing.studentInfo.warmupData
    //       ? state.studentViewing.studentInfo.warmupData
    //       : null,
    //     corelessonData: state.studentViewing.studentInfo.corelessonData
    //       ? state.studentViewing.studentInfo.corelessonData
    //       : null,
    //     activityData: state.studentViewing.studentInfo.activityData
    //       ? state.studentViewing.studentInfo.activityData
    //       : null,
    //   };
    //   // console.log('display data: ', displayData);
    //   dispatch({
    //     type: 'SET_SHARE_MODE',
    //     payload: state.studentViewing.studentInfo.currentLocation
    //       ? state.studentViewing.studentInfo.currentLocation
    //       : state.studentViewing.studentInfo.lessonProgress,
    //   });
    //   dispatch({type: 'SET_DISPLAY_DATA', payload: displayData});
    // }
  };

  // ##################################################################### //
  // ################### CLASSROOM AND PLANNER CONTROL ################### //
  // ##################################################################### //
  const handleOpen = async () => {
    await handleOpenPlanner();
    //   dispatch({type: 'START_CLASSROOM', payload: '1989-11-02z'});
  };

  const handleComplete = async () => {
    //   await handleCompletePlanner();
    //   dispatch({type: 'COMPLETE_CLASSROOM', payload: dateString('-', 'US')});
    handleHome();
  };

  const handleUpdatePlanner = async () => {
    // let updatedSyllabusLessonData: any = {
    //   id: state.syllabusLessonID,
    //   status: state.open ? 'Active' : 'Inactive',
    //   complete: state.complete ? state.complete : false,
    //   viewing:
    //     state.studentViewing.studentInfo && state.studentViewing.studentInfo.personAuthID
    //       ? state.studentViewing.studentInfo.personAuthID
    //       : null,
    //   displayData: state.displayData,
    //   lessonPlan: state.pages,
    //   startDate: '1989-11-02',
    //   endDate: '2077-11-02',
    // };
    //
    // try {
    //   console.log('attempt handle update syl lesson: ', updatedSyllabusLessonData);
    //   const updatedSyllabusLesson = await API.graphql(
    //     graphqlOperation(customMutations.updateSyllabusLesson, {
    //       input: updatedSyllabusLessonData,
    //     })
    //   );
    //   dispatch({type: 'SAVED_CHANGES'});
    // } catch (err) {
    //   console.error('handleUpdateSyllabusLesson - ', err);
    // }
  };

  /**
   * CLASSROOM CONTROL AND UPDATING PLANNER
   * close the lesson off in the planner
   */
  const handleCompletePlanner = async () => {
    // let completedSyllabusLessonData = {
    //   id: state.syllabusLessonID,
    //   status: 'Inactive',
    //   complete: true,
    //   endDate: awsFormatDate(dateString('-', 'WORLD')),
    // };
    //
    // try {
    //   const completedSyllabusLesson = await API.graphql(
    //     graphqlOperation(customMutations.updateSyllabusLesson, {
    //       input: completedSyllabusLessonData,
    //     })
    //   );
    //   dispatch({type: 'SAVED_CHANGES'});
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleOpenPlanner = async () => {
    // let startedSyllabusLessonData = {
    //   id: state.syllabusLessonID,
    //   status: 'Active',
    //   complete: false,
    //   startDate: awsFormatDate(dateString('-', 'WORLD')),
    // };
    //
    // try {
    //   console.log(startedSyllabusLessonData);
    //   const startedSyllabusLesson = await API.graphql(
    //     graphqlOperation(customMutations.updateSyllabusLesson, {
    //       input: startedSyllabusLessonData,
    //     })
    //   );
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <div className={`w-full h-screen bg-gray-200 overflow-hidden`}>
      <div className={`relative w-full h-full flex flex-col`}>
        {/* QUICK REGISTER */}

        {quickRegister && (
          <QuickRegister active={quickRegister} setQuickRegister={setQuickRegister} />
        )}

        {/* USER MANAGEMENT */}
        <div
          className={`${visible ? 'absolute z-100 h-full' : 'hidden'}`}
          onClick={handleClick}>
          <PositiveAlert
            identifier={''}
            alert={visible}
            setAlert={setVisible}
            header="Are you sure you want to leave the Teacher View?"
            button1="Go to student management"
            button2="Cancel"
            svg="question"
            handleButton1={handleGoToUserManagement}
            handleButton2={() => handleClick}
            theme="light"
            fill="screen"
          />
        </div>
        {/* HANDLE GO  HOME */}
        <div
          className={`${homePopup ? 'absolute z-100 h-full' : 'hidden'}`}
          onClick={handleHomePopup}>
          <PositiveAlert
            identifier={''}
            alert={homePopup}
            setAlert={setHomePopup}
            header="Are you sure you want to leave the Teacher View?"
            button1="Go to the dashboard"
            button2="Cancel"
            svg="question"
            handleButton1={handleHome}
            handleButton2={() => handleHomePopup}
            theme="light"
            fill="screen"
          />
        </div>
        <div
          className={`${lessonButton ? 'absolute z-100 h-full' : 'hidden'}`}
          onClick={handleLessonButton}>
          <PositiveAlert
            identifier={''}
            alert={lessonButton}
            setAlert={setLessonButton}
            header="Are you sure you want to complete this lesson?"
            button1="Complete lesson"
            button2="Cancel"
            svg="question"
            handleButton1={() => {
              handleComplete();
            }}
            handleButton2={() => handleLessonButton}
            theme="light"
            fill="screen"
          />
        </div>

        {/* START TOP MENU */}

        <TopMenu
          isSameStudentShared={isSameStudentShared}
          handleOpen={handleOpen}
          handleComplete={handleComplete}
          handleLessonButton={handleLessonButton}
          handleQuitViewing={handleQuitViewing}
          handleShareStudentData={handleShareStudentData}
          handleQuitShare={handleQuitShare}
          handleClick={handleClick}
          handleHomePopup={handleHomePopup}
          handlePageChange={handlePageChange}
          setQuickRegister={setQuickRegister}
        />

        {/* END TOP MENU */}

        <div className={`w-full h-8.5/10 flex rounded-lg`}>
          {/* LEFT SECTION */}
          <div
            className={`${
              fullscreen ? 'hidden' : ''
            } w-4/10 min-w-100 max-w-160 h-full flex flex-col items-center `}>
            <div className={`h-full w-full flex flex-col justify-between items-center`}>
              <div className={`h-full`}>
                <ErrorBoundary fallback={<h1>Error in the Classroster</h1>}>
                  <ClassRoster
                    handleUpdateSyllabusLesson={handleUpdatePlanner}
                    handleShareStudentData={handleShareStudentData}
                    isSameStudentShared={isSameStudentShared}
                    handleQuitShare={handleQuitShare}
                    handleQuitViewing={handleQuitViewing}
                    handlePageChange={handlePageChange}
                    handleRoomUpdate={handleRoomUpdate}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div
            className={`relative 
            ${fullscreen ? 'w-full' : 'w-6/10'} relative 
            w-6/10 lg:w-full h-full flex flex-col items-center`}>
            <StudentWindowTitleBar
              handleFullscreen={handleFullscreen}
              fullscreen={fullscreen}
            />

            <div
              className={`
                          ${fullscreen ? 'h-full' : 'h-full'}
                          ${theme.bg} 
                          relative w-full  
                          border-t-2 border-black
                          overflow-y-scroll overflow-x-hidden`}>
              {/**
               *
               * COMPONENT
               *
               * */}
              <div className={`h-full p-4`}>
                <Suspense
                  fallback={
                    <div className="min-h-screen w-full flex flex-col justify-center items-center">
                      <ComponentLoading />
                    </div>
                  }>
                  {/**
                   *
                   *
                   * THIS LOADS THE LESSON COMPONENT
                   *
                   *
                   */}
                  <ErrorBoundary fallback={<h1>Error in the Teacher's Lesson</h1>}>
                    <CoreUniversalLesson />
                  </ErrorBoundary>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonControl;
