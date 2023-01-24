import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {getDictionaries} from '@graphql/functions';
import {UniversalLessonStudentData as UniversalLessonStudentDataFromAPI} from 'API';
import {GlobalContext} from 'contexts/GlobalContext';
import {useNotifications} from 'contexts/NotificationContext';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
import useLessonControls from 'customHooks/lessonControls';
import useAuth from 'customHooks/useAuth';
import {
  StudentPageInput,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import {isEmpty} from 'lodash';
import React, {Suspense, useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import ErrorBoundary from '../Error/ErrorBoundary';
import PositiveAlert from '../General/Popup';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import CoreUniversalLesson from '../Lesson/UniversalLesson/views/CoreUniversalLesson';
import ClassRoster from './ClassRoster';
import RosterFrame from './ClassRoster/RosterFrame';
import Frame from './Frame';
import AttendanceFrame from './StudentWindow/AttendanceFrame';
// import AttendanceFrame from './StudentWindow/AttendanceFrame';
import LessonFrame from './StudentWindow/LessonFrame';
import LessonInfoFrame from './StudentWindow/LessonInfoFrame';
import ProfileFrame from './StudentWindow/ProfileFrame';

export const checkIfLessonIsCompleted = (roomData: any, lessonID: string) => {
  return (
    roomData?.completedLessons?.findIndex(
      (item: {lessonID?: string | null; time?: string | null}) =>
        item.lessonID === lessonID
    ) > -1
  );
};

const LessonControl = () => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);

  const dispatch = gContext.dispatch;

  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const controlState = gContext.controlState;
  const roster = controlState.roster;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;

  const match = useRouteMatch();
  const history = useHistory();
  const urlParams: any = useParams();
  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const handlePageChange = (pageNr: number) => {
    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});
    history.push(`${match.url}/${pageNr}`);
  };

  const [fullscreen, setFullscreen] = useState(false);
  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  // view: 'lesson' | 'lessonInfo' | 'profile';
  const [rightView, setRightView] = useState<{
    view: string;
    option?: string;
  }>({view: 'lesson', option: ''});

  // ##################################################################### //
  // ######################### SUBSCRIPTION SETUP ######################## //
  // ##################################################################### //

  let subscription: any;
  const [subscriptionData, setSubscriptionData] = useState<any>();

  // ----------- 1 ---------- //

  const subscribeToStudent = () => {
    const {lessonID} = urlParams;
    const syllabusID = getRoomData.activeSyllabus; // in the table this is called SyllabusLessonID, but it's just the syllabusID

    const studentDataSubscription = API.graphql(
      graphqlOperation(customSubscriptions.onChangeUniversalLessonStudentData, {
        studentAuthID: lessonState.studentViewing,
        syllabusLessonID: syllabusID,
        lessonID: lessonID
      })
      //@ts-ignore
    ).subscribe({
      next: (studentData: any) => {
        const updatedStudentData =
          studentData.value.data.onChangeUniversalLessonStudentData;

        setSubscriptionData(updatedStudentData);
      }
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
      payload: {stDataIdx: getPageIdx, subData: getPageData}
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
          pageIdx: PAGES.findIndex(
            (lessonPlanObj: any) => lessonPlanObj.id === dataObj.lessonPageID
          ),
          lessonPageID: dataObj.lessonPageID,
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
  /*************************************************
   * GETS THE INITIAL STUDENT DATA FOR EACH PAGE,  *
   *    THEN SETS THE SUBSCRIPTION SO THAT EACH    *
   * TIME A PAGE IS UPDATED, TEACHER RECEIVES THIS *
   *                  INFORMATION                  *
   *************************************************/

  const loopFetchStudentData = async (
    filterObj: any,
    nextToken: string,
    outArray: any[]
  ) => {
    if (filterObj) {
      try {
        let studentData: any = await API.graphql(
          graphqlOperation(customQueries.listUniversalLessonStudentDatas, {
            ...filterObj,
            nextToken: nextToken
          })
        );
        let studentDataRows = studentData.data.listUniversalLessonStudentData.items;
        let theNextToken = studentData.data.listUniversalLessonStudentData?.nextToken;

        /**
         * combination of last fetch results
         * && current fetch results
         */
        let combined = [...outArray, ...studentDataRows];

        if (theNextToken) {
          loopFetchStudentData(filterObj, theNextToken, combined);
        } else {
          // console.log('no more - ', combined);
          return combined;
        }
      } catch (e) {
        console.error('loopFetchStudentData - ', e);
        return [];
      }
    } else {
      return [];
    }
  };

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);
  const PAGES = lessonState?.lessonData?.lessonPlan;

  const _loopFetchStudentData = async (): Promise<UniversalLessonStudentDataFromAPI[]> =>
    new Promise(async (resolve) => {
      try {
        const {lessonID} = urlParams;

        setLessonDataLoaded(false);
        // fetch by pages

        let result: any = [];

        await Promise.all(
          PAGES.map(async (page: any, idx: number) => {
            let studentData: any = await API.graphql(
              graphqlOperation(customQueries.getUniversalLessonStudentData, {
                id: `${lessonState.studentViewing}-${getRoomData.id}-${lessonID}-${page.id}`
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

  const getStudentData = async (studentAuthId: string) => {
    try {
      // existing student rows
      const studentDataRows: UniversalLessonStudentDataFromAPI[] = await (
        await _loopFetchStudentData()
      ).filter(Boolean);

      if (studentDataRows.length > 0) {
        subscription = subscribeToStudent();

        const existStudentDataIdArray = studentDataIdArray(studentDataRows);
        const filteredData = filterStudentData(existStudentDataIdArray, studentDataRows);

        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: existStudentDataIdArray,
            filteredStudentData: filteredData
          }
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
    if (lessonState.lessonData?.type !== 'survey') {
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
    } else {
      console.log(
        'lesson control - ',
        'not doing anything on view student because survey...'
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
      const lessonPlan = response.lessonPlan.reduce((acc: any[], page: any) => {
        return [
          ...acc,
          {
            id: page.id,
            label: page.label
          }
        ];
      }, []);

      // const dictionaries = await getDictionaries();

      // const updatedLessonPlan = scanLessonAndFindComplicatedWord(
      //   response.lessonPlan,
      //   dictionaries
      // );

      setLocalStorageData('lesson_plan', lessonPlan);
      lessonDispatch({
        type: 'SET_LESSON_DATA',
        payload: {...response, lessonPlan: response.lessonPlan}
      });
    } catch (e) {
      console.error('getSyllabusLesson() - error fetching lesson', e);
    }
  };

  const {clearNotification, setNotification} = useNotifications();

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    const {lessonID} = urlParams;

    if (lessonID) {
      const isCompleted = checkIfLessonIsCompleted(getRoomData, lessonID);

      if (!isCompleted || !isTeacher) {
        clearNotification();

        lessonDispatch({
          type: 'SET_INITIAL_STATE',
          payload: {universalLessonID: lessonID}
        });
        getSyllabusLesson(lessonID).then((_: void) =>
          console.log('Lesson Mount - ', 'Lesson fetched!')
        );
      } else {
        setNotification({title: 'Lesson/Survey is closed', show: true});
        history.push('/');
      }
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
    const {lessonID} = urlParams;

    const isCompleted = checkIfLessonIsCompleted(getRoomData, lessonID);
    if (!isCompleted || !isTeacher) {
      if (lessonState.lessonData) {
        // lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
        // history.push(`${match.url}/${0}`);

        const getRoomData = getLocalStorageData('room_info');
        setLocalStorageData('room_info', {...getRoomData, studentViewing: ''});

        if (PAGES && PAGES.length > 0) {
          lessonDispatch({
            type: 'SET_ROOM_SUBSCRIPTION_DATA',
            payload: {
              ClosedPages: getRoomData.ClosedPages,
              studentViewing: getRoomData.studentViewing
            }
          });
        }
      }
    }
  }, [lessonState.lessonData.id]);

  // ##################################################################### //
  // ################### OTHER SHARING / VIEWING LOGIC ################### //
  // ##################################################################### //

  const {resetViewAndShare, handleRoomUpdate} = useLessonControls();

  // ~~~~~~ AUTO PAGE NAVIGATION LOGIC ~~~~~ //
  useEffect(() => {
    if (lessonState.displayData[0].studentAuthID === '') {
      if (lessonState.studentViewing !== '') {
        const viewedStudentLocation = controlState.rosterActive.find(
          (student: any) => student.personAuthID === lessonState.studentViewing
        );

        let numbered = Number(viewedStudentLocation?.currentLocation) || 0;

        if (numbered !== undefined) {
          lessonDispatch({type: 'SET_CURRENT_PAGE', payload: numbered});
          history.push(`${match.url}/${numbered}`);
        } else {
          lessonDispatch({
            type: 'SET_CURRENT_PAGE',
            payload: lessonState?.currentPage ? lessonState.currentPage : 0
          });
          history.push(
            `${match.url}/${lessonState?.currentPage ? lessonState.currentPage : 0}`
          );

          /**********************************
           *   RESET VIEW AND SHARING IF    *
           *   THE CURRENT VIEWED STUDENT   *
           * EXITS THE LESSON WHILE TEACHER *
           *          WAS VIEWING           *
           **********************************/
          const reset = resetViewAndShare();
          Promise.resolve(reset).then((_: void) => {
            setUserHasLeftPopup(true);
          });
        }
      }
    }
  }, [controlState.roster, lessonState.studentViewing]);

  // ~~~~~ PREVENT DOUBLE SHARING LOGIC ~~~~ //
  const [isSameStudentShared, setIsSameStudentShared] = useState(false);

  // ##################################################################### //
  // ################### CLASSROOM AND PLANNER CONTROL ################### //
  // ##################################################################### //

  const [leavePopup, setLeavePopup] = useState(false);
  const [homePopup, setHomePopup] = useState(false);
  const [userHasLeftPopup, setUserHasLeftPopup] = useState(false);

  // ~~~~~~~~ TOGGLE POPUP & ACTIONS ~~~~~~~ //

  const handleLeavePopup = () => {
    setLeavePopup((prevState: any) => !prevState);
  };
  const handleHomePopup = () => {
    setHomePopup((prevState: any) => !prevState);
  };
  const handleUserHasLeftPopup = () => {
    setUserHasLeftPopup(!userHasLeftPopup);
  };

  // ~~~~~~~~~~~ POPUP NAVIGATION ~~~~~~~~~~ //

  const handleGoToUserManagement = () => {
    history.push('/dashboard/manage-users');
  };

  const handleHome = async () => {
    await handleRoomUpdate({id: getRoomData.id, studentViewing: ''});
    history.push(`/dashboard/lesson-planner/${getRoomData.id}`);
  };

  // ~~~~~~~~~~~~ SHARING CHECK ~~~~~~~~~~~~ //
  const anyoneIsViewed = lessonState.studentViewing !== '';
  const anyoneIsShared = lessonState.displayData[0].studentAuthID !== '';
  const isPresenting = lessonState.displayData[0].isTeacher === true;

  const {isTeacher, email, authId} = useAuth();

  useEffect(() => {
    if (isPresenting && !fullscreen) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  }, [isPresenting]);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  const {notification} = useNotifications();

  return (
    <div className={`w-full h-screen bg-gray-200 overflow-hidden`}>
      <div className={`relative w-full h-full flex flex-col`}>
        {/* QUICK REGISTER */}

        {notification.show && (
          <div
            className={`opacity-${
              notification.show
                ? '100 translate-x-0 transform z-100'
                : '0 translate-x-10 transform'
            } absolute bottom-5 right-5 w-96 py-4 px-6 rounded-md shadow bg-gray-800 duration-300 transition-all`}>
            <p className="text-white font-medium tracking-wide">{notification.title}</p>
          </div>
        )}

        {/* USER MANAGEMENT */}
        <div
          className={`${leavePopup ? 'absolute z-100 h-full' : 'hidden'}`}
          onClick={handleLeavePopup}>
          <PositiveAlert
            identifier={''}
            alert={leavePopup}
            setAlert={setLeavePopup}
            header="Are you sure you want to leave the Teacher View?"
            button1="Go to student management"
            button2="Cancel"
            svg="question"
            handleButton1={handleGoToUserManagement}
            handleButton2={() => handleLeavePopup}
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
        {/* USER HAS LEFT NOTIFICATION */}
        <div className={`${userHasLeftPopup ? 'absolute z-100 h-full' : 'hidden'}`}>
          <PositiveAlert
            identifier={''}
            alert={userHasLeftPopup}
            setAlert={setUserHasLeftPopup}
            header="The student you were viewing has left the room."
            button1="Close"
            svg="question"
            handleButton1={handleUserHasLeftPopup}
            theme="light"
            fill="screen"
          />
        </div>

        <div className={`relative w-full h-full flex flex-col lg:flex-row rounded-lg`}>
          {/* LEFT SECTION */}

          <RosterFrame
            fullscreen={fullscreen}
            theme={theme}
            clientKey={clientKey}
            rightView={rightView}
            setRightView={setRightView}>
            <ErrorBoundary
              authId={authId}
              email={email}
              componentName="Classroster"
              fallback={<h1>Error in the Classroster</h1>}>
              <ClassRoster
                isSameStudentShared={isSameStudentShared}
                handleQuitShare={handleQuitShare}
                handleQuitViewing={handleQuitViewing}
                handlePageChange={handlePageChange}
                handleRoomUpdate={handleRoomUpdate}
                rightView={rightView}
                setRightView={setRightView}
              />
            </ErrorBoundary>
          </RosterFrame>

          {/* RIGHT SECTION */}

          <Frame visible={true} additionalClass="z-40">
            <LessonFrame
              theme={theme}
              fullscreen={fullscreen}
              handleFullscreen={handleFullscreen}
              anyoneIsViewed={anyoneIsViewed}
              anyoneIsShared={anyoneIsShared}
              isPresenting={isPresenting}
              isSameStudentShared={isSameStudentShared}
              handleQuitShare={handleQuitShare}
              handleQuitViewing={handleQuitViewing}
              handlePageChange={handlePageChange}
              handleLeavePopup={handleLeavePopup}
              handleHomePopup={handleHomePopup}>
              <div
                className={`${
                  theme && theme.bg
                } relative w-full h-full border-t-2 border-black overflow-y-scroll overflow-x-hidden z-50`}>
                <Suspense
                  fallback={
                    <div className="min-h-screen w-full flex flex-col justify-center items-center">
                      <ComponentLoading />
                    </div>
                  }>
                  <ErrorBoundary
                    authId={authId}
                    email={email}
                    componentName="CoreUniversalLesson"
                    fallback={<h1>Error in the Teacher's Lesson</h1>}>
                    <CoreUniversalLesson />
                  </ErrorBoundary>
                </Suspense>
              </div>
            </LessonFrame>
          </Frame>
          {/* -- OR -- */}

          {/* RIGHT SECTION */}

          <Frame visible={rightView.view === 'lessonInfo'} additionalClass="z-50">
            <LessonInfoFrame
              visible={rightView.view === 'lessonInfo'}
              rightView={rightView}
              setRightView={setRightView}
            />
          </Frame>

          <Frame visible={rightView.view === 'profile'} additionalClass="z-50">
            <ProfileFrame
              visible={rightView.view === 'profile'}
              rightView={rightView}
              setRightView={setRightView}
              personAuthID={rightView.option}
              roster={roster}
            />
          </Frame>

          <Frame visible={rightView.view === 'attendance'} additionalClass="z-50">
            <AttendanceFrame
              selectedRoomId={getRoomData.id}
              visible={rightView.view === 'attendance'}
              rightView={rightView}
              setRightView={setRightView}
              studentID={rightView.option}
              roster={roster}
            />
          </Frame>
        </div>
      </div>
    </div>
  );
};

export default LessonControl;
