import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { AiOutlineCheckSquare } from 'react-icons/ai';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.title;
  return (
    <div className={`w-full text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <AiOutlineCheckSquare />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
