import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaListAlt } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface BannerProps {
  title?: string;
  display: string;
  fullscreen: boolean;
}

const Banner = (props: BannerProps) => {
  const { theme } = useContext(LessonContext);
  const { title, display, fullscreen } = props;

  return (
    <>
      {display === 'SELF' ? (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className='w-auto h-auto mr-2'>
              <FaListAlt />
            </div>
          </IconContext.Provider>
          <div
            className={``}>
            {title !== null ? title : 'No title...'}
          </div>
        </div>
      ) : display === 'COOP' ? (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className='w-auto h-auto mr-2'>
              <FaListAlt />
            </div>
          </IconContext.Provider>
          <div
            className={``}>
            {title !== null ? title : 'No title...'}
          </div>
        </div>
      ) : (
            <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
              <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                <div className='w-auto h-auto mr-2'>
                  <FaListAlt />
                </div>
              </IconContext.Provider>
              <div
                className={``}>
                {title !== null ? title : 'No title...'}
              </div>
            </div>
          )}
    </>
  );
};

export default Banner;
