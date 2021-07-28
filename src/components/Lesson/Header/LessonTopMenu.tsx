import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import {getLocalStorageData} from '../../../utilities/localStorage';

const LessonTopMenu = ({handlePopup, isAtEnd, setisAtEnd}: LessonHeaderBarProps) => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();

  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;

  const canContinue = () => {
    return (
      lessonState.currentPage < PAGES.length - 1 &&
      PAGES[lessonState.currentPage + 1]?.open !== false
    );
  };

  const userAtEnd = () => {
    return lessonState.currentPage === PAGES.length - 1;
  };

  //  NAVIGATION CONTROLS
  const handleForward = () => {
    if (!userAtEnd()) {
      if (isAtEnd) setisAtEnd(false);
      if (canContinue()) {
        history.push(`${match.url}/${lessonState.currentPage + 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: lessonState.currentPage + 1,
        });
      }
    } else if (userAtEnd()) {
      handlePopup();
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
        className={` ${theme.toolbar.bg} shadow-1 h-16 w-full flex justify-center items-center content-center py-4 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            <div
              className={`mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
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
            </div>

            {/* PROGRESS BAR */}

            <ProgressBar />

            {/* FORWARD BUTTON */}

            <div
              className={`ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                canContinue || userAtEnd
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
            </div>
          </div>
        </div>
      </div>

      {/* ICON LABEL HOVER BAR */}
      <div className={`w-full h-6 bg-darker-gray`} />
    </>
  );
};

export default LessonTopMenu;
