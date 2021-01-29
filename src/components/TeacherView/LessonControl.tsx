import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import * as customMutations from '../../customGraphql/customMutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import ClassRoster from './ClassRoster';
import PositiveAlert from '../General/Popup';
import { useOutsideAlerter } from '../General/hooks/outsideAlerter';
import Body from './Body';
import TopMenu from './TopMenu';
import StudentWindowTitleBar from './StudentWindow/StudentWindowTitleBar';
import QuickRegister from '../Auth/QuickRegister';
import { awsFormatDate, dateString } from '../../utilities/time';

const LessonControl = () => {
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenInstructions, setFullscreenInstructions] = useState(false);

  const [shareable, setShareable] = useState(false); // THIS ROW COPIED TO RosterRow.tsx, NEEDS TO BE REFACTORED

  const [isSameStudentShared, setIsSameStudentShared] = useState(false);
  const [open, setOpen] = useState(state.open);
  const [pageViewed, setPageViewed] = useState({
    pageID: 0,
    stage: 'intro',
  });

  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  useEffect(() => {
    if (state.pages.length > 0 && state.unsavedChanges) {
      handleUpdateSyllabusLesson();
    }
  }, [state.unsavedChanges]);

  useEffect(() => {
    let result = /.+\/(breakdown)\/*.*/.test(location.pathname);

    if (result) {
      setShareable(true);
    }

    if (!result) {
      setShareable(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (state.studentViewing.live) {
      let hasCurrentLocation = typeof state.studentViewing.studentInfo.currentLocation === 'string';

      console.log(typeof state.studentViewing.studentInfo.currentLocation, hasCurrentLocation);

      if (hasCurrentLocation) {
        history.push(`${match.url}/${state.studentViewing.studentInfo.currentLocation}`);
      }

      if (!hasCurrentLocation) {
        history.push(`${match.url}/${state.studentViewing.studentInfo.lessonProgress}`);
      }
    }
  }, [state.studentViewing]);

  useEffect(() => {
    if (
      !state.displayData ||
      !state.displayData.studentInfo ||
      !state.studentViewing.studentInfo ||
      !state.studentViewing.studentInfo.student
    ) {
      setIsSameStudentShared(false);
    }

    if (
      state.displayData &&
      state.displayData.studentInfo &&
      state.studentViewing.studentInfo &&
      state.studentViewing.studentInfo.student
    ) {
      if (state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id) {
        setIsSameStudentShared(true);
      }

      if (state.displayData.studentInfo.id !== state.studentViewing.studentInfo.student.id) {
        setIsSameStudentShared(false);
      }

      if (
        state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id &&
        !state.studentViewing.live
      ) {
        setIsSameStudentShared(false);
      }
    }
  }, [state.displayData, state.studentViewing]);

  /**
   * CLASSROOM DATE && STUDENT SHARING
   */
  const handleUpdateSyllabusLesson = async () => {
    let updatedSyllabusLessonData: any = {
      id: state.syllabusLessonID,
      status: state.open ? 'Active' : 'Inactive',
      complete: state.complete ? state.complete : false,
      viewing:
        state.studentViewing.studentInfo && state.studentViewing.studentInfo.studentAuthID
          ? state.studentViewing.studentInfo.studentAuthID
          : null,
      displayData: state.displayData,
      lessonPlan: state.pages,
      startDate: '',
      endDate: '',
    };

    try {
      const updatedSyllabusLesson = await API.graphql(
        graphqlOperation(customMutations.updateSyllabusLesson, {
          input: updatedSyllabusLessonData,
        })
      );
      dispatch({ type: 'SAVED_CHANGES' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareStudentData = async () => {
    if (state.studentViewing.studentInfo) {
      let displayData = {
        breakdownComponent: state.studentViewing.studentInfo.currentLocation
          ? state.studentViewing.studentInfo.currentLocation
          : state.studentViewing.studentInfo.lessonProgress,
        studentInfo: {
          id: state.studentViewing.studentInfo.student.id,
          firstName: state.studentViewing.studentInfo.student.firstName,
          preferredName: state.studentViewing.studentInfo.student.preferredName
            ? state.studentViewing.studentInfo.student.preferredName
            : null,
          lastName: state.studentViewing.studentInfo.student.lastName,
        },
        warmUpData: state.studentViewing.studentInfo.warmupData ? state.studentViewing.studentInfo.warmupData : null,
        corelessonData: state.studentViewing.studentInfo.corelessonData
          ? state.studentViewing.studentInfo.corelessonData
          : null,
        activityData: state.studentViewing.studentInfo.activityData
          ? state.studentViewing.studentInfo.activityData
          : null,
      };
      // console.log(displayData);
      dispatch({
        type: 'SET_SHARE_MODE',
        payload: state.studentViewing.studentInfo.currentLocation
          ? state.studentViewing.studentInfo.currentLocation
          : state.studentViewing.studentInfo.lessonProgress,
      });
      dispatch({ type: 'SET_DISPLAY_DATA', payload: displayData });
    }
  };

  /**
   * USEEFFECT that listens for changes to expected end date in state,
   * and then triggers the save mutation
   */
  const handleQuitShare = () => {
    dispatch({ type: 'QUIT_SHARE_MODE' });
    setIsSameStudentShared(false);
  };

  const handleQuitViewing = () => {
    dispatch({ type: 'QUIT_STUDENT_VIEWING' });
    setIsSameStudentShared(false);
  };

  /**
   * LESSON CONTROL
   */

  const handleCompleteClassroom = async () => {
    let completedSyllabusLessonData = {
      id: state.syllabusLessonID,
      status: 'Inactive',
      complete: true,
      endDate: awsFormatDate(dateString('-', 'WORLD')),
    };

    try {
      const completedSyllabusLesson = await API.graphql(
        graphqlOperation(customMutations.updateSyllabusLesson, {
          input: completedSyllabusLessonData,
        })
      );
      dispatch({ type: 'SAVED_CHANGES' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSyllabusLesson = async () => {
    let startedSyllabusLessonData = {
      id: state.syllabusLessonID,
      status: 'Active',
      complete: false,
      startDate: awsFormatDate(dateString('-', 'WORLD')),
    };

    try {
      console.log(startedSyllabusLessonData);
      const startedSyllabusLesson = await API.graphql(
        graphqlOperation(customMutations.updateSyllabusLesson, {
          input: startedSyllabusLessonData,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = async () => {
    await handleOpenSyllabusLesson();
    dispatch({ type: 'START_CLASSROOM' });
    setOpen(true);
  };

  const handleComplete = async () => {
    await handleCompleteClassroom();
    dispatch({ type: 'COMPLETE_CLASSROOM', payload: dateString('-', 'US') });
    setOpen(true);
    handleHome();
  };

  const handleGoToUserManagement = () => {
    history.push('/dashboard/manage-users');
  };

  const handleHome = () => {
    history.push('/dashboard/lesson-planner');
  };

  const { visible, setVisible, ref } = useOutsideAlerter(false);

  /*
   *
   * Passing components upwards as popups
   *
   * */
  const [quickRegister, setQuickRegister] = useState(false);
  const [instructions, setInstructions] = useState({
    visible: false,
    available: false,
    content: null,
  });

  const [homePopup, setHomePopup] = useState(false);
  const [lessonButton, setLessonButton] = useState(false);

  const handleClick = () => {
    setVisible((prevState: any) => !prevState);
  };

  const handleHomePopup = () => {
    setHomePopup((prevState: any) => !prevState);
  };

  const handleLessonButton = () => {
    setLessonButton((prevState: any) => !prevState);
  };

  if (state.status !== 'loaded') {
    return <ComponentLoading />;
  }

  return (
    <div className={`w-full h-screen bg-gray-200 overflow-hidden`}>
      <div className={`relative w-full h-full flex flex-col`}>
        {/**
         * POPUPS SECTION:
         * DEFINITELY NEEDS SOME RESTRUCTURING AND OPTIMIZATION
         * /}

        {/* QUICK REGISTER */}

        <QuickRegister active={quickRegister} setQuickRegister={setQuickRegister} />

        {/* USER MANAGEMENT */}
        <div className={`${visible ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleClick}>
          <PositiveAlert
            identifier={''}
            alert={visible}
            setAlert={setVisible}
            header="Are you sure you want to leave the Teacher View?"
            button1="Go to student management"
            button2="Cancel"
            svg="question"
            handleButton1={handleGoToUserManagement}
            handleButton2={() => handleClick}
            theme="light"
            fill="screen"
          />
        </div>
        {/* HANDLE GO  HOME */}
        <div className={`${homePopup ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleHomePopup}>
          <PositiveAlert
            identifier={''}
            alert={homePopup}
            setAlert={setHomePopup}
            header="Are you sure you want to leave the Teacher View?"
            button1="Go to the dashboard"
            button2="Cancel"
            svg="question"
            handleButton1={handleHome}
            handleButton2={() => handleHomePopup}
            theme="light"
            fill="screen"
          />
        </div>
        <div className={`${lessonButton ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleLessonButton}>
          <PositiveAlert
            identifier={''}
            alert={lessonButton}
            setAlert={setLessonButton}
            header="Are you sure you want to complete this lesson?"
            button1="Complete lesson"
            button2="Cancel"
            svg="question"
            handleButton1={() => {
              handleComplete();
            }}
            handleButton2={() => handleLessonButton}
            theme="light"
            fill="screen"
          />
        </div>

        {/* START TOP MENU */}
        <TopMenu
          shareable={shareable}
          setShareable={setShareable}
          isSameStudentShared={isSameStudentShared}
          handleOpen={handleOpen}
          handleComplete={handleComplete}
          handleLessonButton={handleLessonButton}
          handleQuitViewing={handleQuitViewing}
          handleShareStudentData={handleShareStudentData}
          handleQuitShare={handleQuitShare}
          handleClick={handleClick}
          handleHomePopup={handleHomePopup}
          pageViewed={pageViewed}
          setPageViewed={setPageViewed}
          setQuickRegister={setQuickRegister}
        />
        {/* END TOP MENU */}

        <div className={`w-full h-8.5/10 flex rounded-lg`}>
          {/* LEFT SECTION */}
          <div
            className={`${fullscreen ? 'hidden' : ''} w-4/10 min-w-100 max-w-160 h-full flex flex-col items-center `}>
            <div className={`h-full w-full flex flex-col justify-between items-center`}>
              {/* <ClassRosterTitleBar handleResetDoneCounter={handleResetDoneCounter} /> */}

              <div className={`h-full`}>
                <ClassRoster
                  handleUpdateSyllabusLesson={handleUpdateSyllabusLesson}
                  handleShareStudentData={handleShareStudentData}
                  isSameStudentShared={isSameStudentShared}
                  handleQuitShare={handleQuitShare}
                  handleQuitViewing={handleQuitViewing}
                  setPageViewed={setPageViewed}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div
            className={`relative 
            ${fullscreen ? 'w-full' : 'w-6/10'} relative 
            w-6/10 lg:w-full h-full flex flex-col items-center`}>
            <StudentWindowTitleBar
              setFullscreenInstructions={setFullscreenInstructions}
              fullscreenInstructions={fullscreenInstructions}
              handleFullscreen={handleFullscreen}
              fullscreen={fullscreen}
              pageViewed={pageViewed}
              setPageViewed={setPageViewed}
              instructions={instructions}
              setInstructions={setInstructions}
            />

            <div
              className={`
                          ${fullscreen ? 'h-full' : 'h-full'}
                          ${theme.bg} 
                          relative w-full  
                          border-t-2 border-black
                          overflow-y-scroll overflow-x-hidden`}>
              {/**
               *
               * INSTRUCTIONS
               *
               * */}
              {instructions.visible && instructions.available ? (
                <div
                  className={`
                            ${fullscreen ? 'h-full' : 'h-full'}
                            absolute w-full
                            border-t-2 border-black
                            overflow-hidden bg-black bg-opacity-40 z-100`}>
                  <div
                    className={`absolute w-full h-full shadow-xl text-lg flex justify-center items-center animate-fadeIn`}>
                    <div className={` w-5/10 h-5/10  mx-auto my-auto bg-light-gray p-4 rounded-xl`}>
                      {instructions.content}
                    </div>
                  </div>
                </div>
              ) : null}

              {/**
               *
               * COMPONENT
               *
               * */}
              <div className={`h-full p-4`}>
                <Suspense
                  fallback={
                    <div className="min-h-screen w-full flex flex-col justify-center items-center">
                      <ComponentLoading />
                    </div>
                  }>
                  {/**
                   *
                   *
                   * THIS LOADS THE LESSON COMPONENT
                   *
                   *
                   */}
                  <Body fullscreenInstructions={fullscreenInstructions} setInstructions={setInstructions} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonControl;
