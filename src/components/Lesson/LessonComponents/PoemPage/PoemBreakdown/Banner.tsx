import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
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
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className='w-auto h-auto mr-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div
            className={``}>
            {typeof title !== 'undefined' ? title : 'Your Poem Title :)'}
          </div>
        </div>
      ) : display === 'COOP' ? (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className='w-auto h-auto mr-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div
            className={``}>
            {typeof title !== 'undefined' ? title : 'Your Poem Title :)'}
          </div>
        </div>
      ) : (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className='w-auto h-auto mr-2'>
              <FaPenFancy />
            </div>
          </IconContext.Provider>
          <div className={``}>
            {typeof title !== 'undefined' ? title : 'Your Poem Title :)'}
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
