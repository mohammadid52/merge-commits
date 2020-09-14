import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { FaMusic } from 'react-icons/fa';

interface BannerProps {
  title?: string;
  artist?: string;
}

const Banner = (props: BannerProps) => {
  const { theme } = useContext(LessonContext);
  const { title, artist } = props;

  return (
    <div className='w-full h-1/10 flex flex-row justify-center items-center'>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem' }}>
        <div className='red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'>
          <FaMusic />
        </div>
      </IconContext.Provider>
      <div className={`h-full ${theme.banner}  text-xl md:text-5xl z-10`}>
        {title}
      </div>
    </div>
  );
};

export default Banner;
