import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useOutsideAlerter} from '../General/hooks/outsideAlerter';
import PositiveAlert from '../General/Popup';
import LessonTopMenu from '../Lesson/Header/LessonTopMenu';
import SideMenu from '../Lesson/Header/SideMenu';
import {LessonHeaderBarProps} from '../../interfaces/LessonComponentsInterfaces';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getLocalStorageData} from '../../utilities/localStorage';
import useStudentTimer from '../../customHooks/timer';
import Modal from '@components/Atoms/Modal';
import ReactPlayer from 'react-player';

const LessonHeaderBar = ({
  isAtEnd,
  setisAtEnd,
  handleRequiredNotification,
}: LessonHeaderBarProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const theme = gContext.theme;
  const initializeTimer = useStudentTimer();
  const history = useHistory();

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
  const leaveModal = useOutsideAlerter(false);
  const leaveModalVisible = leaveModal.visible;
  const setLeaveModalVisible = leaveModal.setVisible;

  // ~~ VIDEOLINK WHICH IS SHOWN TO USERS ~~ //
  const [videoLink, setVideoLink] = useState<string>('');
  const videoLinkModal = useOutsideAlerter(false);
  const videoLinkModalVisible = videoLinkModal.visible;
  const setVideoLinkModalVisible = videoLinkModal.setVisible;

  // ~~~~ HANDLE USER LEAVING THE LESSON ~~~ //
  const handleLeavePopup = (isLeavingAfterCompletion: boolean = true) => {
    if (videoLinkModalVisible) {
      setVideoLinkModalVisible(false);
    }
    setLeaveModalVisible((prevState: any) => !prevState);
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

        if (
          lessonState.lessonProgress === lessonState.currentPage &&
          !leaveModalVisible
        ) {
          if (user.onDemand) {
            handleVideoLinkPopup(thisPageVideoLink);
          }
        }
      } else {
        setVideoLink('');
      }
    }, [lessonState.currentPage, thisPageVideoLink]);

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
        <div className={`${videoLinkModalVisible ? 'absolute z-100' : 'hidden'}`}>
          <Modal
            title={`Video for "${getPageLabel(lessonState.currentPage)}"`}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={() => handleVideoLinkPopup()}>
            <ReactPlayer
              url={videoLink}
              controls={true}
              pip={true}
              stopOnUnmount={false}
            />
          </Modal>
        </div>

        <LessonTopMenu
          handlePopup={handleLeavePopup}
          isAtEnd={isAtEnd}
          setisAtEnd={setisAtEnd}
          handleRequiredNotification={handleRequiredNotification}
        />

        {/**
         *
         *
         * SIDE MENU UNDER PROGRESS BAR HIDDEN UNTIL FURTHER NOTICE
         *
         *
         */}

        <SideMenu
          videoLink={videoLink}
          videoLinkModalVisible={videoLinkModalVisible}
          handleVideoLinkPopup={handleVideoLinkPopup}
        />

        {/* {lessonDataLoaded && (
        <SideMenu lessonDataLoaded={lessonDataLoaded} handlePopup={handlePopup} />
      )} */}
      </div>
    );
};

export default LessonHeaderBar;
