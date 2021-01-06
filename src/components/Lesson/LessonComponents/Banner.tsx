import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

/**
 * ICON IMPORTS FROM react-icons
 */
import { FaPoll, FaCheck, FaQuestion } from 'react-icons/fa';

interface BannerProps {
  isTeacher?: boolean
  title?: string;
  iconName: string;
}

const Banner = (props: BannerProps) => {
  /**
   * Teacher switch
   */
  const {isTeacher, title, iconName} = props;
  const switchContext = (isTeacher) ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;

  /**
   * Icon Switch
   * - Simple function for returning different icon based on input iconName string
   */
  const switchIcon = (nameString: string) => {
    switch (nameString) {
      case 'FaPoll':
        return <FaPoll/>;
        break;
      case 'FaCheck':
        return <FaCheck/>
        break;
      default:
        return <FaQuestion/>
    }
  }

  return (
    <div className={`w-full h-1/10 text-4xl ${theme.banner}`}>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
        <div className="w-auto h-auto mr-2">
          {switchIcon(iconName)}
        </div>
      </IconContext.Provider>
      {title}
    </div>
  );
};

export default Banner;
