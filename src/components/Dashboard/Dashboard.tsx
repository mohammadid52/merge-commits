import React, {lazy, Suspense, useContext, useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import {GlobalContext} from '../../contexts/GlobalContext';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';

import SideMenu from './Menu/SideMenu';
import {useCookies} from 'react-cookie';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../customGraphql/customQueries';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';
import InstitutionsHome from './Admin/Institutons/InstitutionsHome';
import QuestionBank from './Admin/Questions/QuestionBank';
import LessonsBuilderHome from './Admin/LessonsBuilder/LessonsBuilderHome';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import NoticeboardAdmin from './NoticeboardAdmin/NoticeboardAdmin';
import Noticebar from '../Noticebar/Noticebar';
import Home from './Home/Home';
import HomeForTeachers from './Home/HomeForTeachers';
import ErrorBoundary from '../Error/ErrorBoundary';
import Csv from './Csv/Csv';
import UniversalLessonBuilder from '../Lesson/UniversalLessonBuilder/UniversalLessonBuilder';
import {UniversalLessonBuilderProvider} from '../../contexts/UniversalLessonBuilderContext';
import usePrevious from '../../customHooks/previousProps';
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from '../../utilities/localStorage';
import EmojiFeedback from '../General/EmojiFeedback';

const Classroom = lazy(() => import('./Classroom/Classroom'));
const Anthology = lazy(() => import('./Anthology/Anthology'));
const Profile = lazy(() => import('./Profile/Profile'));
const Registration = lazy(() => import('./Admin/UserManagement/Registration'));
const UserManagement = lazy(() => import('./Admin/UserManagement/UserManagement'));

type userObject = {
  [key: string]: any;
};

export interface ICompletedLessons {
  lessonID: string;
  time: string;
}

export interface DashboardProps {
  classRoomActiveSyllabus?: string;
  loading?: boolean;
  isTeacher?: boolean;
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
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Dashboard = (props: DashboardProps) => {
  const {updateAuthState} = props;
  const {state, dispatch} = useContext(GlobalContext);
  const match = useRouteMatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  const getRoomData = getLocalStorageData('room_info');

  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();
  const [activeRoomName, setActiveRoomName] = useState<string>('');

  // ##################################################################### //
  // ############################ USER LOADING ########################### //
  // ##################################################################### //
  const [userData, setUserData] = useState({
    role: '',
    image: '',
  });
  const isTeacher = state.user.role === 'FLW' || state.user.role === 'TR';

  const setUser = (user: userObject) => {
    setUserData({
      role: user.role,
      image: user.image,
    });
    let firstName = user.preferredName ? user.preferredName : user.firstName;
    dispatch({
      type: 'SET_USER',
      payload: {
        id: user.id,
        firstName: firstName,
        lastName: user.lastName,
        language: user.language,
        onBoardSurvey: user.onBoardSurvey ? user.onBoardSurvey : false,
        role: user.role,
        image: user.image,
      },
    });

    setCookie(
      'auth',
      {...cookies.auth, role: user.role, firstName: firstName, id: user.id},
      {path: '/'}
    );
  };

  async function getUser() {
    const userEmail = state.user?.email ? state.user?.email : cookies.auth?.email;
    const userAuthId = state.user?.authId ? state.user?.authId : cookies.auth?.authId;
    try {
      const queryObj = {
        name: 'queries.getPerson',
        valueObj: {email: userEmail, authId: userAuthId},
      };

      const user: any = await API.graphql(
        graphqlOperation(queries.getPerson, queryObj.valueObj)
      );
      setUser(user.data.getPerson);
    } catch (error) {
      if (!userEmail && !userAuthId) {
        removeCookie('auth', {path: '/'});
        dispatch({type: 'CLEANUP'});
        sessionStorage.removeItem('accessToken');
        updateAuthState(false);
      }
      console.error('Dashboard - getUser(): ', error);
    }
  }

  useEffect(() => {
    if (!state.user.firstName) {
      getUser();
    } else {
      setUserData({
        role: state.user?.role,
        image: state.user?.image,
      });
    }
  }, [state.user.role]);

  /**
   * INIT ADMIN NOT LOADING ANYTHING
   */
  useEffect(() => {
    const userRole = state.user.role;
    if (userRole === 'ADM') {
      setRoomsLoading(true);
    }
  }, []);

  // ##################################################################### //
  // ########################### LOADING STATUS ########################## //
  // ##################################################################### //
  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(false);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);

  // ##################################################################### //
  // ############################# HOME DATA ############################# //
  // ##################################################################### //
  // Fetching results
  const [homeDataForTeachers, setHomeDataForTeachers] = useState([]);

  const [homeData, setHomeData] = useState<{class: any}[]>();
  const [classList, setClassList] = useState<any[]>();

  // const [classIds, setClassIds] = useState<string[]>([]);
  // const [rooms, setRooms] = useState<any[]>([]);
  const [curriculumIds, setCurriculumIds] = useState<string>('');

  /******************************************
   * 1.1 PROCESS STUDENT ROOM FETCHING      *
   ******************************************/
  const getDashboardData = async (authId: string, email: string) => {
    try {
      const queryObj = {
        name: 'customQueries.getDashboardData',
        valueObj: {
          authId: authId,
          email: email,
        },
      };
      const dashboardDataFetch = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );
      const response = await dashboardDataFetch;

      // @ts-ignore
      let arrayOfResponseObjects = await response?.data.getPerson.classes.items;

      console.log('all student classes - ', arrayOfResponseObjects);

      arrayOfResponseObjects = arrayOfResponseObjects.filter(
        (item: any) => item.class !== null
      );

      setHomeData(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    } finally {
      // need to do some cleanup
    }
  };

  const getDashboardDataForTeachers = async (teacherAuthID: string) => {
    try {
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}},
        })
      );

      const response = await dashboardDataFetch;
      let arrayOfResponseObjects = response?.data?.listRooms?.items;
      arrayOfResponseObjects = arrayOfResponseObjects.map((item: any) => {
        return {class: {rooms: {items: arrayOfResponseObjects}}};
      });

      setHomeDataForTeachers(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashboardDataForTeachers -> ', e);
    } finally {
      // need to do some cleanup
    }
  };
  useEffect(() => {
    const authId = state.user.authId;
    const email = state.user.email;
    if (state.user.role === 'ST') {
      getDashboardData(authId, email);
    }
    if (isTeacher) {
      getDashboardDataForTeachers(authId);
    }
  }, [state.user.role, isTeacher]);

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
              rooms: dataObj?.class?.rooms,
              students: dataObj?.class?.students,
            },
          ];
        }, [])
      : [];

  useEffect(() => {
    if (homeData && homeData.length > 0 && getClassList.length > 0) {
      setClassList(getClassList);
    }
  }, [homeData]);

  const getRoomsFromClassList = () => {
    let rooms: any = [];
    classList && classList.length
      ? classList.forEach((classObj) =>
          classObj.rooms.items.length
            ? classObj.rooms.items.forEach((room: any) =>
                room.curricula?.items.length && room.curricula?.items[0].curriculum
                  ? rooms.push(room)
                  : null
              )
            : null
        )
      : null;
    return rooms;
  };

  useEffect(() => {
    const studentRoomsList = getRoomsFromClassList();
    setLocalStorageData('room_list', studentRoomsList);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'rooms',
        data: studentRoomsList,
      },
    });
  }, [classList]);

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const queryObj = {
        name: 'customQueries.listRooms',
        valueObj: {filter: {teacherAuthID: {eq: teacherAuthID}}},
      };

      const classIdFromRoomsFetch = await API.graphql(
        graphqlOperation(customQueries.listRooms, queryObj.valueObj)
      );
      const response = await classIdFromRoomsFetch;
      //@ts-ignore
      const arrayOfResponseObjects = response?.data?.listRooms?.items;

      setLocalStorageData('room_list', arrayOfResponseObjects);

      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'rooms',
          data: arrayOfResponseObjects,
        },
      });
    } catch (e) {
      console.error('Classes Fetch ERR: ', e);
    }
  };

  useEffect(() => {
    if (state.user.role === 'FLW' || state.user.role === 'TR') {
      const teacherAuthID = state.user.authId;
      listRoomTeacher(teacherAuthID);
    }
  }, [state.user.role]);

  /******************************************
   * 3.1 LIST ALL WIDGETS FOR ROOM          *
   ******************************************/
  useEffect(() => {
    // const listRoomWidgets = async () => {
    //   setWidgetLoading(true);
    //   //
    //   try {
    //     const queryObj = {
    //       name: 'queries.listNoticeboardWidgets',
    //       valueObj: {filter: {roomID: {eq: state.activeRoom}}},
    //     };
    //     // const noticeboardWidgetsFetch = await handleFetchAndCache(queryObj);
    //     // const response = await noticeboardWidgetsFetch;
    //     // const arrayOfResponseObjects = response?.data?.listNoticeboardWidgets?.items;
    //     const keepEmptyForNow:any = [];
    //     dispatch({
    //       type: 'UPDATE_ROOM',
    //       payload: {
    //         property: 'widgets',
    //         data: keepEmptyForNow,
    //       },
    //     });
    //   } catch (e) {
    //     console.error('listNoticeboardWidgetsFetch: -> ', e);
    //   } finally {
    //     setWidgetLoading(false);
    //   }
    // };
    // if (state.activeRoom && widgetLoading === false) {
    //   listRoomWidgets();
    // }
  }, [state.activeRoom]);

  const previousRoom = usePrevious(state.activeRoom);

  /**
   * 4. LIST ALL CURRICULUMS ASSOCIATED WITH ROOM of ID
   */
  useEffect(() => {
    const listRoomCurriculums = async () => {
      if (state.roomData.rooms.length > 0) {
        try {
          const queryObj = {
            name: 'customQueries.listRoomCurriculums',
            valueObj: {
              roomID: {eq: state.activeRoom},
            },
          };

          /***************************************************
           *                                                 *
           * DISABLED handleFetchAndCache()                  *
           * TO TROUBLESHOOT LESSONS NOT LOADING             *
           * ON SYLLABUS-ACTIVATION SWTICH                   *
           *                                                 *
           ***************************************************/
          // const roomCurriculumsFetch = await handleFetchAndCache(queryObj);
          const roomCurriculumsFetch = await API.graphql(
            graphqlOperation(queries.listRoomCurriculums, {
              filter: {
                roomID: {eq: state.activeRoom},
              },
            })
          );
          const response = await roomCurriculumsFetch;
          // @ts-ignore
          const arrayOfResponseObjects = response?.data?.listRoomCurriculums?.items;

          if (arrayOfResponseObjects.length > 0) {
            setCurriculumIds(arrayOfResponseObjects[0]?.curriculumID);
          }
        } catch (e) {
          console.error('RoomCurriculums fetch ERR: ', e);
        } finally {
          console.log('curriciulum ids - ', curriculumIds);
        }
      }
    };
    listRoomCurriculums();
  }, [state.activeRoom]);

  // Save info of selected room to cookie
  useEffect(() => {
    const getRoomFromState = state.roomData.rooms.find(
      (room: any) => room.id === state.activeRoom
    );
    if (getRoomFromState) {
      setLocalStorageData('room_info', getRoomFromState);
      setActiveRoomInfo(getRoomFromState);
    }
  }, [state.activeRoom]);

  /**
   * 5. LIST AVAILABLE SYLLABUS
   */
  useEffect(() => {
    setSyllabusLoading(true);

    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const getCurriculum = await API.graphql(
            graphqlOperation(queries.getCurriculum, {id: curriculumIds})
          );
          // @ts-ignore
          const response = await getCurriculum.data.getCurriculum;

          const syllabi = response.universalSyllabus.items;
          const sequence = response.universalSyllabusSeq;

          const mappedResponseObjects = sequence?.reduce(
            (acc: any[], syllabusID: string) => {
              return [
                ...acc,
                syllabi.find((syllabus: any) => syllabus.id === syllabusID),
              ];
            },
            []
          );
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'syllabus',
              data: mappedResponseObjects,
            },
          });
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'syllabus',
              data: mappedResponseObjects,
            },
          });
          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'curriculum',
              data: {name: response.name},
            },
          });
          setSyllabusLoading(false);
        } catch (e) {
          console.error('Curriculum ids ERR: ', e);
        } finally {
          setSyllabusLoading(false);
        }
      }
    };

    listSyllabus();
  }, [state.activeRoom, curriculumIds]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - LESSONS                         *
   ******************************************/

  const listSyllabusLessons = async () => {
    setLessonLoading(true);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'lessons',
        data: [],
      },
    });

    /**
     * IF there are any syllabus active, do a fetch for lessons
     */
    if (activeRoomInfo?.activeSyllabus) {
      try {
        const syllabusLessonFetch = await API.graphql(
          graphqlOperation(customQueries.getUniversalSyllabus, {
            id: activeRoomInfo?.activeSyllabus,
          })
        );
        //@ts-ignore
        const response = await syllabusLessonFetch.data.getUniversalSyllabus;
        const lessons = response?.lessons.items;
        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'lessons',
            data: lessons,
          },
        });
        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'activeSyllabus',
            data: response,
          },
        });
      } catch (e) {
        console.error('syllabus lessons: ', e);
      } finally {
        setLessonLoading(false);
      }
    }
  };

  // ~~~~~~~~ TRIGGER LESSON LOADING ~~~~~~~ //
  useEffect(() => {
    listSyllabusLessons();
  }, [activeRoomInfo]);

  // ##################################################################### //
  // ######################## NAVIGATION AND STATE ####################### //
  // ##################################################################### //
  const [currentPage, setCurrentPage] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('open');

  const handleRoomSelection = (
    id: string,
    name: string,
    i: number,
    route = 'classroom'
  ) => {
    const getRoomSyllabus = state.roomData.rooms.find(
      (roomObj: any) => roomObj.id === id
    );
    if (
      (state.activeRoom !== id && state.currentPage !== 'lesson-planner') ||
      (state.activeRoom !== id && state.currentPage !== 'classroom')
    ) {
      setActiveRoomName(name);
      dispatch({
        type: 'UPDATE_ACTIVEROOM',
        payload: {roomID: id, syllabusID: getRoomSyllabus?.activeSyllabus},
      });

      history.push(`/dashboard/${route}/${id}`);
    }
  };

  const HomeSwitch = () =>
    isTeacher ? (
      <HomeForTeachers
        homeData={homeDataForTeachers}
        isTeacher={isTeacher}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
      />
    ) : (
      <Home
        homeData={homeData}
        classList={classList}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
      />
    );

  return (
    <div className="relative h-screen flex overflow-hidden container_background">
      {state.user.role === 'ST' && <EmojiFeedback />}

      {/* <ResizablePanels> */}
      <SideMenu
        // setActiveRoomSyllabus={setActiveRoomSyllabus}
        setLessonLoading={setLessonLoading}
        setSyllabusLoading={setSyllabusLoading}
        setActiveRoomName={setActiveRoomName}
        updateAuthState={updateAuthState}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        role={userData.role}
        handleRoomSelection={handleRoomSelection}
      />

      <div className="h-full overflow-y-auto">
        <FloatingSideMenu />
        <Noticebar inputContext={'global'} />
        <Suspense
          fallback={
            <div className="min-h-screen w-full flex flex-col justify-center items-center">
              <ComponentLoading />
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
                  } else return <Redirect to={`${match.url}/manage-institutions`} />;
                } else
                  return (
                    <div className="min-h-screen w-full flex flex-col justify-center items-center">
                      <ComponentLoading />
                    </div>
                  );
              }}
            />

            <Route
              exact
              path={`${match.url}/home`}
              render={() => (
                <ErrorBoundary fallback={<h1>Oops with the Dashboard</h1>}>
                  <HomeSwitch />
                </ErrorBoundary>
              )}
            />

            {(userData.role === 'ADM' ||
              userData.role === 'TR' ||
              userData.role === 'FLW' ||
              userData.role === 'BLD') && (
              <Route exact path={`${match.url}/csv`} render={() => <Csv />} />
            )}

            <Route
              exact
              path={`${match.url}/classroom/:roomId`}
              render={() => (
                <ErrorBoundary fallback={<h1>Oops with the Classroom</h1>}>
                  <Classroom
                    classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                    isTeacher={isTeacher}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
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
            <Route path={`${match.url}/anthology`} render={() => <Anthology />} />
            <Route
              path={`${match.url}/noticeboard`}
              render={() => <NoticeboardAdmin setCurrentPage={setCurrentPage} />}
            />
            <Route path={`${match.url}/manage-users`} render={() => <UserManagement />} />
            <Route path={`${match.url}/registration`} render={() => <Registration />} />
            <Route
              path={`${match.url}/profile`}
              render={() => <Profile updateAuthState={updateAuthState} />}
            />
            <Route
              path={`${match.url}/lesson-planner/:roomId`}
              render={() => (
                <ErrorBoundary fallback={<h1>Oops with the Lesson-Planner</h1>}>
                  <LessonPlanHome
                    classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                    handleRoomSelection={handleRoomSelection}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activeRoomInfo={activeRoomInfo}
                    setActiveRoomInfo={setActiveRoomInfo}
                    activeRoomName={activeRoomName}
                    setActiveRoomName={setActiveRoomName}
                    visibleLessonGroup={visibleLessonGroup}
                    setVisibleLessonGroup={setVisibleLessonGroup}
                    lessonLoading={lessonLoading}
                    setLessonLoading={setLessonLoading}
                    syllabusLoading={syllabusLoading}
                    setSyllabusLoading={setSyllabusLoading}
                  />
                </ErrorBoundary>
              )}
            />
            <Route
              path={`${match.url}/manage-institutions`}
              render={() => <InstitutionsHome setCurrentPage={setCurrentPage} />}
            />
            <Route path={`${match.url}/question-bank`} render={() => <QuestionBank />} />

            <UniversalLessonBuilderProvider>
              <Route
                path={`${match.url}/lesson-builder`}
                render={() => <LessonsBuilderHome />}
              />

              <Route
                path={`${match.url}/universal-lesson-builder`}
                render={() => <UniversalLessonBuilder />}
              />
            </UniversalLessonBuilderProvider>
          </Switch>
        </Suspense>
      </div>
      {/* </ResizablePanels> */}
    </div>
  );
};

export default Dashboard;