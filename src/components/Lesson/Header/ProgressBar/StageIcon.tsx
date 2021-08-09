import React, {ReactElement, ReactNode, useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import usePrevious from '../../../../customHooks/previousProps';
import {IconContext} from 'react-icons/lib/esm/iconContext';
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
import {AiOutlineHome} from 'react-icons/ai';
import StageLabels from '../../../General/LabelSwitch';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../../interfaces/UniversalLessonInterfaces';

interface StageIconProps extends UniversalLessonPage {
  pageNr?: number;
  clickable: boolean;
  userAtEnd?: boolean;
}

const StageIcon = (props: StageIconProps) => {
  const {pageNr, id, enabled, open, active, label, clickable} = props;
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
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
      case 'home':
        return <AiOutlineHome />;
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
        ${state.currentPage === id ? 'text-opacity-100' : ''}
        ${state.currentPage !== id ? 'text-opacity-50' : ''}
        `}>
        <StageLabels label={label} />
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

  const handleLink = () => {
    if (clickable) {
      // history.push(`${match.url}/${pageNr}`);
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});
    }
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

  if (!enabled) return null;

  return (
    <>
      <div
        className={`flex-grow-0 w-auto flex flex-row justify-around items-center z-50`}>
        <div
          className={`relative h-8 w-8 origin-center rounded-full flex items-center justify-center 
                    ${clickable ? 'cursor-pointer' : 'cursor-default'}
                    ${recentOpened ? 'animate-activation' : ''}`}
          onClick={clickable ? () => handleLink() : () => {}}>
          <IconContext.Provider value={{color: iconColor(), size: '0.9rem'}}>
            <div
              className={`h-8 w-8 origin-center rounded-full bg-black
                            
                        `}>
              <div
                className={` 
                                ${recentOpened ? 'animate-activation' : ''}
                                ${
                                  !open
                                    ? 'opacity-60  border-0 border-white border-opacity-20'
                                    : ''
                                }
                                ${
                                  open || active || id <= lessonState.currentPage
                                    ? 'bg-blueberry'
                                    : ''
                                } 
                                ${
                                  open && !active ? 'bg-darker-gray' : ''
                                } h-8 w-8 flex justify-center items-center rounded-full z-30`}>
                {iconSwitch(id)}
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
