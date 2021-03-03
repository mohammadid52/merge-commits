import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

/**
 * ICON IMPORTS FROM react-icons
 */
import { FaPoll, FaCheck, FaQuestion, FaHourglassStart } from 'react-icons/fa';

interface BannerProps {
  isTeacher?: boolean
  title?: string;
  titleSection?: string;
  subtitleSection?: string;
  subtitle?: string;
  titleParagraph?: string;
  iconName?: string;
}

const Banner = (props: BannerProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, title, titleSection, subtitleSection, subtitle, titleParagraph, iconName } = props;
  const switchContext = (isTeacher) ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;

  /**
   * Icon Switch
   * - Simple function for returning different icon based on input iconName string
   */
  const switchIcon = (nameString: string) => {
    switch (nameString) {
      case 'FaHourglassStart':
        return <FaHourglassStart />;
      case 'FaPoll':
        return <FaPoll/>;
      case 'FaCheck':
        return <FaCheck/>
      default:
        return <FaQuestion/>
    }
  }

  return (
    <>
      {
        title && (
          <div className={`w-full text-4xl ${theme.banner}`}>
            {
              iconName && (
                <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                  <div className='w-8 h-auto ml-0 mr-2'>
                    {switchIcon(iconName)}
                  </div>
                </IconContext.Provider>
              )
            }
            <h1 dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        )
      }

      {
        titleSection && (
          <h3 className={`w-full text-2xl ${theme.banner} font-semibold`}>
            <span dangerouslySetInnerHTML={{ __html: titleSection }} />
          </h3>
        )
      }

      {
        subtitleSection && (
          <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
            <span dangerouslySetInnerHTML={{ __html: subtitleSection }} />
          </h3>
        )
      }

      {
        subtitle && (
          <h4 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
            <span dangerouslySetInnerHTML={{ __html: subtitle }} />
          </h4>
        )
      }
    </>
  );
};

export default Banner;
