import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SideMenu from './Menu/SideMenu';
import { useCookies } from 'react-cookie';
import * as queries from '../../graphql/queries';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';
import InstitutionsHome from './Admin/Institutons/InstitutionsHome';
import QuestionBank from './Admin/Questions/QuestionBank';
import LessonsBuilderHome from './Admin/LessonsBuilder/LessonsBuilderHome';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import SideWidgetBar from './SideWidgetBar/SideWidgetBar';
import SideRoomSelector from './Menu/SideRoomSelector';
import { copyLessonPlans } from '../../uniqueScripts/CopyLessonPlans_to_SyllabusLessons';
import { initRosterSyllabusLessons } from '../../uniqueScripts/InitRoster_in_SyllabusLessons';
import NoticeboardAdmin from './NoticeboardAdmin/NoticeboardAdmin';
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
  isTeacher?: boolean;
  updateAuthState?: Function;
  currentPageData?: any[];
  setCurrentPageData?: React.Dispatch<any>;
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  activeRoom?: string;
  setActiveRoom?: React.Dispatch<React.SetStateAction<string>>;
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

export interface SideMenuProps extends DashboardProps {
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
  const [syllabusLoading, setsyllabusLoading] = useState<boolean>(false);

  // Page switching
  const [currentPage, setCurrentPage] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('today');
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [activeRoomName, setActiveRoomName] = useState<string>('');
  const [activeRoomSyllabus, setActiveRoomSyllabus] = useState<string>('');

  useEffect(()=>{
    // copyLessonPlans();
  },[])

  useEffect(()=>{
    // initRosterSyllabusLessons();
  },[])

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
      if (state.user?.role === 'FLW' || state.user?.role === 'TR') {
        setCurrentPage('lesson-planner');
      } else if (userData.role === 'ST') {
        setCurrentPage('classroom');
      } else setCurrentPage('manage-institutions');
    }
  }, []);

  return (
    <div className={`w-screen md:w-full h-screen md:h-full flex`}>
      {/**
       *  SIDEMENU
       */}
      <SideMenu setCurrentPage={setCurrentPage} currentPage={currentPage} updateAuthState={updateAuthState}>
        <ProfileLink setCurrentPage={setCurrentPage} currentPage={currentPage} image={userData.image} />
        <Links setCurrentPage={setCurrentPage} currentPage={currentPage} role={userData.role} />
      </SideMenu>

      {currentPage === 'lesson-planner' || currentPage === 'classroom' ? (
        <SideRoomSelector
          currentPage={currentPage}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          setActiveRoomName={setActiveRoomName}
          lessonLoading={lessonLoading}
          setLessonLoading={setLessonLoading}
          syllabusLoading={syllabusLoading}
          setSyllabusLoading={setsyllabusLoading}
          activeRoomSyllabus={activeRoomSyllabus}
          setActiveRoomSyllabus={setActiveRoomSyllabus}
        />
      ) : null}

      {/**
       *  MAIN CONTENT
       */}
      <div className={`flex flex-row overflow-x-hidden overflow-y-scroll`}>
        <div className={`height h-full flex flex-col`}>
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
                      return <Redirect to={`${match.url}/classroom`} />;
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
                path={`${match.url}/classroom`}
                render={() => (
                  <Classroom
                    currentPage={currentPage}
                    activeRoom={activeRoom}
                    setActiveRoom={setActiveRoom}
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
              <Route path={`${match.url}/noticeboard`} render={() => <NoticeboardAdmin />} />
              <Route path={`${match.url}/manage-users`} render={() => <UserManagement />} />
              <Route path={`${match.url}/registration`} render={() => <Registration />} />
              <Route path={`${match.url}/profile`} render={() => <Profile />} />
              <Route
                path={`${match.url}/lesson-planner`}
                render={() => (
                  <LessonPlanHome
                    currentPage={currentPage}
                    activeRoom={activeRoom}
                    activeRoomName={activeRoomName}
                    setActiveRoomName={setActiveRoomName}
                    visibleLessonGroup={visibleLessonGroup}
                    setVisibleLessonGroup={setVisibleLessonGroup}
                    lessonLoading={lessonLoading}
                    setLessonLoading={setLessonLoading}
                    syllabusLoading={syllabusLoading}
                    setSyllabusLoading={setsyllabusLoading}
                  />
                )}
              />
              <Route path={`${match.url}/manage-institutions`} render={() => <InstitutionsHome />} />
              <Route path={`${match.url}/question-bank`} render={() => <QuestionBank />} />
              <Route path={`${match.url}/lesson-builder`} render={() => <LessonsBuilderHome />} />
            </Switch>
          </Suspense>
        </div>

        {/**
         *  SIDEWIDGETSBAR
         */}
        {currentPage === 'lesson-planner' || currentPage === 'classroom' ? (
          <SideWidgetBar
            currentPage={currentPage}
            visibleLessonGroup={visibleLessonGroup}
            setVisibleLessonGroup={setVisibleLessonGroup}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
