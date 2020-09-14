import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaMusic } from 'react-icons/fa';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const { title, artist } = state.data.lesson.coreLesson.content;

  return (
    <div className='w-full h-1/10 flex flex-row justify-center items-center'>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem' }}>
        <div className='red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'>
          <FaMusic />
        </div>
      </IconContext.Provider>
      <div className={`h-full ${theme.banner}  text-xl md:text-5xl z-10`}>
        {title}
      </div>
    </div>
  );
};

export default Banner;
