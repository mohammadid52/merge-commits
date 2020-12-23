import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { FaHeadphonesAlt } from 'react-icons/fa';

interface BannerProps {
  title?: string;
  artist?: string;
}

const Banner = (props: BannerProps) => {
  const { theme } = useContext(LessonContext);
  const { title, artist } = props;

  return (
    <div className={`w-full text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <FaHeadphonesAlt />
        </div>
      </IconContext.Provider>
        {title}
      </div>
  );
};

export default Banner;
