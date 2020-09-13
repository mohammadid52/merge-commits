import React, { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { FaPenFancy } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.title;

  useEffect(() => {
    console.log('TEST  :: ', theme.block.text);
  }, []);

  return (
    <div className='relative w-full h-1/10 flex flex-row justify-center items-center'>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
        {/* <div className={`h-full bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}> */}
        <div
          className={`bg-dark-red absolute left-0 h-8 w-8 flex flex-col items-center z-20 rounded-lg`}>
          <FaPenFancy />
        </div>
      </IconContext.Provider>
      {/* <div className={`${theme.block.bg} h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-light ${theme.block.text} rounded-lg ${theme.block.shadow} z-10`}> */}
      <div
        className={`border-b border-white border-opacity-50 h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-light ${theme.block.text} z-10`}>
        {title}
      </div>
    </div>
  );
};

export default Banner;
