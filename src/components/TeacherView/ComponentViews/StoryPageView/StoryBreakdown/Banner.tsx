import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaScroll } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
  dataProps?: {
    title?: string;
    story?: string[];
    additional?: [
      {
        name: string;
        input: string;
      }
    ];
  };
  fullscreen: boolean;
}

const Banner = (props: BannerProps) => {
  const { dataProps, fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);

  return (
    <div className={`w-full h-1/10 text-2xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className="w-auto h-auto mr-2">
          <FaScroll />
        </div>
      </IconContext.Provider>

      <div className={``}>{dataProps && dataProps.title ? dataProps.title : ''}</div>
    </div>
  );
};

export default Banner;
