import React, { useEffect, useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { BsPencilSquare } from 'react-icons/all';
import { LessonContext } from '../../../../contexts/LessonContext';

const NotesWidget = () => {
  const {state, dispatch} = useContext(LessonContext);

  return(
  <div className={`cursor-pointer flex flex-col justify-center items-center mb-4`}>
    <div className={`w-12 h-12 flex justify-center items-center bg-white rounded-full`}>
      <IconContext.Provider value={{ size: '1.5rem' }}>
        <BsPencilSquare color={`black`} />
      </IconContext.Provider>
    </div>
    <p className='text-xs text-gray-200 text-center'>Notes</p>
  </div>
  )
};

export default NotesWidget;