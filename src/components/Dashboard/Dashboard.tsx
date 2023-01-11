import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import ComponentLoading from '@components/Lesson/Loading/ComponentLoading';
import {logError, updatePageState} from '@graphql/functions';
import {PersonStatus, UserPageState} from 'API';
import {getAsset} from 'assets';
import Community from 'components/Community/Community';
import InstitutionsHome from 'components/Dashboard/Admin/Institutons/InstitutionsHome';
import QuestionBank from 'components/Dashboard/Admin/Questions/QuestionBank';
import Csv from 'components/Dashboard/Csv/Csv';
import DropDownMenu from 'components/Dashboard/DropDownMenu/DropDownMenu';
import {GameChangerProvider} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import 'components/Dashboard/GameChangers/styles/Flickity.scss';
import 'components/Dashboard/GameChangers/styles/GameChanger.scss';
import Home from 'components/Dashboard/Home/Home';
import HomeForTeachers from 'components/Dashboard/Home/HomeForTeachers';
import LessonPlanHome from 'components/Dashboard/LessonPlanner/LessonPlanHome';
import HeaderMegaMenu from 'components/Dashboard/Menu/HeaderMegaMenu';
import NoticeboardAdmin from 'components/Dashboard/NoticeboardAdmin/NoticeboardAdmin';
import ErrorBoundary from 'components/Error/ErrorBoundary';
import EmojiFeedback from 'components/General/EmojiFeedback';
import Noticebar from 'components/Noticebar/Noticebar';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useNotifications from 'customHooks/notifications';
import * as queries from 'graphql/queries';
import React, {lazy, Suspense, useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {setLocalStorageData} from 'utilities/localStorage';

const Classroom = lazy(() => import('components/Dashboard/Classroom/Classroom'));
const UploadLogsPage = lazy(() => import('components/Dashboard/Csv/UploadLogsPage'));

const GameChangers = lazy(() => import('components/Dashboard/GameChangers/GameChangers'));
const Anthology = lazy(() => import('components/Dashboard/Anthology/Anthology'));
const Profile = lazy(() => import('components/Dashboard/Profile/Profile'));
const TestCases = lazy(() => import('components/Dashboard/TestCases/TestCases'));
const Registration = lazy(
  () => import('components/Dashboard/Admin/UserManagement/Registration')
);
const ErrorsPage = lazy(() => import('components/Dashboard/Errors/ErrorsPage'));

const conditionalRender = (children: JSX.Element, condition: boolean) => {
  if (condition) {
    return children;
  } else {
    return <Redirect to={`/dashboard/home`} />;
  }
};

export const reorderSyllabus = (syllabusArray: any[], sequenceArray: any[]) => {
  const filteredSyllabusArray = syllabusArray.filter((d) => d.unit !== null);

  let getSyllabusInSequence =
    sequenceArray && sequenceArray.length > 0
      ? sequenceArray?.reduce((acc: any[], syllabusID: string) => {
          return [
            ...acc,
            filteredSyllabusArray.find((syllabus: any) => syllabus.unitId === syllabusID)
          ];
        }, [])
      : filteredSyllabusArray;

  let mapSyllabusToSequence =
    sequenceArray && sequenceArray.length > 0
      ? getSyllabusInSequence
          ?.map((syllabus: any) => {
            return {
              ...syllabus,
              ...syllabus.unit,
              lessons: {
                ...syllabus?.unit?.lessons,
                items:
                  syllabus?.unit.lessons?.items?.length > 0
                    ? syllabus?.unit.lessons.items
                        .map((t: any) => {
                          let index = syllabus?.universalLessonsSeq?.indexOf(t.id);
                          return {...t, index};
                        })
                        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
                    : []
              }
            };
          })
          .map(({unit, ...rest}: any) => rest)
      : getSyllabusInSequence;

  return mapSyllabusToSequence;
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
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  roomsLoading?: boolean;
  [key: string]: any;
}

const Dashboard = (props: DashboardProps) => {
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const dispatch = gContext.dispatch;
  const stateUser = gContext.state.user;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;

  const {updateAuthState} = props;

  const match = useRouteMatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  const {notifications} = useNotifications('global');

  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();

  const [activeRoomName, setActiveRoomName] = useState<string>('');

  const [isPageUpdatedOnPersonTable, setIsPageUpdatedOnPersonTable] = useState(false);

  useEffect(() => {
    if (!isPageUpdatedOnPersonTable && stateUser.role === 'ST') {
      updatePageState(
        UserPageState.DASHBOARD,
        {
          authId: state.user?.authId,
          email: state.user?.email,
          pageState: state.user?.pageState
        },
        () => {
          dispatch({
            type: 'SET_USER',
            payload: {...state.user, pageState: UserPageState.DASHBOARD}
          });
        }
      );

      setIsPageUpdatedOnPersonTable(true);
    }
  }, [isPageUpdatedOnPersonTable, stateUser.role]);

  useEffect(() => {
    if (state.currentPage === 'homepage') {
      dispatch({
        type: 'RESET_ROOMDATA'
      });
    }
  }, [state.currentPage]);

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

  const setUser = (user: userObject) => {
    setUserData({
      role: user.role,
      image: user?.image
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
        image: user?.image,
        lastEmotionSubmission: user?.lastEmotionSubmission,
        onDemand: user?.onDemand,
        status: user?.status || PersonStatus.INACTIVE
      }
    });

    setCookie(
      'auth',
      {...cookies.auth, role: user.role, firstName: firstName, id: user.id},
      {path: '/'}
    );
  };

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

      setUser(user.data.getPerson);
    } catch (error) {
      if (!userEmail && !userAuthId) {
        removeCookie('auth', {path: '/'});
        dispatch({type: 'CLEANUP'});
        sessionStorage.removeItem('accessToken');
        updateAuthState(false);
      }
      logError(error, {authId: userEmail, email: userAuthId}, 'Dashboard @getUser');
      console.error('Dashboard - getUser(): ', error);
    }
  }

  useEffect(() => {
    if (!stateUser?.firstName) {
      getUser();
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
  const [homeDataForTeachers, setHomeDataForTeachers] = useState([]);
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
      const dashboardDataFetch = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );

      // @ts-ignore
      let arrayOfResponseObjects = await dashboardDataFetch?.data.getPerson.classes.items;

      arrayOfResponseObjects = arrayOfResponseObjects.filter(
        (item: any) => item.class !== null
      );

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
      arrayOfResponseObjects = arrayOfResponseObjects.map((item: any) => {
        return {class: {rooms: {items: arrayOfResponseObjects}}};
      });
      // console.log('dashboard data teachers - ', arrayOfResponseObjects);

      setHomeDataForTeachers(arrayOfResponseObjects);
    } catch (error) {
      logError(error, {authId: stateUser?.authId, email: stateUser?.email}, 'Dashboard');
      console.error('getDashboardDataForTeachers -> ', error);
    } finally {
      // need to do some cleanup
      setRoomsLoading(false);
    }
  };
  useEffect(() => {
    const authId = stateUser?.authId;
    const email = stateUser?.email;

    if (stateUser?.role === 'ST') {
      getDashboardData(authId, email);
    } else {
      getDashboardDataForTeachers(authId);
    }
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
        valueObj: {filter: {teacherAuthID: {eq: teacherAuthID}}}
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
      logError(e, {authId: stateUser?.authId, email: stateUser?.email}, 'Dashboard');
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
    if (state.roomData.rooms.length > 0) {
      try {
        const queryObj = {
          name: 'customQueries.listRoomCurriculums',
          valueObj: {
            roomID: {eq: state.activeRoom}
          }
        };

        // const roomCurriculumsFetch = await handleFetchAndCache(queryObj);
        const roomCurriculumsFetch = await API.graphql(
          graphqlOperation(customQueries.listRoomCurriculums, {
            filter: {
              roomID: {eq: state.activeRoom}
            }
          })
        );

        const response = await roomCurriculumsFetch;
        // @ts-ignore
        const arrayOfResponseObjects = response?.data?.listRoomCurricula?.items;

        if (arrayOfResponseObjects.length > 0) {
          setCurriculumIds(arrayOfResponseObjects[0]?.curriculumID);
          setCurriculumObj(arrayOfResponseObjects[0]?.curriculum);
        }
      } catch (e) {
        logError(e, {authId: stateUser?.authId, email: stateUser?.email}, 'Dashboard');
        console.error('RoomCurriculums fetch ERR: ', e);
      } finally {
        // console.log('curriciulum ids - ', curriculumIds);
      }
    }
  };

  useEffect(() => {
    if (state.activeRoom && state.activeRoom !== '') {
      listRoomCurriculums();
    }
  }, [state.activeRoom]);

  const [loadingRoomInfo, setLoadingRoomInfo] = useState(true);

  // Save info of selected room to cookie
  useEffect(() => {
    setLoadingRoomInfo(true);
    const getRoomFromState = state.roomData.rooms.find(
      (room: any) => room.id === state.activeRoom
    );

    if (getRoomFromState) {
      setLocalStorageData('room_info', getRoomFromState);

      setActiveRoomInfo(getRoomFromState);
      setLoadingRoomInfo(false);
    }
  }, [state.activeRoom]);

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
        graphqlOperation(customQueries.getCurriculumForClasses, {id: curriculumIds})
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
      logError(e, {authId: stateUser?.authId, email: stateUser?.email}, 'Dashboard');
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
    if (curriculumIds !== '' && state.activeRoom) {
      getSyllabusAndSchedule();
    }
  }, [state.activeRoom, curriculumIds]);

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
      logError(e, {authId: stateUser?.authId, email: stateUser?.email}, 'Dashboard');
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
        payload: {roomID: id, syllabusID: getRoomSyllabus?.activeSyllabus}
      });

      history.push(`/dashboard/${route}/${id}`);
    }
  };

  const handleLink = () => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  const HomeSwitch = () =>
    !isStudent ? (
      <HomeForTeachers
        homeData={homeDataForTeachers}
        isTeacher={isTeacher}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
        roomsLoading={roomsLoading}
      />
    ) : (
      <Home
        homeData={homeData}
        classList={classList}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
        roomsLoading={roomsLoading}
      />
    );

  // check if url contains game-changers
  const isGameChangers = window.location.href.includes('game-changers');

  return (
    <>
      <div id="top-menu" className={`w-full ${isGameChangers ? 'bg-black' : 'bg-white'}`}>
        <div className="flex px-8 justify-between items-center">
          <div className="w-auto mr-5">
            <img
              onClick={stateUser?.role === 'ST' ? () => handleLink() : () => {}}
              className="h-12 w-auto cursor-pointer"
              src={getAsset(clientKey, 'loading_logo')}
              alt="Workflow"
            />
          </div>
          <HeaderMegaMenu />
          <DropDownMenu
            firstName={stateUser?.firstName}
            lastName={stateUser?.lastName}
            role={stateUser?.role}
            image={stateUser?.image}
            theme={theme}
            updateAuthState={updateAuthState}
          />
        </div>
      </div>
      <div className="relative h-screen flex overflow-hidden container_background ">
        {/* {isLocalhost && isDev && <SwitchAccount />} */}
        {stateUser?.role === 'ST' && <EmojiFeedback />}
        {/* <ResizablePanels> */}

        <div
          className={`h-full ${
            window.location.pathname.includes('game-changers')
              ? 'overflow-hidden'
              : 'overflow-y-auto'
          }`}>
          {/*<FloatingSideMenu />*/}
          {!isGameChangers && <Noticebar notifications={notifications} />}

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
                        <ComponentLoading />
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
                    <Community role={userData.role} />
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
                      loadingRoomInfo={loadingRoomInfo}
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
                      studentName={stateUser?.name}
                    />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/noticeboard`}
                render={() => (
                  <ErrorBoundary
                    componentName="NoticeboardAdmin"
                    fallback={<h1>Oops with the NoticeboardAdmin</h1>}>
                    <NoticeboardAdmin setCurrentPage={setCurrentPage} />
                  </ErrorBoundary>
                )}
              />
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
                    <Profile updateAuthState={updateAuthState} />
                  </ErrorBoundary>
                )}
              />
              <Route path={`${match.url}/test-cases`} render={() => <TestCases />} />
              <Route
                path={`${match.url}/errors`}
                render={() => (
                  <ErrorBoundary componentName="Errors">
                    <ErrorsPage />
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
                    <LessonPlanHome
                      setClassroomCurriculum={setCurriculumObj}
                      classroomCurriculum={curriculumObj}
                      handleRoomSelection={handleRoomSelection}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      activeRoomInfo={activeRoomInfo}
                      setActiveRoomInfo={setActiveRoomInfo}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      // setLessonLoading={setLessonLoading}
                      syllabusLoading={syllabusLoading}
                      setSyllabusLoading={setSyllabusLoading}
                    />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/manage-institutions`}
                render={() => (
                  <ErrorBoundary componentName="InstitutionsHome">
                    <InstitutionsHome setCurrentPage={setCurrentPage} />
                  </ErrorBoundary>
                )}
              />
              <Route
                path={`${match.url}/question-bank`}
                render={() => (
                  <ErrorBoundary componentName="QuestionBank">
                    <QuestionBank />
                  </ErrorBoundary>
                )}
              />
            </Switch>
          </Suspense>
        </div>
        {/* </ResizablePanels> */}
      </div>
      <div className="w-full flex justify-center items-center bg-gray-900"></div>
    </>
  );
};

export default Dashboard;
