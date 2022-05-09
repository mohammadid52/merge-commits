import React, {useContext, useEffect, useState} from 'react';
import {match, useHistory, useRouteMatch} from 'react-router-dom';
import {useOutsideAlerter} from '../General/hooks/outsideAlerter';
import PositiveAlert from '../General/Popup';
import LessonTopMenu from '../Lesson/Navigation/LessonTopMenu';
import SideMenu from '../Lesson/Navigation/SideMenu';
import {LessonHeaderBarProps} from '../../interfaces/LessonComponentsInterfaces';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getLocalStorageData} from '../../utilities/localStorage';
import useStudentTimer from '../../customHooks/timer';
import Modal from '@components/Atoms/Modal';
import ReactPlayer from 'react-player';
import useTailwindBreakpoint from '@customHooks/tailwindBreakpoint';
import VideoWidget from '../Lesson/Navigation/Widgets/VideoWidget';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';

const LessonHeaderBar = ({
  overlay,
  setOverlay,
  isAtEnd,
  setisAtEnd,
  handleRequiredNotification,
}: LessonHeaderBarProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  const history = useHistory();
  const match = useRouteMatch();

  const initializeTimer = useStudentTimer();

  if (initializeTimer) {
  }

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const getRoomData = getLocalStorageData('room_info');
  const [waiting, setWaiting] = useState<boolean>(null);
  const [safeToLeave, setSafeToLeave] = useState<any>(null);

  // To track user clicks on home button or click next on last page
  const [leaveAfterCompletion, setLeaveAfterCompletion] = useState<boolean>(false);

  const handleManualSave = () => {
    if (lessonState.updated) {
      setWaiting(true);
      setSafeToLeave(false);
    } else {
      setWaiting(false);
      setSafeToLeave(true);
    }
  };

  useEffect(() => {
    if (!lessonState.updated) {
      if (waiting === true && safeToLeave === false) {
        setWaiting(false);
        setSafeToLeave(true);
      } else {
        setWaiting(null);
        setSafeToLeave(null);
      }
    }
  }, [lessonState.updated]);

  useEffect(() => {
    // console.log('safeToLeave State - ', safeToLeave);
    if (safeToLeave === true) {
      handleLeavePopup();
      history.push(`/dashboard/classroom/${getRoomData.id}`);
    }
  }, [safeToLeave]);

  // ##################################################################### //
  // ########################## POPUPS & MODALS ########################## //
  // ##################################################################### //

  // ~~~~~~~ LEAVE VERIFICATION POPUP ~~~~~~ //
  const [leaveModalVisible, setLeaveModalVisible] = useState<boolean>(false);

  // ~~ VIDEOLINK WHICH IS SHOWN TO USERS ~~ //
  const [videoLink, setVideoLink] = useState<string>('');
  const [videoLinkModalVisible, setVideoLinkModalVisible] = useState<boolean>(false);

  // ~~~~ HANDLE USER LEAVING THE LESSON ~~~ //
  const handleLeavePopup = (isLeavingAfterCompletion: boolean = true) => {
    if (videoLinkModalVisible) {
      setVideoLinkModalVisible(false);
    }

    if (leaveModalVisible) {
      setLeaveModalVisible(false);
    } else {
      setLeaveModalVisible(true);
    }
    setLeaveAfterCompletion(isLeavingAfterCompletion);
  };

  // ~~~~ POPUP IF A VIDEO IS AVAILABLE ~~~~ //
  const handleVideoLinkPopup = (url?: string) => {
    if (videoLinkModalVisible) {
      // setVideoLink('');
      setVideoLinkModalVisible(false);
    } else {
      // setVideoLink(url);
      setVideoLinkModalVisible(true);
    }
  };

  const getPageLabel = (locationIndex: string) => {
    if (lessonState.lessonData && lessonState.lessonData?.lessonPlan) {
      if (locationIndex === '') {
        return 'n/a';
      } else {
        return lessonState.lessonData.lessonPlan[parseInt(locationIndex)]?.label;
      }
    }
  };

  const thisPageVideoLink = lessonState.lessonData.lessonPlan
    ? lessonState.lessonData.lessonPlan[lessonState.currentPage]?.videoLink
    : '';
  useEffect(() => {
    if (typeof thisPageVideoLink === 'string' && thisPageVideoLink.length > 0) {
      setVideoLink(thisPageVideoLink);

      if (lessonState.lessonProgress === lessonState.currentPage && !leaveModalVisible) {
        if (user.onDemand) {
          handleVideoLinkPopup(thisPageVideoLink);
        }
      }
    } else {
      setVideoLink('');
    }
  }, [lessonState.currentPage, thisPageVideoLink]);

  // ##################################################################### //
  // ################################ NAVI ############################### //
  // ##################################################################### //

  const PAGES = lessonState.lessonData.lessonPlan;

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  const validateRequired = (pageIdx: number) => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData[pageIdx];
      const thisPageRequired = lessonState?.requiredInputs[pageIdx];
      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });
        // console.log('validate areAnyEmpty - ', areAnyEmpty);
        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const canContinue = () => {
    if (PAGES) {
      return (
        validateRequired(lessonState.currentPage) &&
        lessonState.currentPage < PAGES.length - 1 &&
        PAGES[lessonState.currentPage + 1]?.open !== false
      );
    } else {
      return false;
    }
  };

  const userAtEnd = () => {
    return lessonState.currentPage === PAGES.length - 1;
  };

  // ##################################################################### //
  // ############################# NAVIGATION ############################ //
  // ##################################################################### //

  const getPageIndex = (pageID: string, pageArray: any[]) => {
    if (pageID && pageArray) {
      return pageArray.findIndex((pageObj: any) => pageObj.id === pageID);
    }
  };

  // ~~~~~~~~ TEACHER IS PRESENTING ~~~~~~~~ //
  const teacherIsPresenting = lessonState.displayData[0].isTeacher === true;
  const presentedPageID = lessonState.displayData[0].lessonPageID;
  useEffect(() => {
    // console.log(getPageIndex(presentedPageID, lessonState.lessonData.lessonPlan));
    if (teacherIsPresenting && presentedPageID) {
      const getPresentedPagedIndex = getPageIndex(
        presentedPageID,
        lessonState.lessonData.lessonPlan
      );
      // console.log('getPresentedPageIndex - ', getPresentedPagedIndex);
      if (typeof getPresentedPagedIndex === 'number' && getPresentedPagedIndex >= 0) {
        history.push(`${match.url}/${getPresentedPagedIndex}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: getPresentedPagedIndex,
        });
      }
    }
  }, [teacherIsPresenting, presentedPageID]);

  // ~~~~~~~~~~~~ ARROW BUTTONS ~~~~~~~~~~~~ //
  const handleForward = () => {
    if (!userAtEnd()) {
      if (isAtEnd) setisAtEnd(false);
      if (canContinue()) {
        history.push(`${match.url}/${lessonState.currentPage + 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage + 1,
        });
      } else {
        handleRequiredNotification();
      }
    } else if (userAtEnd()) {
      if (validateRequired(lessonState.currentPage)) {
        handleLeavePopup();
      } else {
        handleRequiredNotification();
      }
    }
  };

  const handleBack = () => {
    if (lessonState.currentPage === 0) {
      handleLeavePopup(true);
    } else {
      if (userAtEnd()) {
        if (isAtEnd) setisAtEnd(false);
        history.push(`${match.url}/${lessonState.currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage - 1,
        });
      } else if (!userAtEnd() && lessonState.currentPage > 0) {
        if (isAtEnd) setisAtEnd(false);
        history.push(`${match.url}/${lessonState.currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage - 1,
        });
      }
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div
      style={{zIndex: 3000}}
      className={` relative center w-full 
        h-.7/10 text-gray-200 shadow-2xl
        ${theme.toolbar.bg} `}>
      {/* LEAVE POPUP */}
      <div className={`${leaveModalVisible ? 'absolute z-100' : 'hidden'}`}>
        <PositiveAlert
          alert={leaveModalVisible}
          setAlert={setLeaveModalVisible}
          header={
            leaveAfterCompletion
              ? 'Congratulations, you have reached the end of the lesson, do you want to go back to the dashboard?'
              : 'This will take you out of the lesson.  Did you want to continue?'
          }
          button1={`${!waiting ? 'Go to the dashboard' : 'Saving your data...'}`}
          button2="Stay on lesson"
          svg="question"
          handleButton1={handleManualSave}
          handleButton2={handleLeavePopup}
          theme="dark"
          fill="screen"
        />
      </div>

      {/* VIDEO POPUP */}
      {!leaveModalVisible && videoLink && (
        <div className={`${videoLinkModalVisible ? 'absolute z-100' : 'hidden'}`}>
          <Modal
            title={`Video for "${getPageLabel(lessonState.currentPage)}"`}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={handleVideoLinkPopup}>
            <ReactPlayer
              url={videoLink}
              controls={true}
              pip={true}
              stopOnUnmount={false}
            />
          </Modal>
        </div>
      )}

      <LessonTopMenu
        overlay={overlay}
        setOverlay={setOverlay}
        handlePopup={handleLeavePopup}
        isAtEnd={isAtEnd}
        setisAtEnd={setisAtEnd}
        handleRequiredNotification={handleRequiredNotification}
        pages={PAGES}
        canContinue={canContinue()}
        handleForward={handleForward}
      />

      {/**
       *
       *
       * SIDE MENU UNDER PROGRESS BAR HIDDEN UNTIL FURTHER NOTICE
       *
       *
       */}

      {breakpoint !== 'xs' && breakpoint !== 'sm' ? (
        <VideoWidget
          videoLink={videoLink}
          videoLinkModalVisible={videoLinkModalVisible}
          handleVideoLinkPopup={handleVideoLinkPopup}
        />
      ) : (
        <SideMenu
          isOpen={overlay === 'sidemenu'}
          overlay={overlay}
          setOverlay={setOverlay}
          videoLink={videoLink}
          videoLinkModalVisible={videoLinkModalVisible}
          handleVideoLinkPopup={handleVideoLinkPopup}
          handlePopup={handleLeavePopup}
          isAtEnd={isAtEnd}
          setisAtEnd={setisAtEnd}
          handleRequiredNotification={handleRequiredNotification}
          pages={PAGES}
          canContinue={canContinue()}
          handleBack={handleBack}
          handleForward={handleForward}
        />
      )}
    </div>
  );
};

export default LessonHeaderBar;
