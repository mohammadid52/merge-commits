import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';

import LessonInfoTitleBar from './TopMenu/LessonInfoTitleBar';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import PlayComplete from './TopMenu/PlayComplete';

import HamburgerMenu from './TopMenu/HamburgerMenu';

/**
 * IMPORT FUNCTIONS
 */
import { firstInitialFunc } from '../../utilities/strings';

interface TopMenuControlProps {
  shareable: boolean;
  setShareable: React.Dispatch<React.SetStateAction<boolean>>;
  isSameStudentShared: boolean;
  handleOpen: () => void;
  handleLessonButton: () => void;
  handleQuitViewing: () => void;
  handleShareStudentData: () => void;
  handleQuitShare: () => void;
  handleClick: () => void;
  handleHomePopup: () => void;
  pageViewed: {pageID: number, stage: string};
  setPageViewed: React.Dispatch<React.SetStateAction<object>>;
}

const TopMenuControl: React.FC<TopMenuControlProps> = (props: TopMenuControlProps) => {
  const {
    shareable,
    setShareable,
    isSameStudentShared,
    handleOpen,
    handleLessonButton,
    handleQuitViewing,
    handleShareStudentData,
    handleQuitShare,
    handleClick,
    handleHomePopup,
    pageViewed,
    setPageViewed
  } = props;

  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>
      {/* LABELS */}

      <div
        className={`relative  h-0.5/10 h-8 top-0 font-medium bg-light-gray bg-opacity-10 border-b border-gray-400 flex flex-row items-center z-100`}>
        {/* LEFT */}
        <LessonInfoTitleBar 
          handleOpen={handleOpen}
          handleLessonButton={handleLessonButton}
        />

        {/* RIGHT */}
        <div
          className='relative w-6/10 lg:w-full h-full flex flex-row justify-between items-center pl-2'>
          
          <div className='h-8 align-middle font-bold text-xs leading-8 '>Lesson Control:</div>
          
          <HamburgerMenu 
            handleClick={handleClick}
            handleHomePopup={handleHomePopup}
          />

        </div>
      </div>

      {/* BUTTONS & CONTENT */}

      <div
        className={`relative w-full h-22 border-b border-gray-400 flex flex-row mt-0 z-50`}>
        {/* LEFT */}
        <div className='h-full  w-4/10 min-w-100 max-w-160 border-r border-white bg-light-gray bg-opacity-10 pl-2 flex flex-row justify-between '>
          <div className='w-full flex flex-col my-auto'>
            
            <p className='text-xs'>Topic: Identity</p>
            <p className='text-xs'>Start Date: {state.expectedStartDate}</p>
            <p className='text-xs'>Estimated Time: 1 hr 15 mins</p>
          </div>
        </div>

        {/* RIGHT */}

        {/* CONTROL START */}
        <div
          className='relative 
            w-6/10 lg:w-full h-20 flex flex-col items-center z-100'>
          <LessonControlBar 
            pageViewed={pageViewed}
            setPageViewed={setPageViewed}
          />
          
         
        </div>
        {/* CONTROL END */}

        
      </div>
    </>
  );
};

export default TopMenuControl;
