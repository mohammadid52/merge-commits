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
        <div className='w-full h-1/10 flex flex-row justify-center items-center'>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem' }}>
            <div className='red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div className={`h-full ${theme.banner}  text-xl md:text-5xl z-10`}>
            {title}
          </div>
        </div>
      ) : display === 'COOP' ? (
        <div className='w-full h-full flex flex-row justify-center items-center'>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
            <div className='red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div
            className={`${fullscreen ? 'text-4xl' : 'text-2xl'} h-full ${
              theme.banner
            }  text-xl md:text-5xl z-10`}>
            {title}
          </div>
        </div>
      ) : (
        <div className='w-full h-1/10 flex flex-row justify-center items-center'>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
            <div className='red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div
            className={`${fullscreen ? 'text-4xl' : 'text-2xl'} h-full ${
              theme.banner
            }  text-xl md:text-5xl z-10`}>
            {title}
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
