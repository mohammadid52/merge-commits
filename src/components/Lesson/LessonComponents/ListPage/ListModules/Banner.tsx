import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaScroll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.warmUp.title;

  return (
    <div className={`w-full h-1/10  ${theme.banner} flex flex-row justify-center items-center`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '2.7rem' }}>
        <div className='bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg'>
          <FaScroll />
        </div>
      </IconContext.Provider>
      <div
        className={`h-full w-full font-medium text-xl md:text-5xl z-10 flex justify-center items-center`}>
        {title}
      </div>
    </div>
  );
};

export default Banner;
