import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';

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
  } = props;

  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>
      {/* LABELS */}

      <div
        className={`relative  h-0.5/10 h-8 top-0 font-medium bg-light-gray bg-opacity-10 border-b border-gray-400 flex flex-row items-center z-100`}>
        {/* LEFT */}
        <div className='h-full w-4/10 min-w-100 max-w-160 border-r border-white bg-light-gray bg-opacity-20 pl-2 flex flex-row justify-between '>
          <div title='title' className='h-8 align-middle font-bold text-xs leading-8 '>
            Lesson:
          </div>

          {/* <div className='w-32 flex flex-col text-center'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>Control:</div>
          </div> */}
        </div>

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
            <h1 className={`text-3xl font-medium`}>"{state.data.lesson.title}"</h1>
            <div className='flex flex-row text-xs'>
              <span className='w-auto mr-4'>Control: </span>
              <PlayComplete handleOpen={handleOpen} handleLessonButton={handleLessonButton} />
            </div>
            <p className='text-xs'>Start Date: {state.expectedStartDate}</p>
          </div>
        </div>

        {/* RIGHT */}

        {/* CONTROL START */}
        <div
          className='relative 
            w-6/10 lg:w-full h-full flex flex-col items-center z-100'>
          <LessonControlBar />
          
          {/* BUTTONS */}
          {/* <div className='w-auto mr-4 flex flex-col content-between '>
            <div className='relative flex flex-col my-auto justify-around'>
              <div className='hover:animate-jiggle' onClick={() => setHamburgerOpen(!hamburgerOpen)}>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <FiMenu />
                </IconContext.Provider>
              </div>

              <div className='relative w-full'>
                <div
                  className={`${hamburgerOpen ? 'visible animate-fadeIn' : 'hidden'
                    } w-32 absolute bg-white shadow-xl overflow-hidden z-100 right-1/2 transform  rounded-lg`}>
                  <div
                    className='relative h-auto w-full p-2 flex flex-col content-between justify-center items-center text-center text-sm cursor-pointer px-2 hover:bg-blueberry hover:bg-opacity-20'
                    onClick={handleClick}>
                    <IconContext.Provider value={{ size: '1.5rem' }}>
                      <FiUsers />
                    </IconContext.Provider>
                  User Management
                </div>
                  <div
                    className='relative h-auto w-full p-2 flex flex-col content-between justify-center items-center text-center text-sm cursor-pointer px-2 hover:bg-blueberry hover:bg-opacity-20'
                    onClick={handleHomePopup}>
                    <IconContext.Provider value={{ size: '1.5rem' }}>
                      <FaHome />
                    </IconContext.Provider>
                  Home
                </div>
                </div>
              </div>
            </div>
          </div> */}



        </div>
        {/* CONTROL END */}

        
      </div>
    </>
  );
};

export default TopMenuControl;
