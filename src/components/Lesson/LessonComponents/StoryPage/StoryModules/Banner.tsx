import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaScroll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.warmUp.title;

  return (
    <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <FaScroll />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
