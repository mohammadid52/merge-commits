import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineSmile } from 'react-icons/ai';
import { LessonContext } from '../../../../contexts/LessonContext';

const keywordCapitilizer = (str: string) => {
  let capitalizedStr = str.replace(/^\w/, (char) => char.toUpperCase());
  return capitalizedStr;
};

const Banner = () => {
  const { state, theme } = useContext(LessonContext);

  return (
    <div className={`w-full h-1/10 text-2xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <AiOutlineSmile />
        </div>
      </IconContext.Provider>

      <p>Congrats! You've completed '{state.data.lesson.title}'!</p>
    </div>
  );
};

export default Banner;
