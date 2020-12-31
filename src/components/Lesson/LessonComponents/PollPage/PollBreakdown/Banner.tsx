import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPoll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
  isTeacher?: boolean;
  title?: string;
  display: string;
}

const Banner = (props: BannerProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, title, display } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;

  return (
    <>
      {display === 'SELF' ? (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className="w-auto h-auto mr-2">
              <FaPoll />
            </div>
          </IconContext.Provider>
          <div>{title}</div>
        </div>
      ) : display === 'COOP' ? (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className="w-auto h-auto mr-2">
              <FaPoll />
            </div>
          </IconContext.Provider>
          <div>{title}</div>
        </div>
      ) : (
        <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
          <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
            <div className="w-auto h-auto mr-2">
              <FaPoll />
            </div>
          </IconContext.Provider>
          <div>{title}</div>
        </div>
      )}
    </>
  );
};

export default Banner;
