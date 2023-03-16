import useAuth from '@customHooks/useAuth';
import {updatePageState} from '@graphql/functions';
import {UserPageState} from 'API';
import {getAsset} from 'assets';
import DropDownMenu from 'components/Dashboard/DropDownMenu/DropDownMenu';
import 'components/Dashboard/GameChangers/styles/Flickity.scss';
import 'components/Dashboard/GameChangers/styles/GameChanger.scss';
import HeaderMegaMenu from 'components/Dashboard/Menu/HeaderMegaMenu';
import EmojiFeedback from 'components/General/EmojiFeedback';
import Noticebar from 'components/Noticebar/Noticebar';
import {useGlobalContext} from 'contexts/GlobalContext';
import useNotifications from 'customHooks/notifications';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
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
    clientKey,
    dispatch
  } = useGlobalContext();

  const history = useHistory();

  const {notifications} = useNotifications('global');

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

  const handleLink = () => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  // check if url contains game-changers
  const isGameChangers = window.location.href.includes('game-changers');

  return (
    <>
      <div id="top-menu" className={`w-full ${isGameChangers ? 'bg-black' : 'bg-white'}`}>
        <div className="flex px-8 justify-between items-center">
          <div className="w-auto mr-5">
            <img
              onClick={handleLink}
              className="h-12 w-auto cursor-pointer"
              src={getAsset(clientKey, 'loading_logo')}
              alt="Workflow"
            />
          </div>
          <HeaderMegaMenu />
          <DropDownMenu />
        </div>
      </div>
      <div className="relative h-screen flex overflow-hidden container_background ">
        {isStudent && <EmojiFeedback />}
        {/* <ResizablePanels> */}

        <div
          className={`h-full w-full ${
            window.location.pathname.includes('game-changers')
              ? 'overflow-hidden'
              : 'overflow-y-auto'
          }`}>
          {/*<FloatingSideMenu />*/}
          {!isGameChangers && <Noticebar notifications={notifications} />}

          <DashboardRouter />
        </div>
        {/* </ResizablePanels> */}
      </div>
    </>
  );
};

export default Dashboard;
