import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import { IconContext } from 'react-icons';
import { FaCheck } from 'react-icons/fa';

const Banner = () => {
  const { state, theme } = useContext(LessonControlContext);
  const title = state.data.lesson.title;
  return (
    <div className={`w-full text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <FaCheck />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
