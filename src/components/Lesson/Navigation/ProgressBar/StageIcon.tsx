import {useQuery} from '@customHooks/urlParam';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {useGlobalContext} from 'contexts/GlobalContext';
import usePrevious from 'customHooks/previousProps';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';

import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface StageIconProps extends UniversalLessonPage {
  pageNr?: number;
  enabled?: boolean;
  clickable: boolean;
  hidden?: boolean;
  userAtEnd?: boolean;
  isShared?: boolean;
  canContinue?: boolean;
  handleRequiredNotification?: () => void;
  updatePageInLocalStorage?: (pageNr: number) => void;
}

const StageIcon = ({
  pageNr = 0,
  enabled,
  open,
  active,
  canContinue,
  label,
  clickable,
  hidden,
  handleRequiredNotification,
  updatePageInLocalStorage
}: StageIconProps) => {
  const history = useHistory();
  const match = useRouteMatch();

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
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
      if (wasClosed) {
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
    const isNotMovingForward = pageNr < lessonProgress;
    if (canContinue || isNotMovingForward) {
      scrollUp();
      const sId = params.get('sId');
      const sEmail = params.get('sId');

      const dynamicQuery = sId && sEmail ? `?sId=${sId}&sEmail=${sEmail}` : '';
      history.push(`${match.url}/${pageNr}${dynamicQuery}`);

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});

      updatePageInLocalStorage?.(pageNr);
    } else {
      handleRequiredNotification && handleRequiredNotification();
    }
  };

  const clickedLesson = active
    ? 'font-bold border-b-0 border-indigo-400 text-indigo-200 hover:text-indigo-300'
    : lessonProgress >= pageNr
    ? 'text-gray-700'
    : '';

  const Button = ({showArrow, last}: {showArrow?: boolean; last?: boolean}) => {
    return (
      <div
        onClick={clickable ? () => handleLink() : () => handleRequiredNotification?.()}
        className={`${recentOpened ? 'animate-activation' : ''} 
        
        ${clickable ? 'cursor-pointer' : 'cursor-default'}
        flex items-center w-auto group`}>
        {showArrow && breakpoint !== 'xs' && breakpoint !== 'sm' && (
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
          data-cy={last ? 'last-button-on-progress-bar' : ''}
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
  };

  const stageButtonChoice = () => {
    if (pageNr === 0) {
      return <Button />;
    } else if (pageNr < PAGES.length - 1) {
      return <Button showArrow />;
    } else {
      return <Button showArrow last />;
    }
  };

  return (
    <li className={`${hidden ? 'hidden' : ''} relative flex w-auto`}>
      {<>{stageButtonChoice()}</>}
    </li>
  );
};

export default StageIcon;
