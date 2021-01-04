import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPoll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
  isTeacher?: boolean
}

const Banner = (props: BannerProps) => {
  /**
   * Teacher switch
   */
  const {isTeacher} = props;

  const switchContext = (isTeacher) ? useContext(LessonControlContext) : useContext(LessonContext);

  const { state, theme } = switchContext;

  const title = state.data.lesson.warmUp.title;

  return (
    <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className="w-auto h-auto mr-2">
          <FaPoll />
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
