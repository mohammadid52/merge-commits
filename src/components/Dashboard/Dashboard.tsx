import Navbar from '@components/Molecules/Navbar';
import useAuth from '@customHooks/useAuth';
import {updatePageState} from '@graphql/functions';
import {UserPageState} from 'API';
import 'components/Dashboard/GameChangers/styles/Flickity.scss';
import 'components/Dashboard/GameChangers/styles/GameChanger.scss';
import EmojiFeedback from 'components/General/EmojiFeedback';
import {useGlobalContext} from 'contexts/GlobalContext';
import React, {useEffect, useState} from 'react';
import DashboardRouter from 'router/DashboardRouter';
import {setLocalStorageData} from 'utilities/localStorage';

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
  handleRoomSelection?: (id: string) => void;
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
    state: {currentPage},

    dispatch
  } = useGlobalContext();

  const [isPageUpdatedOnPersonTable, setIsPageUpdatedOnPersonTable] = useState(false);

  const {authId, email, pageState, isStudent} = useAuth();

  useEffect(() => {
    if (!isPageUpdatedOnPersonTable && isStudent) {
      updatePageState(
        UserPageState.DASHBOARD,
        {
          authId: authId,
          email: email,
          pageState: pageState
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
  }, [isPageUpdatedOnPersonTable]);

  useEffect(() => {
    if (currentPage === 'homepage') {
      dispatch({
        type: 'RESET_ROOMDATA',
        payload: {}
      });
    }
  }, [currentPage]);

  // ~~~~ DISABLE ROOM LOADING FOR ADMIN ~~~ //

  useEffect(() => {
    setLocalStorageData('last_page', 'dashboard');
  }, []);

  // ##################################################################### //
  // ########################### LOADING STATUS ########################## //
  // ##################################################################### //

  // ##################################################################### //
  // ######################## NAVIGATION AND STATE ####################### //
  // ##################################################################### //

  return (
    <>
      <Navbar />
      <div className="relative h-screen flex overflow-hidden container_background ">
        {isStudent && <EmojiFeedback />}
        {/* <ResizablePanels> */}

        <div
          className={`h-full w-full ${
            window.location.pathname.includes('game-changers')
              ? 'overflow-hidden'
              : 'overflow-y-auto'
          }`}>
          <DashboardRouter />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
