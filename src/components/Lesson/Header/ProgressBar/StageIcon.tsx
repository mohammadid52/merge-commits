import React, {useContext, useEffect, useState} from 'react';
import usePrevious from '../../../../customHooks/previousProps';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../../interfaces/UniversalLessonInterfaces';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface StageIconProps extends UniversalLessonPage {
  pageNr?: number;
  clickable: boolean;
  userAtEnd?: boolean;
}

const StageIcon = (props: StageIconProps) => {
  const {pageNr, enabled, open, active, label, clickable} = props;
  const {lessonState, lessonDispatch} = useContext(GlobalContext);
  const previousProps = usePrevious(open);
  const [recentOpened, setRecentOpened] = useState<boolean>(false);
  const history = useHistory();
  const match = useRouteMatch();

  const PAGES = lessonState.lessonData.lessonPlan;

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
    history.push(`${match.url}/${pageNr}`);
    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});
  };

  const stageButtonChoice = () => {
    if (pageNr === 0) {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => {}}
          className={`${recentOpened ? 'animate-activation' : ''} 
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group`}>
          <svg
            className="flex-shrink-0 w-6 h-full text-gray-300 group-hover:text-gray-400 transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            // href={page.href}

            className={`  ${
              active && open && enabled
                ? 'border-b-0 border-indigo-400 text-indigo-200 hover:text-indigo-300'
                : null
            }        ${!enabled ? null : 'text-gray-500 '}
            ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {label}
          </a>
        </div>
      );
    } else if (pageNr < PAGES.length - 1) {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => {}}
          className={`${recentOpened ? 'animate-activation' : ''} 
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group`}>
          <svg
            className="flex-shrink-0 w-6 h-full text-gray-300 group-hover:text-gray-400 transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            // href={page.href}
            className={`${!enabled || !open ? 'line-through text-gray-500' : null}
            
            ${!open ? 'hover:underline' : null}
            ${active && !open ? 'font-bold underline' : null}
            ${open && enabled ? 'text-gray-500 ' : null}
            ${
              active && open && enabled
                ? 'border-b-0 border-indigo-400 text-indigo-200 hover:text-indigo-300'
                : null
            }
            ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {label}
          </a>
        </div>
      );
    } else {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => {}}
          className={`${recentOpened ? 'animate-activation' : ''} 
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group`}>
          <svg
            className="flex-shrink-0 w-6 h-full text-gray-200 group-hover:text-gray-300 transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            // href={page.href}
            className={`${
              active && open && enabled
                ? 'border-b-0 border-indigo-400 text-indigo-200 hover:text-indigo-300'
                : null
            } ${!enabled || !open ? 'line-through text-gray-500' : 'text-gray-500'}
            ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {label}
          </a>
        </div>
      );
    }
  };

  return <li className="relative flex w-auto">{stageButtonChoice()}</li>;
};

export default StageIcon;
