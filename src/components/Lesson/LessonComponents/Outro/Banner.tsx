import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaTrophy } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';
const Banner = () => {
  const { state, theme } = useContext(LessonContext);

  return (
    <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <FaTrophy />
        </div>
      </IconContext.Provider>

      <p>Congrats! You've completed '{state.data.lesson.title}'!</p>
    </div>
  );
};

export default Banner;
