import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaPenFancy } from 'react-icons/fa';

interface BannerProps {
  title: string;
  artist?: string;
  display: string;
  fullscreen: boolean;
}

const Banner = (props: BannerProps) => {
  const { theme } = useContext(LessonContext);
  const { title, artist, display, fullscreen } = props;

  return (
    <>
      {display === 'SELF' ? (
        <div className={`w-full h-1/10 ${theme.banner} flex flex-row justify-center items-center`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem' }}>
            <div className='bg-dark-red h-16 w-16 flex flex-col items-center rounded-lg justify-center z-20 shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div className={`h-full text-gray-200 font-medium text-xl md:text-5xl z-10 flex justify-center items-center`}>
            {title}
          </div>
        </div>
      ) : display === 'COOP' ? ( 
        <div className={`w-full h-full ${theme.banner} flex flex-row justify-center items-center`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
            <div className='bg-dark-red h-12 w-12 flex flex-col items-center rounded-lg justify-center z-20 shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-3xl'} text-gray-200 h-full bg-dark-blue w-full flex flex-row justify-center items-center text-center rounded-lg z-10`}>
                { title }
            </div>
        </div>
      ) : (
        <div className={`w-full h-1/10 ${theme.banner} flex flex-row justify-center items-center`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
            <div className='bg-dark-red h-12 w-12 flex flex-col items-center rounded-lg justify-center z-20 shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div
            className={`text-3xl h-full text-gray-200 z-10 flex justify-center items-center`}>
            {title}
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
