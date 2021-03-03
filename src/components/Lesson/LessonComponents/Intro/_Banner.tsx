import React, { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaHourglassStart } from 'react-icons/fa/';
// import { AiOutlineHourglass } from 'react-icons/ai/';
import { LessonContext } from '../../../../contexts/LessonContext';

const _Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.title;

  useEffect(() => {
    // console.log('TEST  :: ', theme.block.text);
  }, []);

  return (
    <div className={`w-full text-4xl ${theme.banner}`}>
        <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
          <div className="w-auto h-auto mr-2">
          <FaHourglassStart />
          </div>
        </IconContext.Provider>
        {title}
    </div>
  );
};

export default _Banner;
