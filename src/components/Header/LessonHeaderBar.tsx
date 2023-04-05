import Buttons from '@components/Atoms/Buttons';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import useStudentTimer from '@customHooks/timer';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {Result} from 'antd';
import {UniversalLessonStudentData, UpdatePersonLessonsDataInput} from 'API';
import Modal from 'atoms/Modal';
import {useGlobalContext} from 'contexts/GlobalContext';
import {LessonHeaderBarProps} from 'interfaces/LessonComponentsInterfaces';
import {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, removeLocalStorageData} from 'utilities/localStorage';
import LessonTopMenu from '../Lesson/Navigation/LessonTopMenu';
import {updatePersonLessonsData} from '@graphql/mutations';

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
  >(updatePersonLessonsData);

  const {isStudent} = useAuth();

  const handleNotebookSave = () => {
    console.log('handleNotebookSave');
    isStudent && createJournalData?.();

    if (isLesson) {
      console.log('\x1b[33m Saving notebook... \x1b[0m');

      if (saveJournalData?.current && isStudent) {
        saveJournalData?.current();
      }
    }
    const id = personLessonData?.id || '';

    console.log(`\x1b[33m Updating lesson completion... \x1b[0m`);

    if (id) {
      isStudent
        ? updatePersonLessonsDataMutation
            .mutate({input: {id, isCompleted: true}})
            .then(() => {
              setPersonLessonData?.(null);
              goToClassRoom();
              console.log('Successfully completed ' + lessonState?.lessonData?.type);
            })
            .catch((err) => {
              console.error('Error updating current lesson/survey complete status', err);
            })
        : goToClassRoom();
    }
  };

  useEffect(() => {
    if (!lessonState.updated) {
      if (safeToLeave === false) {
        setSafeToLeave(true);
      } else {
        setSafeToLeave(null);
      }
    }
  }, [lessonState.updated]);

  useEffect(() => {
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
      setVideoLinkModalVisible(false);
    } else {
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
    if (teacherIsPresenting && presentedPageID) {
      const getPresentedPagedIndex = getPageIndex(
        presentedPageID,
        lessonState.lessonData.lessonPlan
      );

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
        h-.7/10 text-lightest shadow-2xl  
        ${theme.toolbar.bg} `}>
        {/* LEAVE POPUP */}

        <Modal open={leaveModalVisible}>
          <Result
            status={'success'}
            title={
              isLesson
                ? `Congratulations, you have completed the lesson ${lessonState.lessonData.title}, Did you want to keep your writing excercies in the classroom or move them to your notebook`
                : !isLesson
                ? `Thank you for completing ${lessonState.lessonData.title}`
                : 'This will take you out of the lesson.  Did you want to continue?'
            }
            extra={[
              <Buttons
                size="middle"
                key="leave"
                className="w-full mb-2"
                variant="dashed"
                onClick={isLesson ? goToClassRoom : () => setLeaveModalVisible(false)}
                label={
                  isLesson
                    ? 'Leave in classroom'
                    : 'I am going to keep working on my responses'
                }
              />,
              <Buttons
                onClick={handleNotebookSave}
                size="middle"
                key="save"
                className="w-full"
                label={
                  isLesson
                    ? 'I completed this lesson. \n Move my work to my notebook.'
                    : !isLesson
                    ? 'I am happy with my responses and want to close the survey'
                    : 'Saving your data...'
                }
              />
            ]}
          />
        </Modal>

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
