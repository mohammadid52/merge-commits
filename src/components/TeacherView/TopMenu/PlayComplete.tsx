import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import LessonControlBar from '../LessonControlBar/LessonControlBar';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPlay, FaFlagCheckered, FaHome } from 'react-icons/fa';
import { FiUsers, FiMenu } from 'react-icons/fi';

interface PlayCompleteProps {
  handleOpen: () => void;
  handleLessonButton: () => void;
}

const PlayComplete: React.FC<PlayCompleteProps> = (props: PlayCompleteProps) => {
  const { handleOpen, handleLessonButton } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>

      {/* START BUTTON */}
      {!state.open ? (
        <span
          className='w-auto font-bold text-blueberry hover:text-blue-500 hover:text-underline cursor-pointer'
          onClick={() => {
            !state.open ? handleOpen() : null;
          }}>
          Start
          {/* <IconContext.Provider value={{ size: '1rem' }}>
              <FaPlay />
            </IconContext.Provider> */}
        </span>
      ) : (
        <span className='w-auto bg-opacity-20 text-light-gray'>
          Start
          {/* <IconContext.Provider value={{ size: '1rem' }}>
              <FaPlay />
            </IconContext.Provider> */}
        </span>
      )}

      
      
      {/* START-COMPLETE DIVIDER */}
      <span className='w-auto'> / </span>

      
      
      {/* COMPLETE BUTTON */}
      {state.open ? (
        <span
          className='w-auto font-bold text-blueberry hover:text-blue-500 hover:text-underline cursor-pointer'
          onClick={() => {
            state.open ? handleLessonButton() : null;
          }}>
          Complete
          {/* <IconContext.Provider value={{ size: '1rem' }}>
              <FaFlagCheckered />
            </IconContext.Provider> */}
        </span>
      ) : (
        <span className='w-auto bg-opacity-20 text-light-gray'>
          Complete
          {/* <IconContext.Provider value={{ size: '1rem' }}>
              <FaFlagCheckered />
            </IconContext.Provider> */}
        </span>
      )}

    </>
  );
};

export default PlayComplete;
