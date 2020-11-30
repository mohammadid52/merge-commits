import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface PlayCompleteProps {
  handleOpen: () => void;
  handleLessonButton: () => void;
}

const PlayComplete: React.FC<PlayCompleteProps> = (props: PlayCompleteProps) => {
  const { handleOpen, handleLessonButton } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>

      {/* START / COMPLETE BUTTON */}
      {!state.open ? (
        <span
          className='w-auto h-6 my-auto mr-2 leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer'
          onClick={() => {
            !state.open ? handleOpen() : null;
          }}>
          Start
        </span>
      ) : null}

      {state.open ? (
        <span
          className='w-auto h-6 my-auto  mr-2 leading-4 text-xs text-white bg-blueberry hover:bg-blue-500 hover:text-underline p-1 rounded-lg cursor-pointer'
          onClick={() => {
            state.open ? handleLessonButton() : null;
          }}>
          Complete
        </span>
      ) : null}

    </>
  );
};

export default PlayComplete;
