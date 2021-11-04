import React, {useContext} from 'react';
import StageIcon from './StageIcon';
import {
  StudentPageInput,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {AiOutlineHome} from 'react-icons/ai';
import {GlobalContext} from '@contexts/GlobalContext';

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
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const user = gContext.state.user;

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  /************************************************
   * THIS CAN PROBABLY BE REFACTORED SO THAT ONLY *
   *  THE CODE FROM THE ELSE - IF AFTER LINE 58   *
   *     IS USED FOR CHECKING REQUIRED FIELDS     *
   ************************************************/

  const validateRequired = (pageIdx: number) => {
    if (pages) {
      let inputResponseData =
        studentData && !isSurvey ? studentData[pageIdx] : studentData;

      let thisPageRequired = requiredInputs && requiredInputs[pageIdx]; // ['a','b','id_123']

      if (inputResponseData && inputResponseData.length > 0) {
        let areAnyEmpty2 =
          thisPageRequired && thisPageRequired.length > 0
            ? thisPageRequired.reduce((truth: boolean, requiredId: string) => {
                let findInSurveyData = inputResponseData.find(
                  (inputObj: any) =>
                    (inputObj.domID === requiredId && inputObj.input[0] === '') ||
                    (inputObj.domID === requiredId && inputObj.input[0] === undefined)
                );
                if (truth === true) {
                  return true;
                } else {
                  if (findInSurveyData !== undefined && findInSurveyData !== null) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }, false)
            : false;

        if (areAnyEmpty2) {
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

  // ~~~~~~~~~~~~ SHARING CHECK ~~~~~~~~~~~~ //
  const isOnDemand = user.onDemand;
  const isTeacherPresenting = lessonState.displayData[0].isTeacher === true;

  return (
    <nav
      className="h-12 flex bg-gray-600 bg-opacity-20 border-0 border-gray-100 border-opacity-20 rounded-lg"
      aria-label="Breadcrumb">
      {isTeacherPresenting && !isOnDemand && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 disabled z-50">
          <p className="text-center font-bold text-sm">
            Disabled when teacher is presenting!
          </p>
        </div>
      )}
      <ol className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4  items-center justify-center sm:px-6 lg:px-8">
        {pages &&
          pages.map((page: UniversalLessonPage, key: number) => {
            // console.table({key: key, nextReq: nextRequiredIdx, pageOpen: page.open});
            return (
              <StageIcon
                key={`${page.id}_progressIcon`}
                pageNr={key}
                id={page.id}
                enabled={page.disabled !== true || isOnDemand}
                open={page.open !== false || isOnDemand}
                active={key === currentPage}
                label={page.label}
                handleRequiredNotification={handleRequiredNotification}
                clickable={
                  key === 0 ||
                  isOnDemand ||
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
