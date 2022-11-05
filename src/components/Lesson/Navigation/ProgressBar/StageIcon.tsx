import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from 'contexts/GlobalContext';
import usePrevious from 'customHooks/previousProps';
import {UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import {useQuery} from '@customHooks/urlParam';

interface StageIconProps extends UniversalLessonPage {
  pageNr?: number;
  clickable: boolean;
  hidden?: boolean;
  userAtEnd?: boolean;
  isShared?: boolean;
  handleRequiredNotification?: () => void;
}

const StageIcon = ({
  pageNr,
  enabled,
  open,
  active,
  label,
  clickable,
  hidden,
  handleRequiredNotification
}: StageIconProps) => {
  const history = useHistory();
  const match = useRouteMatch();

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch; //
  const previousProps = usePrevious(open);
  const PAGES = lessonState.lessonData.lessonPlan;
  const lessonProgress = lessonState.lessonProgress;
  // ~~~~~~~~~~~~~~ STATE ETC ~~~~~~~~~~~~~~ //
  const [recentOpened, setRecentOpened] = useState<boolean>(false);

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

  const scrollUp = () => {
    const domID = {
      lesson: 'lesson-app-container',
      survey: 'survey-app-container'
    } as any;
    const container = document.getElementById(domID[lessonState.lessonData.type]);

    if (container) {
      container.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const params = useQuery(location.search);

  const handleLink = () => {
    scrollUp();
    const sId = params.get('sId');
    const sEmail = params.get('sId');

    const dynamicQuery = sId && sEmail ? `?sId=${sId}&sEmail=${sEmail}` : '';
    history.push(`${match.url}/${pageNr}${dynamicQuery}`);

    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});
  };

  const clickedLesson = active
    ? 'font-bold border-b-0 border-indigo-400 text-indigo-200 hover:text-indigo-300'
    : lessonProgress >= pageNr
    ? 'text-gray-700'
    : '';

  const stageButtonChoice = () => {
    if (pageNr === 0) {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => {}}
          className={`${recentOpened ? 'animate-activation' : ''} 
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group `}>
          <a
            className={`
            ${clickedLesson}
          
            xs:ml-0 sm:ml-0 ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150
            flex flex-row`}>
            <p className="flex-shrink-0">{label}</p>
          </a>
        </div>
      );
    } else if (pageNr < PAGES.length - 1) {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => handleRequiredNotification()}
          className={`${recentOpened ? 'animate-activation' : ''} 
          
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group`}>
          {breakpoint !== 'xs' && breakpoint !== 'sm' && (
            <svg
              className={`flex-shrink-0 w-6 h-full text-gray-200 group-hover:text-gray-300 transition-all duration-150    `}
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          )}

          <a
            className={`
            ${clickedLesson}
            ${
              !enabled || !open ? 'line-through text-gray-500 hover:underline' : null
            }            
            ${!active ? 'text-gray-500 ' : null}
         
            ${
              breakpoint !== 'xs' && breakpoint !== 'sm' ? 'ml-4' : ''
            } cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150
            flex flex-row`}>
            <p className="flex-shrink-0">{label}</p>
          </a>
        </div>
      );
    } else {
      return (
        <div
          onClick={clickable ? () => handleLink() : () => handleRequiredNotification()}
          className={`${recentOpened ? 'animate-activation' : ''} 
          
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          flex items-center w-auto group`}>
          {breakpoint !== 'xs' && breakpoint !== 'sm' && (
            <svg
              className={`flex-shrink-0 w-6 h-full text-gray-200 group-hover:text-gray-300 transition-all duration-150    ${
                lessonProgress > pageNr ? 'text-gray-700' : ''
              } `}
              viewBox="0 0 24 44"
              preserveAspectRatio="none"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
            </svg>
          )}

          <a
            className={`
            ${clickedLesson}
            ${!enabled || !open ? 'line-through text-gray-500 hover:underline' : null}
            ${!active ? 'text-gray-500 ' : null}
          
            ${
              breakpoint !== 'xs' && breakpoint !== 'sm' ? 'ml-4' : ''
            } cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150
            flex flex-row`}>
            <p className="flex-shrink-0">{label}</p>
          </a>
        </div>
      );
    }
  };

  return (
    <li className={`${hidden ? 'hidden' : ''} relative flex w-auto`}>
      {<>{stageButtonChoice()}</>}
    </li>
  );
};

export default StageIcon;
