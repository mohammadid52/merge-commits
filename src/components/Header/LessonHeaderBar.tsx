import ErrorBoundary from '@components/Error/ErrorBoundary';
import useStudentTimer from '@customHooks/timer';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {UniversalLessonStudentData, UpdatePersonLessonsDataInput} from 'API';
import Modal from 'atoms/Modal';
import {useGlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, removeLocalStorageData} from 'utilities/localStorage';
import PositiveAlert from '../General/Popup';
import LessonTopMenu from '../Lesson/Navigation/LessonTopMenu';

const LessonHeaderBar = ({
  overlay,
  setOverlay,
  pageStateUpdated,
  isAtEnd,
  setisAtEnd,
  createJournalData,
  handleRequiredNotification,
  personLessonData,
  canContinue,
  setPersonLessonData,
  validateRequired,
  updatePageInLocalStorage
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
  useStudentTimer();
  const isLesson = lessonState?.lessonData.type === 'lesson';

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const getRoomData = getLocalStorageData('room_info');

  const [safeToLeave, setSafeToLeave] = useState<any>(null);

  // To track user clicks on home button or click next on last page

  const goToClassRoom = async () => {
    setPersonLessonData?.(null);

    history.push(`/dashboard/classroom/${getRoomData.id}`);
    removeLocalStorageData('survey_redirect');
  };

  const updatePersonLessonsDataMutation = useGraphqlMutation<
    {
      input: UpdatePersonLessonsDataInput;
    },
    UniversalLessonStudentData
  >('updatePersonLessonsData');

  const handleNotebookSave = () => {
    console.log('handleNotebookSave');
    createJournalData?.();

    if (isLesson) {
      console.log('\x1b[33m Saving notebook... \x1b[0m');

      if (saveJournalData?.current) {
        saveJournalData?.current();
      }
    }
    const id = personLessonData?.id || '';

    console.log(`\x1b[33m Updating lesson completion... \x1b[0m`);

    if (id) {
      updatePersonLessonsDataMutation
        .mutate({input: {id, isCompleted: true}})
        .then(() => {
          setPersonLessonData?.(null);
          goToClassRoom();
          console.log('Successfully completed ' + lessonState?.lessonData?.type);
        })
        .catch((err) => {
          console.error('Error updating current lesson/survey complete status', err);
        });
    }
  };

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
    lessonDispatch({
      type: 'SET_LEAVE_MODAL_VISIBLE_STATE',
      payload: updatedState
    });
  };

  const leaveModalVisible = Boolean(lessonState?.misc?.leaveModalVisible);

  // ~~ VIDEOLINK WHICH IS SHOWN TO USERS ~~ //
  const [videoLink, setVideoLink] = useState<string>('');
  const [videoLinkModalVisible, setVideoLinkModalVisible] = useState<boolean>(false);

  // ~~~~ HANDLE USER LEAVING THE LESSON ~~~ //
  const handleLeavePopup = () => {
    if (videoLinkModalVisible) {
      setVideoLinkModalVisible(false);
    }

    goToClassRoom();
  };

  // ~~~~ POPUP IF A VIDEO IS AVAILABLE ~~~~ //
  const handleVideoLinkPopup = (_?: string) => {
    if (videoLinkModalVisible) {
      // setVideoLink('');
      setVideoLinkModalVisible(false);
    } else {
      // setVideoLink(url);
      setVideoLinkModalVisible(true);
    }
  };

  const getPageLabel = (locationIndex: number) => {
    if (lessonState.lessonData && lessonState.lessonData?.lessonPlan) {
      return lessonState?.lessonData?.lessonPlan?.[locationIndex]?.label;
    }
    return 'n/a';
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

  const userAtEnd = () => lessonState.currentPage === PAGES.length - 1;

  // ##################################################################### //
  // ############################# NAVIGATION ############################ //
  // ##################################################################### //

  const getPageIndex = (pageID: string, pageArray: any[]) => {
    if (pageID && pageArray) {
      return pageArray.findIndex((pageObj: any) => pageObj.id === pageID);
    }
    return null;
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
        if (isAtEnd) setisAtEnd?.(false);
        if (canContinue) {
          history.push(`${match.url}/${lessonState.currentPage + 1}`);
          lessonDispatch({
            type: 'SET_CURRENT_PAGE',
            payload: lessonState.currentPage + 1
          });
        } else {
          handleRequiredNotification?.();
        }
      } else if (userAtEnd()) {
        if (validateRequired?.(lessonState.currentPage)) {
          handleLeavePopup();
        } else {
          handleRequiredNotification?.();
        }
      }
    }
  };

  const handleBack = () => {
    if (lessonState.currentPage === 0) {
      handleLeavePopup();
    } else {
      if (userAtEnd()) {
        if (isAtEnd) setisAtEnd?.(false);
        history.push(`${match.url}/${lessonState.currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage - 1
        });
      } else if (!userAtEnd() && lessonState.currentPage > 0) {
        if (isAtEnd) setisAtEnd?.(false);
        history.push(`${match.url}/${lessonState.currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage - 1
        });
      }
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <ErrorBoundary
      authId={user.authId}
      email={user.email}
      componentName="LessonHeaderBar"
      fallback={<h1>LessonHeaderBar is not working</h1>}>
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
              isLesson
                ? 'Leave in classroom'
                : 'I am going to keep working on my responses'
            }
            svg="question"
            handleButton1={handleNotebookSave}
            handleButton2={isLesson ? goToClassRoom : () => setLeaveModalVisible(false)}
            theme="dark"
            fill="screen"
          />
        </div>

        {/* VIDEO POPUP */}

        <Modal
          open={Boolean(!leaveModalVisible && videoLink)}
          title={`Video for "${getPageLabel(lessonState?.currentPage || 0)}"`}
          showHeader={true}
          showHeaderBorder={false}
          showFooter={false}
          scrollHidden={true}
          closeAction={handleVideoLinkPopup}>
          <ReactPlayer url={videoLink} controls={true} pip={true} stopOnUnmount={false} />
        </Modal>

        <LessonTopMenu
          overlay={overlay}
          pageStateUpdated={pageStateUpdated}
          setOverlay={setOverlay}
          handlePopup={handleLeavePopup}
          isAtEnd={isAtEnd}
          updatePageInLocalStorage={updatePageInLocalStorage}
          setisAtEnd={setisAtEnd}
          validateRequired={validateRequired}
          handleRequiredNotification={handleRequiredNotification}
          pages={PAGES}
          canContinue={canContinue}
          handleForward={handleForward}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LessonHeaderBar;
