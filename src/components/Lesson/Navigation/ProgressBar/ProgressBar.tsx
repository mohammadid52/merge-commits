import {GlobalContext} from 'contexts/GlobalContext';
import useLessonControls from 'customHooks/lessonControls';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {getLocalStorageData} from 'utilities/localStorage';
import React, {useContext, useEffect} from 'react';
import {AiOutlineHome} from 'react-icons/ai';
import {useRouteMatch} from 'react-router';
import {UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import StageIcon from './StageIcon';

interface IProgressBarProps {
  handleHome?: () => void;
  updatePageInLocalStorage?: (pageIdx: number) => void;
  validateRequired?: (pageIdx: number) => boolean;
  handleRequiredNotification?: () => void;
  pages?: any[];
  currentPage?: number;
  studentData?: any[];
  requiredInputs?: any[];
  canContinue?: boolean;
}

const Disabled = ({text}: {text: string}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 disabled z-50">
      <p className="text-center font-bold text-sm">text</p>
    </div>
  );
};

const ProgressBar = ({
  handleHome,
  handleRequiredNotification,
  pages,
  currentPage,
  updatePageInLocalStorage,
  validateRequired,
  canContinue
}: IProgressBarProps) => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;

  const user = gContext.state.user;

  const getRoomData = getLocalStorageData('room_info');

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  /************************************************
   * THIS CAN PROBABLY BE REFACTORED SO THAT ONLY *
   *  THE CODE FROM THE ELSE - IF AFTER LINE 58   *
   *     IS USED FOR CHECKING REQUIRED FIELDS     *
   ************************************************/

  const nextRequiredIdx = pages
    ? pages.reduce((nextIdx: number, _: any, currIdx: number) => {
        if (nextIdx === null) {
          if (validateRequired(currIdx)) {
            return nextIdx;
          } else {
            return currIdx;
          }
        } else {
          return nextIdx;
        }
      }, null)
    : null;

  const miniPageCounter = (pageIdx: number, pageArray: any[]) => {
    if (typeof pageIdx === 'number' && Array.isArray(pageArray)) {
      return (
        <li className="w-auto text-sm font-medium">
          {pageIdx + 1}/{pageArray.length}
        </li>
      );
    }
  };

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   */
  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  // ~~~~~~~~~~~~ SHARING CHECK ~~~~~~~~~~~~ //
  const isOnDemand = user.onDemand;
  const isTeacherPresenting = lessonState.displayData[0].isTeacher === true;

  const router: any = useRouteMatch();
  const lessonId = router.params.lessonID || '999';

  const isClosedLocalStorage =
    getRoomData?.completedLessons?.findIndex(
      (item: {lessonID?: string | null; time?: string | null}) =>
        item.lessonID === lessonId
    ) > -1;

  const isClosed = lessonState?.displayData[0]?.studentAuthID === 'closed';

  const {resetViewAndShare} = useLessonControls();

  const reset = async () => {
    await resetViewAndShare();
  };

  useEffect(() => {
    // reset displayData
    if (!isClosedLocalStorage && isClosed) {
      reset();
    }
  }, [isClosed, isClosedLocalStorage]);

  return (
    <nav
      className="h-12 flex bg-gray-600 bg-opacity-20 border-0 border-gray-100 border-opacity-20 rounded-lg"
      aria-label="Breadcrumb">
      {isTeacherPresenting && !isOnDemand && (
        <Disabled text={'Disabled when teacher is presenting!'} />
      )}
      {isClosed && isClosedLocalStorage && (
        <Disabled text={'Disabled when lesson/survey is closed'} />
      )}
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4  items-center justify-center sm:px-6 lg:px-8">
        {/* 1 */}
        {pages &&
          pages.map((page: UniversalLessonPage, key: number) => {
            let shouldHide =
              (breakpoint === 'xs' || breakpoint === 'sm') &&
              key !== lessonState.currentPage;
            return (
              <StageIcon
                key={`${page.id}_progressIcon`}
                pageNr={key}
                updatePageInLocalStorage={updatePageInLocalStorage}
                id={page.id}
                enabled={page.disabled !== true || isOnDemand}
                open={page.open !== false || isOnDemand}
                active={key === currentPage}
                label={page.label}
                canContinue={canContinue}
                handleRequiredNotification={handleRequiredNotification}
                clickable={
                  key === 0 ||
                  isOnDemand ||
                  ((nextRequiredIdx !== null ? key <= nextRequiredIdx : true) &&
                    page.open !== false)
                }
                hidden={shouldHide}
              />
            );
          })}
        {/* 2 */}
        {(breakpoint === 'xs' || breakpoint === 'sm') &&
          miniPageCounter(lessonState?.currentPage, pages)}
        {/* 3 */}
        {breakpoint !== 'xs' && breakpoint !== 'sm' && (
          <li className="flex w-auto">
            <div onClick={handleHome} className="flex items-center w-auto group">
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
                // href="#"
                className="flex flex-row text-red-500 cursor-pointer transform hover:scale-110 transition-transform duration-150   ml-4">
                <span className="">Exit</span>
                <AiOutlineHome
                  className="flex-shrink-0 h-5 w-5 ml-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default React.memo(ProgressBar);
