import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { AiOutlineCustomerService } from 'react-icons/ai';

interface BannerProps {
  title?: string;
  artist?: string;
}

const Banner = (props: BannerProps) => {
  const { theme } = useContext(LessonContext);
  const { title, artist } = props;

  return (
    <div className={`w-full h-1/10 text-2xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className='w-auto h-auto mr-2'>
          <AiOutlineCustomerService />
        </div>
      </IconContext.Provider>
        {title}
      </div>
  );
};

export default Banner;
