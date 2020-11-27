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
    <div className='w-auto h-12 flex flex-row items-center text-sm'>
      <div className='w-8 h-8'>
        {/* START BUTTON */}
        {!state.open ? (
          <div
            className='w-full bg-sea-green hover:bg-green-400 text-white cursor-pointer  w-24 mt-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'
            onClick={() => {
              !state.open ? handleOpen() : null;
            }}>
            <IconContext.Provider value={{ size: '1rem' }}>
              <FaPlay />
            </IconContext.Provider>
          </div>
        ) : (
          <div className='w-full bg-dark-gray bg-opacity-20 text-white w-24 mt-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'>
            <IconContext.Provider value={{ size: '1rem' }}>
              <FaPlay />
            </IconContext.Provider>
          </div>
        )}
      </div>

      <div className='w-8 h-8'>
        {/* COMPLETE BUTTON */}
        {state.open ? (
          <div
            className='w-full bg-dark-red hover:bg-red-700 text-white cursor-pointer w-24 mb-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'
            onClick={() => {
              state.open ? handleLessonButton() : null;
            }}>
            <IconContext.Provider value={{ size: '1rem' }}>
              <FaFlagCheckered />
            </IconContext.Provider>
          </div>
        ) : (
          <div className='w-full bg-dark-red text-gray-200 cursor-pointer w-24 mb-0 p-2 leading-none rounded-lg flex items-center justify-center text-center border border-light-gray'>
            <IconContext.Provider value={{ size: '1rem' }}>
              <FaFlagCheckered />
            </IconContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayComplete;
