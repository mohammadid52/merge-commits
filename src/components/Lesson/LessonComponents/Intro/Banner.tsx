import React, { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
// import { FaPenFancy } from 'react-icons/fa/';
import { BsPen } from 'react-icons/bs/';
import { LessonContext } from '../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.title;

  useEffect(() => {
    // console.log('TEST  :: ', theme.block.text);
  }, []);

  return (
    <div className={`w-full text-2xl ${theme.banner}`}>
        <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
          <div className="w-auto h-auto mr-2">
          <BsPen />
          </div>
        </IconContext.Provider>
        {title}
    </div>
  );
};

export default Banner;
