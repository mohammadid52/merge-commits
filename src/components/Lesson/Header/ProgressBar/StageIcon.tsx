import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import usePrevious from '../../../../customHooks/previousProps';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import {
  FaCheck,
  FaHeadphonesAlt,
  FaHourglassStart,
  FaListAlt,
  FaMap,
  FaPencilRuler,
  FaPenFancy,
  FaQuestion,
  FaScroll,
  FaTrophy,
} from 'react-icons/fa';
import StageLabels from '../../../General/LabelSwitch';

interface StageIconProps {
  iconID: string | number;
  stage: string;
  type: string;
  active: boolean;
  open: boolean;
  disabled: boolean;
  counter?: number;
  clickable: boolean;
}

const StageIcon = (props: StageIconProps) => {
  const { iconID, stage, type, active, disabled, open, counter, clickable } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const previousProps = usePrevious(open);
  const [recentOpened, setRecentOpened] = useState<boolean>(false);
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    const wasClosed = previousProps === false;
    if (open) {
      if (wasClosed && open) {
        setRecentOpened(true);
        setTimeout(() => {
          setRecentOpened(false);
        }, 2000);
      }
    }
  }, [open]);

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
        return <FaListAlt />;
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
        absolute transform translate-y-12 text-center z-50 w-20 flex flex-row
        ${theme.elem.text}
        ${centerFix === 'center' && 'left-1/2 -translate-x-1/2'} 
        ${centerFix === 'noCenter' && '-translate-x-1/2'} 
        ${state.currentPage === iconID ? 'text-opacity-100' : ''}
        ${state.currentPage !== iconID ? 'text-opacity-50' : ''}
        `}>
        <StageLabels label={props.stage.charAt(0).toUpperCase() + props.stage.slice(1)} counter={counter} />
      </div>
    );
  };

  /**
   *
   *
   * FIX: to make the icons clickable again, they shouldn't be disabled or closed
   *
   * -every component up until the first closed component should be clickable
   * -every component up until the first breakdown should be clickable
   * - as soon as one breakdown is active, everything after BUT before the next breakdown/closed component will be clickable
   *
   *
   */

  /*const clickable = !disabled && open;*/

  const handleLink = () => {
    if (!clickable) {
      return;
    }

    history.push(`${match.url}/${state.pages[iconID].stage}`);
    // dispatch({type: 'PAGE_FORWARD'});
    dispatch({ type: 'JUMP_PAGE', payload: props.iconID });
  };

  const iconColor = () => {
    if (open && active) {
      return 'EDF2F7';
    }

    if (open && !active) {
      return '4DEDF2F7';
    }

    if (!open && !active) {
      return '4DEDF2F7';
    }
  };

  if (disabled) return null;

  if (type === 'breakdown') {
    return (
      <>
        <div
          className={`relative h-8 w-8 origin-center flex justify-center items-center rounded-full z-50
          ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleLink}>
          <IconContext.Provider value={{ color: iconColor() }}>
            <div
              className={`h-8 w-8 origin-center rounded-full bg-black
                            
                        `}>
              <div
                className={` 
                                ${recentOpened ? 'animate-activation' : ''}
                                ${!open ? 'opacity-60 border border-white border-opacity-20' : ''}
                                ${open || active || iconID <= state.currentPage ? 'bg-blueberry' : ''} 
                                ${
                                  open && !active ? 'bg-darker-gray' : ''
                                } h-8 w-8 flex justify-center items-center rounded-full z-30`}>
                {iconSwitch(type)}
              </div>
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
          className={`relative h-8 w-8 origin-center rounded-full flex items-center justify-center 
                    ${clickable ? 'cursor-pointer' : 'cursor-default'}
                    ${recentOpened ? 'animate-activation' : ''}`}
          onClick={handleLink}>
          <IconContext.Provider value={{ color: iconColor(), size: '0.9rem' }}>
            <div
              className={`h-8 w-8 origin-center rounded-full bg-black
                            
                        `}>
              <div
                className={` 
                                ${recentOpened ? 'animate-activation' : ''}
                                ${!open ? 'opacity-60 border border-white border-opacity-20' : ''}
                                ${open || active || iconID <= state.currentPage ? 'bg-blueberry' : ''} 
                                ${
                                  open && !active ? 'bg-darker-gray' : ''
                                } h-8 w-8 flex justify-center items-center rounded-full z-30`}>
                {iconSwitch(type)}
              </div>
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
