import Loader from '@components/Atoms/Loader';
import Navbar from '@components/Molecules/Navbar';
import useAuth from '@customHooks/useAuth';
import {logError, updatePageState} from '@graphql/functions';
import {useQuery} from '@tanstack/react-query';
import {reorderSyllabus, withZoiqFilter} from '@utilities/functions';
import {UserPageState} from 'API';
import {API, graphqlOperation} from 'aws-amplify';

import {GameChangerProvider} from 'components/Dashboard/GameChangers/context/GameChangersContext';

import Home from 'components/Dashboard/Home/Home';
import HomeForTeachers from 'components/Dashboard/Home/HomeForTeachers';

import ErrorBoundary from 'components/Error/ErrorBoundary';
import EmojiFeedback from 'components/General/EmojiFeedback';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
import React, {lazy, Suspense, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {setLocalStorageData} from 'utilities/localStorage';
// Routes
const Classroom = lazy(() => import('dashboard/Classroom/Classroom'));
const UploadLogsPage = lazy(() => import('dashboard/Csv/UploadLogsPage'));
const GameChangers = lazy(() => import('dashboard/GameChangers/GameChangers'));
const Anthology = lazy(() => import('dashboard/Anthology/Anthology'));
const Profile = lazy(() => import('dashboard/Profile/Profile'));
const Registration = lazy(() => import('dashboard/Admin/UserManagement/Registration'));
const ErrorsPage = lazy(() => import('dashboard/Errors/ErrorsPage'));
const DictionaryPage = lazy(() => import('dashboard/Dictionary/DictionaryPage'));
const Community = lazy(() => import('components/Community/Community'));
const InstitutionsHome = lazy(
  () => import('dashboard/Admin/Institutons/InstitutionsHome')
);
const Csv = lazy(() => import('dashboard/Csv/Csv'));

const conditionalRender = (children: JSX.Element, condition: boolean) => {
  if (condition) {
    return children;
  } else {
    return <Redirect to={`/dashboard/home`} />;
  }
};

type userObject = {
  [key: string]: any;
};

export interface ICompletedLessons {
  lessonID: string;
  time: string;
}

export interface DashboardProps {
  setClassroomCurriculum?: any;
  classroomCurriculum?: any;
  classRoomActiveSyllabus?: string;
  loading?: boolean;
  isTeacher?: boolean;
  loadingRoomInfo?: boolean;
  isOnDemandStudent?: boolean;
  syllabusActivating?: boolean;
  updateAuthState?: Function;
  currentPageData?: any[];
  setCurrentPageData?: React.Dispatch<any>;
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  activeRoom?: string;
  setActiveRoom?: React.Dispatch<React.SetStateAction<string>>;
  activeRoomInfo?: any;
  setActiveRoomInfo?: React.Dispatch<React.SetStateAction<any>>;
  activeRoomName?: string;
  setActiveRoomName?: React.Dispatch<React.SetStateAction<string>>;
  visibleLessonGroup?: string;
  setVisibleLessonGroup?: React.Dispatch<React.SetStateAction<string>>;
  handleSyllabusActivation?: (syllabusID: string) => void;
  lessonLoading?: boolean;
  setLessonLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  syllabusLoading?: boolean;
  setSyllabusLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleRoomSelection?: Function;
  completedLessons?: ICompletedLessons[];
  curriculumName?: string;
  institutionId?: string;
  institute?: any;
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  roomsLoading?: boolean;
  [key: string]: any;
}

const Dashboard = () => {
  const {
    zoiqFilter,
    updateAuthState,
    state: {user: stateUser, currentPage, roomData, activeRoom},
    // clientKey,
    dispatch
  } = useGlobalContext();

  const match = useRouteMatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  // const {notifications} = useNotifications('global');

  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();

  const [activeRoomName, setActiveRoomName] = useState<string>('');

  const [isPageUpdatedOnPersonTable, setIsPageUpdatedOnPersonTable] = useState(false);

  useEffect(() => {
    if (!isPageUpdatedOnPersonTable && stateUser.role === 'ST') {
      updatePageState(
        UserPageState.DASHBOARD,
        {
          authId: stateUser?.authId,
          email: stateUser?.email,
          pageState: stateUser?.pageState
        },
        () => {
          dispatch({
            type: 'UPDATE_PAGE_STATE',
            payload: {
              pageState: UserPageState.DASHBOARD,
              lastPageStateUpdate: new Date().toISOString()
            }
          });
        }
      );

      setIsPageUpdatedOnPersonTable(true);
    }
  }, [isPageUpdatedOnPersonTable, stateUser.role]);

  useEffect(() => {
    if (currentPage === 'homepage') {
      dispatch({
        type: 'RESET_ROOMDATA',
        payload: {}
      });
    }
  }, [currentPage]);

  // ##################################################################### //
  // ############################ USER LOADING ########################### //
  // ##################################################################### //
  const [userData, setUserData] = useState({
    role: '',
    image: ''
  });

  const isStudent = userData.role === 'ST';
  const isTeacher = stateUser?.role === 'FLW' || stateUser?.role === 'TR';
  const isOnDemandStudent = stateUser?.onDemand;

  const {setUser: setUserFromAuth} = useAuth();

  const setUser = (user: userObject) => {
    setUserData({
      role: user.role,
      image: user?.image
    });
    let firstName = user.preferredName ? user.preferredName : user.firstName;

    setUserFromAuth(user);

    setCookie(
      'auth',
      {...cookies.auth, role: user.role, firstName: firstName, id: user.id},
      {path: '/'}
    );
  };

  useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: !stateUser?.firstName,
    onSuccess(data) {
      setUser(data);
    }
  });

  async function getUser() {
    const userEmail = stateUser?.email ? stateUser?.email : cookies.auth?.email;
    const userAuthId = stateUser?.authId ? stateUser?.authId : cookies.auth?.authId;
    try {
      const queryObj = {
        name: 'queries.getPerson',
        valueObj: {email: userEmail, authId: userAuthId}
      };

      const user: any = await API.graphql(
        graphqlOperation(queries.getPerson, queryObj.valueObj)
      );
      return user.data.getPerson;
    } catch (error) {
      console.log('Removing cookies - Something went wrong');
      if (!userEmail && !userAuthId) {
        removeCookie('auth', {path: '/'});
        dispatch({type: 'CLEANUP'});
        sessionStorage.removeItem('accessToken');
        updateAuthState(false);
      }
      logError(error, {authId: userAuthId, email: userEmail}, 'Dashboard @getUser');
      console.error('Dashboard - getUser(): ', error);
    }
  }

  useEffect(() => {
    if (!stateUser?.firstName) {
      // do nothing
    } else {
      setUserData({
        role: stateUser?.role,
        image: stateUser?.image
      });
    }
  }, [stateUser?.role]);

  // ~~~~ DISABLE ROOM LOADING FOR ADMIN ~~~ //

  useEffect(() => {
    // const userRole = stateUser?.role;
    // if (userRole === 'SUP' || userRole === 'ADM') {
    //   setRoomsLoading(true);
    // }
    setLocalStorageData('last_page', 'dashboard');
  }, []);

  // ##################################################################### //
  // ########################### LOADING STATUS ########################## //
  // ##################################################################### //

  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(true);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);

  // ##################################################################### //
  // ############################# HOME DATA ############################# //
  // ##################################################################### //

  // Fetching results
  const [homeDataForTeachers, setHomeDataForTeachers] = useState<any[]>([]);
  const [homeData, setHomeData] = useState<{class: any}[]>();

  const [classList, setClassList] = useState<any[]>();
  const [curriculumIds, setCurriculumIds] = useState<string>('');
  const [curriculumObj, setCurriculumObj] = useState<any>({});

  /******************************************
   * 1.1 PROCESS STUDENT ROOM FETCHING      *
   ******************************************/

  const getDashboardData = async (authId: string, email: string) => {
    try {
      setRoomsLoading(true);
      const queryObj = {
        name: 'customQueries.getDashboardData',
        valueObj: {
          authId: authId,
          email: email
        }
      };
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );

      // @ts-ignore
      let arrayOfResponseObjects =
        (await dashboardDataFetch?.data?.getPerson?.classes?.items) || [];

      if (arrayOfResponseObjects && arrayOfResponseObjects.length) {
        arrayOfResponseObjects = arrayOfResponseObjects.filter(
          (item: any) => item.class !== null
        );
      }

      setHomeData(arrayOfResponseObjects);
    } catch (error) {
      logError(error, {authId: authId, email: email}, 'Dashboard @getDashboardData');

      console.error('getDashbaordData -> ', error);
    } finally {
      // need to do some cleanup
      setRoomsLoading(false);
    }
  };

  const getDashboardDataForTeachers = async (teacherAuthID: string) => {
    setRoomsLoading(true);
    try {
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}}
        })
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}}
        })
      );
      const response = await dashboardDataFetch;
      let arrayOfResponseObjects = [
        ...response?.data?.listRooms?.items,
        ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items?.map(
          (item: any) => ({
            ...item,
            ...item.room,
            teacher: item.room?.teacher
          })
        )
      ];
      arrayOfResponseObjects = arrayOfResponseObjects.map(() => {
        return {class: {rooms: {items: arrayOfResponseObjects}}};
      });
      // console.log('dashboard data teachers - ', arrayOfResponseObjects);

      setHomeDataForTeachers(arrayOfResponseObjects);
    } catch (error) {
      logError(
        error,
        {authId: stateUser?.authId, email: stateUser?.email},
        'Dashboard @getDashboardDataForTeachers'
      );
      console.error('getDashboardDataForTeachers -> ', error);
    } finally {
      // need to do some cleanup
      setRoomsLoading(false);
    }
  };

  const refetchHomeData = () => {
    const authId = stateUser?.authId;
    const email = stateUser?.email;

    if (stateUser?.role === 'ST') {
      getDashboardData(authId, email);
    } else {
      getDashboardDataForTeachers(authId);
    }
  };

  useEffect(() => {
    refetchHomeData();
  }, [stateUser?.role]);

  /******************************************
   * 1.2 REDUCE ROOMS FROM CLASSLIST ARRAY  *
   ******************************************/

  const getClassList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          return [
            ...acc,
            {
              name: dataObj?.class?.name,
              room: dataObj?.class?.room,
              students: dataObj?.class?.students
            }
          ];
        }, [])
      : [];

  useEffect(() => {
    if (homeData?.length && getClassList.length) {
      setClassList(getClassList);
    }
  }, [homeData]);

  const getRoomsFromClassList = () => {
    let rooms: any = [];
    classList && classList.length
      ? classList.forEach((classObj) =>
          classObj.room ? rooms.push(classObj.room) : null
        )
      : null;
    return rooms;
  };

  useEffect(() => {
    const studentRoomsList = getRoomsFromClassList();
    // console.log('studentRoomsList - ', studentRoomsList);
    setLocalStorageData('room_list', studentRoomsList);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'rooms',
        data: studentRoomsList
      }
    });
  }, [classList]);

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  /***********************************************
   *    THIS FUNCTION CAN ACTUALLY BE REMOVED    *
   * IT'S ACTUALLY RETURNING THE SAME (BUT LESS) *
   *    DATA AS GETDASHBOARDDATAFORTEACHERS()    *
   *    AND ESSENTIALLY USING THE SAME QUERY     *
   ***********************************************/

  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const queryObj = {
        name: 'customQueries.listRooms',
        valueObj: {
          filter: withZoiqFilter({teacherAuthID: {eq: teacherAuthID}}, zoiqFilter)
        }
      };

      const classIdFromRoomsFetch: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, queryObj.valueObj)
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}}
        })
      );
      //@ts-ignore
      const arrayOfResponseObjects = [
        ...classIdFromRoomsFetch?.data?.listRooms?.items,
        ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items?.map(
          (item: any) => ({
            ...item,
            ...item.room,
            teacher: item.room?.teacher
          })
        )
      ];

      setLocalStorageData('room_list', arrayOfResponseObjects);

      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'rooms',
          data: arrayOfResponseObjects
        }
      });
    } catch (e) {
      logError(
        e,
        {authId: stateUser?.authId, email: stateUser?.email},
        'Dashboard @listRoomTeacher'
      );
      console.error('Classes Fetch ERR: ', e);
    }
  };

  useEffect(() => {
    if (stateUser?.role === 'FLW' || stateUser?.role === 'TR') {
      const teacherAuthID = stateUser?.authId;
      listRoomTeacher(teacherAuthID);
    }
  }, [stateUser?.role]);

  /**********************************
   * 3. LIST CURRICULUMS BY ROOM ID *
   **********************************/
  const listRoomCurriculums = async () => {
    // removeLocalStorageData('curriculum_id');
    if (roomData.rooms.length > 0) {
      try {
        // const roomCurriculumsFetch = await handleFetchAndCache(queryObj);
        const roomCurriculumsFetch = await API.graphql(
          graphqlOperation(customQueries.listRoomCurriculums, {
            filter: {
              roomID: {eq: activeRoom}
            }
          })
        );

        const response = roomCurriculumsFetch;
        // @ts-ignore
        const arrayOfResponseObjects = response?.data?.listRoomCurricula?.items;

        if (arrayOfResponseObjects.length > 0) {
          setCurriculumIds(arrayOfResponseObjects[0]?.curriculumID);
          setCurriculumObj(arrayOfResponseObjects[0]?.curriculum);
        }
      } catch (e) {
        logError(
          e,
          {authId: stateUser?.authId, email: stateUser?.email},
          'Dashboard @listRoomCurriculums'
        );
        console.error('RoomCurriculums fetch ERR: ', e);
      } finally {
        // console.log('curriciulum ids - ', curriculumIds);
      }
    }
  };

  useEffect(() => {
    if (activeRoom && activeRoom !== '') {
      listRoomCurriculums();
    }
  }, [activeRoom]);

  const [loadingRoomInfo, setLoadingRoomInfo] = useState(true);

  // Save info of selected room to cookie
  useEffect(() => {
    setLoadingRoomInfo(true);
    const getRoomFromState = roomData.rooms.find((room: any) => room.id === activeRoom);

    if (getRoomFromState) {
      setLocalStorageData('room_info', getRoomFromState);

      setActiveRoomInfo(getRoomFromState);
      setLoadingRoomInfo(false);
    }
  }, [activeRoom]);

  // ##################################################################### //
  // ######################### SCHEDULE AND TIMES ######################## //
  // ##################################################################### //

  /********************
   * 5. LIST SYLLABUS *
   ********************/

  const listSyllabus = async () => {
    setSyllabusLoading(true);

    try {
      // ~~~~~~~~~~~~~~ CURRICULUM ~~~~~~~~~~~~~ //
      let getCurriculum = await API.graphql(
        graphqlOperation(customQueries.getCurriculumForClasses, {
          id: curriculumIds
        })
      );
      // @ts-ignore
      let response = await getCurriculum.data.getCurriculum;

      let syllabi = response.universalSyllabus.items;
      let sequence = response.universalSyllabusSeq;

      let mappedResponseObjects = reorderSyllabus(syllabi, sequence);

      //TODO: combine these dispatches
      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          syllabus: mappedResponseObjects,
          curriculum: {id: response.id, name: response.name}
        }
      });
    } catch (e) {
      logError(
        e,
        {authId: stateUser?.authId, email: stateUser?.email},
        'Dashboard @listSyllabus'
      );
      console.error('Curriculum ids ERR: ', e);
      setSyllabusLoading(false);
    } finally {
      setSyllabusLoading(false);
    }
  };

  useEffect(() => {
    const getSyllabusAndSchedule = async () => {
      await listSyllabus();
    };
    if (curriculumIds !== '' && activeRoom) {
      getSyllabusAndSchedule();
    }
  }, [activeRoom, curriculumIds]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - LESSONS                         *
   ******************************************/

  const listSyllabusLessons = async (syllabusID: string) => {
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'lessons',
        data: []
      }
    });

    /**
     * IF there are any syllabus active, do a fetch for lessons
     */

    try {
      setLessonLoading(true);
      const syllabusLessonFetch = await API.graphql(
        graphqlOperation(customQueries.getUniversalSyllabus, {
          id: syllabusID
        })
      );
      //@ts-ignore
      const response = await syllabusLessonFetch.data.getUniversalSyllabus;
      const lessons = response?.lessons.items
        .map((t: any) => {
          let index = response?.universalLessonsSeq?.indexOf(t.id);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          activeSyllabus: response,
          lessons: lessons
        }
      });
    } catch (e) {
      logError(
        e,
        {authId: stateUser?.authId, email: stateUser?.email},
        'Dashboard @listSyllabusLessons'
      );
      console.error('syllabus lessons: ', e);
    } finally {
      setLessonLoading(false);
    }
  };

  // ~~~~~~~~ TRIGGER LESSON LOADING ~~~~~~~ //
  useEffect(() => {
    if (activeRoomInfo?.activeSyllabus) {
      listSyllabusLessons(activeRoomInfo.activeSyllabus);
    }
  }, [activeRoomInfo]);

  // ##################################################################### //
  // ######################## NAVIGATION AND STATE ####################### //
  // ##################################################################### //
  const [currentPageLocal] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('open');

  const handleRoomSelection = (
    id: string,
    name: string,
    _: number,
    route = 'classroom'
  ) => {
    const getRoomSyllabus = roomData.rooms.find((roomObj: any) => roomObj.id === id);
    if (
      (activeRoom !== id && currentPage !== 'lesson-planner') ||
      (activeRoom !== id && currentPage !== 'classroom')
    ) {
      setActiveRoomName(name);
      dispatch({
        type: 'UPDATE_ACTIVEROOM',
        payload: {roomID: id, name: name, syllabusID: getRoomSyllabus?.activeSyllabus}
      });

      history.push(`/dashboard/${route}/${id}`);
    }
  };

  const HomeSwitch = () =>
    !isStudent ? (
      <ErrorBoundary componentName="HomeForTeachers">
        <HomeForTeachers
          homeData={homeDataForTeachers}
          isTeacher={isTeacher}
          activeRoomInfo={activeRoomInfo}
          setActiveRoomInfo={setActiveRoomInfo}
          handleRoomSelection={handleRoomSelection}
          roomsLoading={roomsLoading}
        />
      </ErrorBoundary>
    ) : (
      <ErrorBoundary componentName="Home">
        <Home
          homeData={homeData}
          classList={classList}
          activeRoomInfo={activeRoomInfo}
          setActiveRoomInfo={setActiveRoomInfo}
          handleRoomSelection={handleRoomSelection}
          roomsLoading={roomsLoading}
        />
      </ErrorBoundary>
    );

  return (
    <>
      <Navbar />
      <div className="relative h-screen flex overflow-hidden bg-lightest  ">
        {stateUser?.role === 'ST' && <EmojiFeedback />}
        {/* <ResizablePanels> */}

        <div
          className={`h-full w-full ${
            window.location.pathname.includes('game-changers')
              ? 'overflow-hidden'
              : 'overflow-y-auto'
          }`}>
          {/*<FloatingSideMenu />*/}
          {/* {!isGameChangers && <Noticebar notifications={notifications} />} */}

          <Suspense
            fallback={
              <div className="min-h-screen w-full flex flex-col justify-center items-center">
                <Loader />
              </div>
            }>
            <Switch>
              <Route
                path={`${match.url}`}
                exact
                render={() => {
                  if (userData && userData.role !== '') {
                    if (userData.role === 'FLW' || userData.role === 'TR') {
                      return <Redirect to={`${match.url}/home`} />;
                    } else if (userData.role === 'ST') {
                      return <Redirect to={`${match.url}/home`} />;
                    } else {
                      return !stateUser?.associateInstitute?.length ||
                        stateUser?.associateInstitute?.length > 1 ? (
                        <Redirect to={`${match.url}/manage-institutions`} />
                      ) : (
                        <Redirect
                          to={`${match.url}/manage-institutions/institution/${stateUser?.associateInstitute[0].institution.id}/staff`}
                        />
                      );
                    }
                  } else
                    return (
                      <div className="min-h-screen w-full flex flex-col justify-center items-center">
                        <Loader />
                      </div>
                    );
                }}
              />
              <Route
                exact
                path={`${match.url}/home`}
                render={() => (
                  <ErrorBoundary
                    componentName="HomeSwitch"
                    fallback={<h1>Oops with the Dashboard</h1>}>
                    <HomeSwitch />
                  </ErrorBoundary>
                )}
              />
              <Route
                // exact
                path={`${match.url}/community/:action`}
                render={() => (
                  <ErrorBoundary
                    componentName="Community"
                    fallback={<h1>Community Page is not working</h1>}>
                    <Community />
                  </ErrorBoundary>
                )}
              />

              <Route
                // exact
                path={`${match.url}/game-changers`}
                render={() => (
                  <ErrorBoundary
                    componentName="GameChangers"
                    fallback={<h1>Game changers is not working</h1>}>
                    <GameChangerProvider>
                      <GameChangers />
                    </GameChangerProvider>
                  </ErrorBoundary>
                )}
              />

              <Route
                exact
                path={`${match.url}/csv`}
                render={() =>
                  conditionalRender(
                    <ErrorBoundary
                      componentName="Csv"
                      fallback={<h1>CSV is not working</h1>}>
                      <Csv />
                    </ErrorBoundary>,
                    userData.role === 'SUP' ||
                      userData.role === 'ADM' ||
                      userData.role === 'TR' ||
                      userData.role === 'FLW' ||
                      userData.role === 'BLD'
                  )
                }
              />

              <Route
                exact
                path={`${match.url}/classroom/:roomId`}
                render={() => (
                  <ErrorBoundary
                    componentName="Classroom"
                    fallback={<h1>Oops with the Classroom</h1>}>
                    <Classroom
                      setClassroomCurriculum={setCurriculumObj}
                      classroomCurriculum={curriculumObj}
                      isTeacher={isTeacher}
                      isOnDemandStudent={isOnDemandStudent}
                      homeData={!isStudent ? homeDataForTeachers : homeData}
                      loadingRoomInfo={loadingRoomInfo}
                      currentPage={currentPageLocal}
                      activeRoomInfo={activeRoomInfo}
                      setActiveRoomInfo={setActiveRoomInfo}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      handleRoomSelection={handleRoomSelection}
                      syllabusLoading={syllabusLoading}
                    />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/anthology`}
                render={() => (
                  <ErrorBoundary
                    componentName="Anthology"
                    fallback={<h1>Oops with the Anthology</h1>}>
                    <Anthology
                      studentAuthID={stateUser?.authId}
                      studentID={stateUser?.id}
                      studentEmail={stateUser?.email}
                      studentName={stateUser?.firstName}
                    />
                  </ErrorBoundary>
                )}
              />
              {/* <Route
                path={`${match.url}/noticeboard`}
                render={() => (
                  <ErrorBoundary
                    componentName="NoticeboardAdmin"
                    fallback={<h1>Oops with the NoticeboardAdmin</h1>}
                  >
                    <NoticeboardAdmin />
                  </ErrorBoundary>
                )}
              /> */}
              <Route
                path={`${match.url}/registration`}
                render={() => (
                  <ErrorBoundary
                    componentName="Registration"
                    fallback={<h1>Oops with the Registration</h1>}>
                    <Registration />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/profile`}
                render={() => (
                  <ErrorBoundary componentName="Profile">
                    <Profile />
                  </ErrorBoundary>
                )}
              />
              {/* <Route path={`${match.url}/test-cases`} render={() => <TestCases />} /> */}
              <Route
                path={`${match.url}/errors`}
                render={() => (
                  <ErrorBoundary componentName="Errors">
                    <ErrorsPage />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/dictionary`}
                render={() => (
                  <ErrorBoundary componentName="Dictionary">
                    <DictionaryPage />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/upload-logs`}
                render={() => (
                  <ErrorBoundary componentName="UploadLogs">
                    <UploadLogsPage />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/lesson-planner/:roomId`}
                render={() => (
                  <ErrorBoundary
                    componentName="LessonPlanHome"
                    fallback={<h1>Oops with the Lesson-Planner</h1>}>
                    <Classroom
                      setClassroomCurriculum={setCurriculumObj}
                      classroomCurriculum={curriculumObj}
                      isTeacher={isTeacher}
                      isOnDemandStudent={isOnDemandStudent}
                      homeData={!isStudent ? homeDataForTeachers : homeData}
                      loadingRoomInfo={loadingRoomInfo}
                      currentPage={currentPageLocal}
                      activeRoomInfo={activeRoomInfo}
                      setActiveRoomInfo={setActiveRoomInfo}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      handleRoomSelection={handleRoomSelection}
                      syllabusLoading={syllabusLoading}
                    />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/manage-institutions`}
                render={() => (
                  <ErrorBoundary componentName="InstitutionsHome">
                    <InstitutionsHome />
                  </ErrorBoundary>
                )}
              />
              {/* <Route
                path={`${match.url}/question-bank`}
                render={() => (
                  <ErrorBoundary componentName="QuestionBank">
                    <QuestionBank />
                  </ErrorBoundary>
                )}
              /> */}
            </Switch>
          </Suspense>
        </div>
        {/* </ResizablePanels> */}
      </div>
      <div className="w-full flex justify-center items-center bg-darkest"></div>
    </>
  );
};

export default Dashboard;
