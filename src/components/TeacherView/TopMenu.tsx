import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';

import LessonControlBar from './LessonControlBar/LessonControlBar';
import PlayComplete from './TopMenu/PlayComplete';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPlay, FaFlagCheckered, FaHome } from 'react-icons/fa';
import { FiUsers, FiMenu } from 'react-icons/fi';

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
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);

  return (
    <>
      {/* LABELS */}

      <div
        className={`relative w-full h-0.5/10 border-b border-gray-400 flex flex-row items-center`}>
        {/* LABELS BG */}
        <div className='absolute w-full h-8 top-0 font-medium bg-light-gray bg-opacity-30'></div>

        {/* LEFT */}
        <div className='h-full w-3/10 min-w-100 max-w-160 px-4 flex flex-row justify-between '>
          <div className='w-full flex flex-col'>
            <div title='title' className='h-8 align-middle font-bold text-xs leading-8 '>
              Lesson:
            </div>
          </div>

          <div className='w-32 flex flex-col text-center'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>Control:</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='h-full w-full pr-4 flex flex-row justify-between  text-center'>
          <div className='w-1.5/10 flex flex-col'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>Start/End Date:</div>
          </div>

          {/* SHARING START */}
          <div className='w-7/10 flex justify-around'>
            {/* VIEWING TAB */}
            <div className='w-full flex flex-col'>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Currently viewing:</span>
              </div>
            </div>

            {/* SHARE ACTION */}
            <div className='w-full flex flex-col'>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Action:</span>
              </div>
            </div>

            {/* SHARING TAB */}
            <div className={`w-full h-full flex flex-col`}>
              <div className='h-8 align-middle font-bold text-xs leading-8 '>
                <span className='font-bold text-black'>Currently sharing:</span>
              </div>
            </div>
          </div>

          {/* SHARING END */}

          {/* BUTTONS */}
          <div className='w-auto mr-4 flex flex-col content-between'>
            <div className='h-8 align-middle font-bold text-xs leading-8 '>
              <span className='font-bold text-black'>Navigation:</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTONS & CONTENT */}

      <div
        className={`relative w-full h-22 py-2 bg-light-gray bg-opacity-10 border-b border-gray-400 flex flex-row mt-0`}>
        
        {/* LEFT */}
        <div className='h-full w-3/10 min-w-100 max-w-160 px-4 flex flex-row justify-between '>
          <div className='w-full flex flex-col my-auto'>
            <div className='flex flex-row space-between'>
              <h1 className={`text-3xl font-medium`}>"{state.data.lesson.title}"</h1>
              <PlayComplete handleOpen={handleOpen} handleLessonButton={handleLessonButton} />
              </div>
            <p className='text-xs'>Start Date: {state.expectedStartDate}</p>
          </div>

          

        </div>

        {/* RIGHT */}

        {/* CONTROL START */}
        <div className='w-7/10 flex justify-around z-100'>
          <LessonControlBar />
        </div>
        {/* CONTROL END */}

        {/* BUTTONS */}
        <div className='w-auto mr-4 flex flex-col content-between '>
          <div className='relative flex flex-col my-auto justify-around'>
            <div className='hover:animate-jiggle' onClick={() => setHamburgerOpen(!hamburgerOpen)}>
              <IconContext.Provider value={{ size: '1.5rem' }}>
                <FiMenu />
              </IconContext.Provider>
            </div>

            <div className='relative w-full'>
              <div
                className={`${
                  hamburgerOpen ? 'visible animate-fadeIn' : 'hidden'
                } w-32 absolute bg-white shadow-xl overflow-hidden z-100 right-1/2 transform  rounded-lg`}>
                {' '}
                //translate-x-1/2
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
        </div>
      </div>
    </>
  );
};

export default TopMenuControl;
