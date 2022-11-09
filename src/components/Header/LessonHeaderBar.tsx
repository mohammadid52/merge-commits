import {useNotifications} from '@contexts/NotificationContext';
import useStudentTimer from '@customHooks/timer';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {UniversalLessonStudentData, UpdatePersonLessonsDataInput} from 'API';
import Modal from 'atoms/Modal';
import {useGlobalContext} from 'contexts/GlobalContext';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import {StudentPageInput} from 'interfaces/UniversalLessonInterfaces';
import React, {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, removeLocalStorageData} from 'utilities/localStorage';
import PositiveAlert from '../General/Popup';
import LessonTopMenu from '../Lesson/Navigation/LessonTopMenu';
import SideMenu from '../Lesson/Navigation/SideMenu';
import VideoWidget from '../Lesson/Navigation/Widgets/VideoWidget';

const LessonHeaderBar = ({
  overlay,
  setOverlay,
  pageStateUpdated,
  isAtEnd,
  setisAtEnd,
  createJournalData,
  handleRequiredNotification,
  personLessonData
}: LessonHeaderBarProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const saveJournalData = gContext.saveJournalData;
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  const history = useHistory();
  const match = useRouteMatch();

  // don't remove this line or we are screwed
  const initializeTimer = useStudentTimer();
  const isLesson = lessonState?.lessonData.type === 'lesson';

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const getRoomData = getLocalStorageData('room_info');

  const [safeToLeave, setSafeToLeave] = useState<any>(null);

  // To track user clicks on home button or click next on last page

  const getUrl = () => getLocalStorageData('survey_redirect');

  const {isStudent} = useAuth();
  const goToClassRoom = () => {
    isStudent
      ? history.push(`/dashboard/classroom/${getRoomData.id}`)
      : history.push(`${getUrl()}?tab=Completed%20Surveys` || '/dashboard');
    removeLocalStorageData('survey_redirect');
  };

  // const handleManualSave = () => {
  //   if (lessonState.updated) {
  //     setWaiting(true);
  //     setSafeToLeave(false);
  //   } else {
  //     setWaiting(false);
  //     setSafeToLeave(true);
  //   }
  //   setTimeout(() => {
  //     goToClassRoom();
  //   }, 1500);
  // };

  const updatePersonLessonsDataMutation = useGraphqlMutation<
    {
      input: UpdatePersonLessonsDataInput;
    },
    UniversalLessonStudentData
  >('updatePersonLessonsData');

  const {setNotification} = useNotifications();

  const triggerNotification = () => {
    setNotification({
      title: 'Your notebook has been saved',
      show: true,
      type: 'success',
      buttonText: 'See notebook',
      buttonUrl: '/anthology?roomId=' + getRoomData.id
    });
  };

  const handleNotebookSave = () => {
    const callback = isLesson ? () => triggerNotification() : () => {};
    createJournalData(callback);

    if (isLesson) {
      console.log('\x1b[33m Saving notebook... \x1b[0m');

      if (saveJournalData?.current) {
        saveJournalData?.current();
      }
    }
    const id = personLessonData.id;

    console.log(`\x1b[33m Updating lesson completion... \x1b[0m`);

    updatePersonLessonsDataMutation
      .mutate({input: {id, isCompleted: true}})
      .then(() => {
        isLesson
          ? history.push(`/dashboard/anthology?roomId=${getRoomData.id}`)
          : goToClassRoom();
        console.log('Successfully completed ' + lessonState?.lessonData?.type);
      })
      .catch((err) => {
        console.error('Error updating current lesson/survey complete status', err);
      });
  };

  // let timer: any;
  // useEffect(() => {
  //   timer = setTimeout(() => {
  //     getLessonCompletedValue &&
  //       getLessonCompletedValue().then((value: any) => {
  //         if (value?.lessonProgress === value?.totalPages) {

  //         } else {

  //         }
  //       });
  //   }, 1300);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [lessonState.currentPage]);

  useEffect(() => {
    if (!lessonState.updated) {
      if (safeToLeave === false) {
        // setWaiting(false);
        setSafeToLeave(true);
      } else {
        // setWaiting(null);
        setSafeToLeave(null);
      }
    }
  }, [lessonState.updated]);

  useEffect(() => {
    // console.log('safeToLeave State - ', safeToLeave);
    if (safeToLeave === true) {
      handleLeavePopup();
      goToClassRoom();
    }
  }, [safeToLeave]);

  // ##################################################################### //
  // ########################## POPUPS & MODALS ########################## //
  // ##################################################################### //

  // ~~~~~~~ LEAVE VERIFICATION POPUP ~~~~~~ //

  const setLeaveModalVisible = (updatedState: boolean) => {
    lessonDispatch({type: 'SET_LEAVE_MODAL_VISIBLE_STATE', payload: updatedState});
  };

  const leaveModalVisible = Boolean(lessonState?.misc?.leaveModalVisible);

  // ~~ VIDEOLINK WHICH IS SHOWN TO USERS ~~ //
  const [videoLink, setVideoLink] = useState<string>('');
  const [videoLinkModalVisible, setVideoLinkModalVisible] = useState<boolean>(false);

  // ~~~~ HANDLE USER LEAVING THE LESSON ~~~ //
  const handleLeavePopup = (isLeavingAfterCompletion: boolean = true) => {
    if (videoLinkModalVisible) {
      setVideoLinkModalVisible(false);
    }

    // setLeaveModalVisible(!leaveModalVisible);
    // setLeaveAfterCompletion(isLeavingAfterCompletion);

    goToClassRoom();
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
      console.log('I am running...');
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
        lessonState.currentPage <= PAGES.length - 1
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
          payload: getPresentedPagedIndex
        });
      }
    }
  }, [teacherIsPresenting, presentedPageID]);

  // ~~~~~~~~~~~~ ARROW BUTTONS ~~~~~~~~~~~~ //
  const handleForward = (forward = true) => {
    if (!forward) {
      handleBack();
    } else {
      if (!userAtEnd()) {
        if (isAtEnd) setisAtEnd(false);
        if (canContinue()) {
          history.push(`${match.url}/${lessonState.currentPage + 1}`);
          lessonDispatch({
            type: 'SET_CURRENT_PAGE',
            payload: lessonState.currentPage + 1
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
          payload: lessonState.currentPage - 1
        });
      } else if (!userAtEnd() && lessonState.currentPage > 0) {
        if (isAtEnd) setisAtEnd(false);
        history.push(`${match.url}/${lessonState.currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage - 1
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
          closeAction={() => setLeaveModalVisible(false)}
          alert={leaveModalVisible}
          setAlert={setLeaveModalVisible}
          button1Color={
            'border-sea-green hover:bg-sea-green text-sea-green white-text-on-hover border-2'
          }
          header={
            isLesson
              ? `Congratulations, you have completed the lesson ${lessonState.lessonData.title}, Did you want to keep your writing excercies in the classroom or move them to your notebook`
              : !isLesson
              ? `Thank you for completing ${lessonState.lessonData.title}`
              : 'This will take you out of the lesson.  Did you want to continue?'
          }
          button1={`${
            isLesson
              ? 'I completed this lesson. \n Move my work to my notebook.'
              : !isLesson
              ? 'I am happy with my responses and want to close the survey'
              : 'Saving your data...'
          }`}
          button2={
            isLesson ? 'Leave in classroom' : 'I am going to keep working on my responses'
          }
          svg="question"
          handleButton1={handleNotebookSave}
          handleButton2={isLesson ? goToClassRoom : () => setLeaveModalVisible(false)}
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
        pageStateUpdated={pageStateUpdated}
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
