import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SideMenu from './Menu/SideMenu';
import { useCookies } from 'react-cookie';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../customGraphql/customQueries';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';
import InstitutionsHome from './Admin/Institutons/InstitutionsHome';
import QuestionBank from './Admin/Questions/QuestionBank';
import LessonsBuilderHome from './Admin/LessonsBuilder/LessonsBuilderHome';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import SideWidgetBar from './Noticebooard/SideWidgetBar';
import SideRoomSelector from './Menu/SideRoomSelector';
import NoticeboardAdmin from './NoticeboardAdmin/NoticeboardAdmin';
import Noticebar from '../Noticebar/Noticebar';
import Home from './Home/Home';
import ClassroomControl from './ClassroomControl/ClassroomControl';
// const DashboardHome = lazy(() => import('./DashboardHome/DashboardHome'))
const Classroom = lazy(() => import('./Classroom/Classroom'));
const Anthology = lazy(() => import('./Anthology/Anthology'));
const Profile = lazy(() => import('./Profile/Profile'));
const Links = lazy(() => import('./Menu/Links'));
const ProfileLink = lazy(() => import('./Menu/ProfileLink'));
const Registration = lazy(() => import('./Admin/UserManagement/Registration'));
const UserManagement = lazy(() => import('./Admin/UserManagement/UserManagement'));

type userObject = {
  [key: string]: any;
};

export interface DashboardProps {
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
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Dashboard = (props: DashboardProps) => {
  const { updateAuthState } = props;
  const match = useRouteMatch();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  const [userData, setUserData] = useState({
    role: '',
    image: '',
  });
  const { state, dispatch } = useContext(GlobalContext);

  // For controlling loading transitions
  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(false);

  // Page switching
  const [currentPage, setCurrentPage] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('today');
  // const [activeRoom, setActiveRoom] = useState<string>('');
  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();
  const [activeRoomName, setActiveRoomName] = useState<string>('');
  const [activeRoomSyllabus, setActiveRoomSyllabus] = useState<string>('');

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

    setCookie('auth', { ...cookies.auth, role: user.role, firstName: firstName, id: user.id }, { path: '/' });
  };

  async function getUser() {
    const userEmail = state.user?.email ? state.user?.email : cookies.auth?.email;
    const userAuthId = state.user?.authId ? state.user?.authId : cookies.auth?.authId;
    try {
      // this any needs to be changed once a solution is found!!!
      const user: any = await API.graphql(
        graphqlOperation(queries.getPerson, { email: userEmail, authId: userAuthId })
      );
      setUser(user.data.getPerson);
    } catch (error) {
      if (!userEmail && !userAuthId) {
        removeCookie('auth', { path: '/' });
        dispatch({ type: 'CLEANUP' });
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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* <Noticebar inputContext={'global'} /> */}
      <SideMenu
        setActiveRoomSyllabus={setActiveRoomSyllabus}
        setLessonLoading={setLessonLoading}
        setSyllabusLoading={setSyllabusLoading}
        setActiveRoomName={setActiveRoomName}
        updateAuthState={updateAuthState}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        role={userData.role}
      />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* {(state.currentPage === 'lesson-planner' && userData.role === 'TR') ||
          (state.currentPage === 'lesson-planner' && userData.role === 'FLW') ||
          (state.currentPage === 'classroom' && userData.role === 'ST') ? (
            <ClassroomControl
              isHomescreen={false}
              currentPage={currentPage}
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              setActiveRoomInfo={setActiveRoomInfo}
              setActiveRoomName={setActiveRoomName}
              activeRoomName={activeRoomName}
              activeRoomInfo={activeRoomInfo}
              lessonLoading={lessonLoading}
              setLessonLoading={setLessonLoading}
              syllabusLoading={syllabusLoading}
              setSyllabusLoading={setSyllabusLoading}
              activeRoomSyllabus={activeRoomSyllabus}
              setActiveRoomSyllabus={setActiveRoomSyllabus}
            />
          ) : null} */}
          <div className="max-w-7xl mx-auto">
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
                        return <Redirect to={`${match.url}/lesson-planner`} />;
                      } else if (userData.role === 'ST') {
                        return <Redirect to={`${match.url}/home`} />;
                        // return <Redirect to={`${match.url}/home`} />;
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
                    <ClassroomControl
                      isHomescreen={true}
                      currentPage={currentPage}
                      // activeRoom={activeRoom}
                      // setActiveRoom={setActiveRoom}
                      setActiveRoomInfo={setActiveRoomInfo}
                      setActiveRoomName={setActiveRoomName}
                      lessonLoading={lessonLoading}
                      setLessonLoading={setLessonLoading}
                      syllabusLoading={syllabusLoading}
                      setSyllabusLoading={setSyllabusLoading}
                      activeRoomSyllabus={activeRoomSyllabus}
                      setActiveRoomSyllabus={setActiveRoomSyllabus}
                    />
                  )}
                />

                <Route
                  exact
                  path={`${match.url}/classroom/:roomId`}
                  render={() => (
                    <Classroom
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      // activeRoom={activeRoom}
                      activeRoomInfo={activeRoomInfo}
                      // setActiveRoom={setActiveRoom}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      syllabusLoading={syllabusLoading}
                    />
                  )}
                />

                <Route path={`${match.url}/anthology`} render={() => <Anthology />} />

                <Route
                  path={`${match.url}/noticeboard`}
                  render={() => <NoticeboardAdmin setCurrentPage={setCurrentPage} />}
                />

                <Route path={`${match.url}/manage-users`} render={() => <UserManagement />} />

                <Route path={`${match.url}/registration`} render={() => <Registration />} />

                <Route path={`${match.url}/profile`} render={() => <Profile updateAuthState={updateAuthState} />} />

                <Route
                  path={`${match.url}/lesson-planner`}
                  render={() => (
                    <LessonPlanHome
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      // activeRoom={activeRoom}
                      activeRoomInfo={activeRoomInfo}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      setLessonLoading={setLessonLoading}
                      syllabusLoading={syllabusLoading}
                      setSyllabusLoading={setSyllabusLoading}
                    />
                  )}
                />
                <Route
                  path={`${match.url}/manage-institutions`}
                  render={() => <InstitutionsHome setCurrentPage={setCurrentPage} />}
                />
                <Route path={`${match.url}/question-bank`} render={() => <QuestionBank />} />
                <Route path={`${match.url}/lesson-builder`} render={() => <LessonsBuilderHome />} />
              </Switch>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
