import React from 'react';
import StageIcon from './StageIcon';
import {
  StudentPageInput,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {AiOutlineHome} from 'react-icons/ai';

interface IProgressBarProps {
  handleHome?: () => void;
  handleRequiredNotification?: () => void;
  pages?: any[];
  currentPage?: number;
  studentData?: any[];
  requiredInputs?: any[];
}

const ProgressBar = ({
  handleHome,
  handleRequiredNotification,
  pages,
  currentPage,
  studentData,
  requiredInputs,
}: IProgressBarProps) => {
  // ~~~~~~~~~ WHICH PAGE IS SHAred ~~~~~~~~ //

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  const validateRequired = (pageIdx: number) => {
    if (pages) {
      const thisPageData = studentData && studentData[pageIdx];
      const thisPageRequired = requiredInputs && requiredInputs[pageIdx];
      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });
        // console.log('validate areAnyEmpty - ', areAnyEmpty);
        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

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

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   */

  return (
    <nav
      className="h-12 flex bg-gray-600 bg-opacity-20 border-0 border-gray-100 border-opacity-20 rounded-lg"
      aria-label="Breadcrumb">
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4  items-center justify-center sm:px-6 lg:px-8">
        {pages &&
          pages.map((page: UniversalLessonPage, key: number) => {
            // console.table({key: key, nextReq: nextRequiredIdx, pageOpen: page.open});
            return (
              <StageIcon
                key={`${page.id}_progressIcon`}
                pageNr={key}
                id={page.id}
                enabled={page.disabled !== true}
                open={page.open !== false}
                active={key === currentPage}
                label={page.label}
                handleRequiredNotification={handleRequiredNotification}
                clickable={
                  key === 0 ||
                  ((nextRequiredIdx !== null ? key <= nextRequiredIdx : true) &&
                    page.open !== false)
                }
              />
            );
          })}

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
              <AiOutlineHome className="flex-shrink-0 h-5 w-5 ml-1" aria-hidden="true" />
            </a>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default React.memo(ProgressBar);
