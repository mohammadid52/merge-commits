import React, { useContext, ReactNode, ReactElement, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import {
  FaHourglassStart,
  FaPencilRuler,
  FaTrophy,
  FaScroll,
  FaMusic,
  FaPenFancy,
  FaQuestion,
  FaMap,
  FaCheck,
  FaHeadphonesAlt,
  FaListAlt
} from 'react-icons/fa';
import {
  AiOutlineCustomerService
} from 'react-icons/ai';
import FooterLabels from '../../../General/LabelSwitch';

interface StageIconProps {
  isHovered: boolean;
  iconID: string | number;
  stage: string;
  type: string;
  active: boolean;
  open: boolean;
  disabled: boolean;
}

const StageIcon = (props: StageIconProps) => {
  const { isHovered, iconID, stage, type, active, disabled, open } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const match = useRouteMatch();
  const history = useHistory();

  const iconSwitch = (type: string): ReactNode => {
    switch (type) {
      case 'intro':
        return <FaHourglassStart />;
      case 'map-game':
        return <FaMap />;
      case 'story':
        return <FaScroll />;
      case 'lyrics':
        return <FaHeadphonesAlt />;
      case 'poem':
        return <FaPenFancy />;
      case 'breakdown':
        return <FaQuestion />;
      case 'outro':
        return <FaTrophy />;
      case 'survey':
        return <FaCheck />;
      case 'profile':
        return <FaCheck />;
      case 'list':
        return <FaListAlt />
      default:
        return <FaPencilRuler />;
    }
  };

  /**
   * Micro component for the icon labels
   * @param centerFix - Additional TRUE | FALSE for if the label doesn't center correctly
   */
  const iconLabel = (centerFix: 'center' | 'noCenter'): ReactElement => {
    return (
      <div
        className={`
        absolute transform translate-y-12 text-center z-50 w-24 transition-all duration-500 ease-in-out
        ${theme.elem.text}
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        ${centerFix === 'center' && 'left-1/2 -translate-x-1/2'} 
        ${centerFix === 'noCenter' && '-translate-x-1/2'} 
        ${state.currentPage === iconID ? 'text-opacity-100' : ''}
        ${state.currentPage !== iconID ? 'text-opacity-50' : ''}
        `}>
        {
          /* Capitalize the first letter */
          <FooterLabels label={props.type.charAt(0).toUpperCase() + props.type.slice(1)} />
        }
      </div>
    );
  };

  const handleLink = () => {
    if (active) {
      let pageNumber = null;
      state.pages.map((page: { stage: string }, key: any) => {
        if (page.stage === stage) {
          pageNumber = key;
        }
      });

      dispatch({ type: 'SET_PAGE', payload: pageNumber });

      history.push(`${match.url}${stage !== '' ? `/${stage}` : ''}`);
    }
  };

  const iconColor = open || active ? '#EDF2F7' : ' gray';
  const iconBackgroundColor = active ? '#38A169' : open || active ? '#cbd5e0' : '#54575c';
  const iconBorder = open || active ? '#cbd5e0' : '#54575c';

  if (disabled) return null;

  if (type === 'breakdown') {
    return (
      <>
        <div
          className='relative h-8 w-8 flex justify-center items-center rounded-full z-50'
          onClick={handleLink}>
          <IconContext.Provider value={{ color: iconColor}}>
            <div
              className={`${
                active ? 'bg-blueberry' : 'bg-darker-gray'
              } h-6 w-6 flex justify-center items-center rounded-full z-30`}
              >
              {iconSwitch(type)}
            </div>
            {/* ICON LABEL */}
            {iconLabel('center')}
            {/* ICON LABEL - END */}
          </IconContext.Provider>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`flex-grow-0 w-auto flex flex-row justify-around items-center z-50`}>
        <div
          className={`relative h-8 w-8 rounded-full flex items-center justify-center ${
            active ? 'cursor-pointer' : 'cursor-default'
          }`}
          onClick={handleLink}>
          <IconContext.Provider value={{ color: iconColor, size: '0.9rem' }}>
            <div
              className={`h-8 w-8 rounded-full flex flex-col justify-center items-center 
              ${active ? 'bg-blueberry' : 'bg-darker-gray'} z-30`}>
              {iconSwitch(type)}
            </div>
          </IconContext.Provider>

          {/* ICON LABEL */}
          {iconLabel('center')}
          {/* ICON LABEL - END */}
        </div>
      </div>
    </>
  );
};

export default StageIcon;
