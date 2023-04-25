import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface StageButtonProps {
  iconID?: number;
  active?: boolean;
  open?: boolean;
  disabled?: boolean;
  label?: string | null;
  id?: string | null;
  breakdown?: boolean;
  menuOpen?: boolean;
  handleOpenMenu?: (stage: string) => void;
  handlePageChange?: any;
  counter?: number;
  page?: UniversalLessonPage;
}

const StageButton = (props: StageButtonProps) => {
  const {
    iconID = 0,

    handlePageChange,

    page
  } = props;
  const {lessonState} = useGlobalContext();

  const match = useRouteMatch();
  const history = useHistory();

  const PAGES = lessonState.lessonData.lessonPlan;

  const stageIsViewed = lessonState.currentPage === iconID;
  const stageIsDisabled = PAGES[iconID].disabled === true;
  const stageIsClosed = PAGES[iconID].open === false;

  const handleView = () => {
    /**
     *
     * SET CURRENT VIEWED PAGE FOR
     * USE IN studentWindowTitleBar
     *
     **/

    handlePageChange(iconID);

    return history.push(`${match.url}/${iconID}`);
  };

  const stageButtonChoice = () => {
    if (iconID === 0) {
      return (
        <div className="flex items-center w-auto group">
          <svg
            className="flex-shrink-0 w-6 h-full text-lightest  group-hover:text-light  transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            href={page?.href}
            className={` ${
              stageIsViewed && !stageIsClosed && !stageIsDisabled
                ? 'border-b-0 border-indigo-400 text-indigo-600 hover:text-indigo-700'
                : null
            }    ${stageIsDisabled ? null : 'text-medium  '}
      ml-4 cursor-pointer w-auto text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {page?.label}
          </a>
        </div>
      );
    } else if (iconID < PAGES.length - 1) {
      return (
        <div className="flex items-center w-auto group">
          <svg
            className="flex-shrink-0 w-6 h-full text-lightest  group-hover:text-light  transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            href={page?.href}
            className={`${
              stageIsDisabled || stageIsClosed ? 'line-through text-medium ' : null
            }
      
      ${stageIsClosed ? 'hover:underline' : null}
      ${stageIsViewed && stageIsClosed ? 'font-bold underline' : null}
      ${!stageIsClosed && !stageIsDisabled ? 'text-medium  ' : null}
      ${
        stageIsViewed && !stageIsClosed && !stageIsDisabled
          ? 'border-b-0 border-indigo-400 text-indigo-600 hover:text-indigo-700'
          : null
      }
      ml-4 cursor-pointer w-auto text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {page?.label}
          </a>
        </div>
      );
    } else {
      return (
        <div className="flex items-center w-auto group">
          <svg
            className="flex-shrink-0 w-6 h-full text-lightest  group-hover:text-light  transition-all duration-150 "
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>

          <a
            href={page?.href}
            className={`${
              stageIsViewed && !stageIsClosed && !stageIsDisabled
                ? 'border-b-0 border-indigo-400 text-indigo-600 hover:text-indigo-700'
                : null
            } ${
              stageIsDisabled || stageIsClosed
                ? 'line-through text-medium '
                : 'text-medium '
            } ml-4 cursor-pointer w-auto text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
            {page?.label}
          </a>
        </div>
      );
    }
  };

  return (
    <li
      onClick={() => {
        handleView();
      }}
      className="relative flex w-auto">
      {stageButtonChoice()}
    </li>
  );
};

export default StageButton;
