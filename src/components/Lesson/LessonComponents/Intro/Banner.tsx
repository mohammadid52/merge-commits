import React, { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPenFancy } from 'react-icons/fa/';
import { LessonContext } from '../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.title;

  useEffect(() => {
    // console.log('TEST  :: ', theme.block.text);
  }, []);

  {/* <div className="w-full h-1/10 flex flex-row justify-center items-center">
<IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
    <div className={`red bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}>
        <FaPenFancy />
    </div>
</IconContext.Provider>
<div className={`${theme.block.bg} title w-full flex flex-row justify-center items-center text-5xl text-center font-open font-bold ${theme.block.text} rounded-lg ${theme.block.shadow} px-4 py-2 z-10`}>
    { title }
</div>
</div> */}

  return (
    <div className={`w-full h-1/10  text-xl md:text-5xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '2.75rem'}}>
        <div className={`red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}>
            <FaPenFancy />
        </div>
    </IconContext.Provider>
      <div className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
        {title}
      </div>
    </div>


  );
};

export default Banner;
