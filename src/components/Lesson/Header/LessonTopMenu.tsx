import React, {useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import {GlobalContext} from '../../../contexts/GlobalContext';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import {StudentPageInput} from '../../../interfaces/UniversalLessonInterfaces';

const LessonTopMenu = ({
  handlePopup,
  isAtEnd,
  setisAtEnd,
  handleRequiredNotification,
}: LessonHeaderBarProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  const history = useHistory();
  const match = useRouteMatch();

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
        handlePopup();
      } else {
        handleRequiredNotification();
      }
    }
  };

  const handleBack = () => {
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
  };

  return (
    <>
      <div
        className={`${theme.toolbar.bg} shadow-1 w-full flex justify-center items-center content-center py-2 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            {/* <div
              className={`my-auto mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                lessonState.currentPage > 0
                  ? 'cursor-pointer bg-dark-red'
                  : 'cursor-default bg-darker-gray'
              } }`}
              onClick={handleBack}>
              <IconContext.Provider
                value={{
                  size: '1.5rem',
                  style: {width: '32px'},
                  className: `text-white`,
                }}>
                <AiOutlineArrowLeft />
              </IconContext.Provider>
            </div> */}

            {/* PROGRESS BAR */}

            <ProgressBar
              handleHome={() => handlePopup(false)}
              handleRequiredNotification={handleRequiredNotification}
              pages={PAGES}
              currentPage={lessonState?.currentPage}
              studentData={lessonState?.studentData}
              requiredInputs={lessonState?.requiredInputs}
            />

            {/* FORWARD BUTTON */}
            {/* 
            <div
              className={`my-auto ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                canContinue()
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              } `}
              onClick={handleForward}>
              <IconContext.Provider
                value={{
                  size: '1.5rem',
                  style: {width: '32px'},
                  className: `text-white`,
                }}>
                <AiOutlineArrowRight />
              </IconContext.Provider>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonTopMenu;
