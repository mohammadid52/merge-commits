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
} from 'react-icons/fa';
import FooterLabels from '../../../General/LabelSwitch';

interface StageIconProps {
  iconID: string | number;
  stage: string;
  type: string;
  active: boolean;
  open: boolean;
  disabled: boolean;
}

const StageIcon = (props: StageIconProps) => {
  const { iconID, stage, type, active, disabled, open } = props;
  const { state, dispatch } = useContext(LessonContext);
  const match = useRouteMatch();
  const history = useHistory();

    const iconSwitch = (type: string): ReactNode => {
        switch(type) {
            case 'intro':
                return <FaHourglassStart />
            case 'map-game':
                return <FaMap />
            case 'story':
                return <FaScroll />
            case 'lyrics':
                return <FaMusic />
            case 'poem':
                return <FaPenFancy />
            case 'breakdown':
                return <FaQuestion />
            case 'outro':
                return <FaTrophy />
            case 'survey':
                return <FaCheck />
            case 'profile':
                return <FaCheck />
            default:
                return <FaPencilRuler />
        }
    }

  /**
   * Micro component for the icon labels
   * @param centerFix - Additional TRUE | FALSE for if the label doesn't center correctly
   */
  const iconLabel = (centerFix: 'center' | 'noCenter'): ReactElement => {
    return (
      <div
        className={`absolute transform translate-y-8 text-center z-50 font-light text-blue-100 w-24 mt-1
        ${centerFix === 'center' && 'left-1/2 -translate-x-1/2'} 
        ${centerFix === 'noCenter' && '-translate-x-1/2'} 
        ${state.currentPage === iconID ? 'text-opacity-75' : ''}
        ${state.currentPage !== iconID ? 'text-opacity-20' : ''}
        `}>
        {
            /* Capitalize the first letter */
            <FooterLabels label=
            {props.type.charAt(0).toUpperCase()+props.type.slice(1)} />
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
  const iconBorder =  open || active ? '#cbd5e0' : '#54575c';
  


  
  if (disabled) return null;

  if (type === 'breakdown') {
    return (
      <>
        <div
          className='relative h-10 w-10 flex justify-center items-center rounded-full z-20'
          onClick={handleLink} style={{backgroundColor: iconBorder}}>
          <IconContext.Provider value={{ color: iconColor, size: '1rem' }}>
            <div
              className={`${
                active ? 'bg-green-600' : 'bg-gray-400'
              } h-8 w-8 flex justify-center items-center rounded-full z-30`} style={{backgroundColor: iconBackgroundColor}}>
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
      <div
        className={`flex-grow-0 w-auto flex flex-row justify-around items-center z-20`}>
        <div
          className={`relative bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center ${
            active ? 'cursor-pointer' : 'cursor-default'
          }`} style={{backgroundColor: iconBorder}}
          onClick={handleLink}>
          <IconContext.Provider value={{ color: iconColor, size: '1.5rem' }}>
            <div
              className={`h-10 w-10 rounded-full flex flex-col justify-center items-center 
              ${active ? 'bg-green-600' : 'bg-gray-400'} z-30`} style={{backgroundColor: iconBackgroundColor}}>
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
