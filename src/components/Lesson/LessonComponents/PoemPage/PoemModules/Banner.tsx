import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.activity.title;

  return (
    <div className={`w-full text-2xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <AiOutlineForm />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
