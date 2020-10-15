import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineCustomerService } from 'react-icons/ai';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const { title, artist } = state.data.lesson.coreLesson.content;

  return (
    <div className={`w-full text-2xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <AiOutlineCustomerService />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
