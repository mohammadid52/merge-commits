import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaPenFancy } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
  const { state, theme } = useContext(LessonContext);
  const title = state.data.lesson.activity.title;

  return (
    <div className={`w-full h-1/10 ${theme.banner} flex flex-row justify-center items-center`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem' }}>
      <div className='bg-dark-red h-16 w-16 flex flex-col items-center rounded-lg justify-center z-20 shadow-2'>
          <FaPenFancy />
        </div>
      </IconContext.Provider>
      <div className={`h-full font-medium text-xl md:text-5xl z-10 flex justify-center items-center`}>
        {title}
      </div>
    </div>

    // <div className="banner w-full flex flex-row justify-center items-center my-4">
    //     <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
    //         <div className="red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
    //             <FaPenFancy />
    //         </div>
    //     </IconContext.Provider>
    //     <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-4xl text-center font-open font-light text-gray-200 rounded-sm shadow-2 px-4 py-2 z-10">
    //         { title }
    //     </div>
    // </div>
  );
};

export default Banner;
