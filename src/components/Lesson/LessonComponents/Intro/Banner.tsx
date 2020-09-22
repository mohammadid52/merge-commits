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
    <div className={`w-full h-1/10  text-xl md:text-5xl ${theme.banner}`}>
      
      <div
        className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
        {/* {title} */}
        Today's Lesson
      </div>
    </div>
  );
};

export default Banner;
