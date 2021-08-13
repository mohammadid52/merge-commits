import React, {useContext, useEffect, useState} from 'react';
import StageIcon from './StageIcon';
import {LessonContext} from '../../../../contexts/LessonContext';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {
  StudentPageInput,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';

interface Page {
  active: boolean;
  stage: string;
  type: string;
  open: boolean;
  disabled: boolean;
}

const ProgressBar = () => {
  const {lessonState, lessonDispatch} = useContext(GlobalContext);
  // const [clickable, setClickable] = useState<number>();

  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;
  const LESSON_PROGRESS = lessonState.lessonProgress;

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  const validateRequired = (pageIdx: number) => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData[pageIdx];
      const thisPageRequired = lessonState?.requiredInputs[pageIdx];
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

  const nextRequiredIdx = PAGES
    ? PAGES.reduce((nextIdx: number, _: any, currIdx: number) => {
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
    : 0;

  const lessonProgressBar = () => {
    return (
      //  ICON
      PAGES &&
      PAGES.map((page: UniversalLessonPage, key: number) => {
        return (
          <div
            key={`${key}_bar`}
            className={`${
              key < PAGES.length - 1 ? 'w-full' : 'w-auto'
            } flex justify-center items-center`}>
            <StageIcon
              key={`${page.id}_progressIcon`}
              pageNr={key}
              id={page.id}
              enabled={page.disabled !== true}
              open={page.open !== false}
              active={page.active !== false}
              label={page.label}
              clickable={key <= nextRequiredIdx && page.open !== false}
            />

            {/* PROGRESS BAR */}
            {key < PAGES.length - 1 && (
              <div
                key={`${key}_bar`}
                className="relative h-2 w-full bg-dark-gray z-10 flex items-center justify-center transform scale-x-125 ">
                <div
                  className={`h-2 w-full ${
                    key < LESSON_PROGRESS ? 'bg-blueberry' : 'bg-dark-gray'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })
    );
  };

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   */

  return (
    <>
      <div className="hidden max-w-256 md:flex flex-col flex-grow items-center justify-center content-center z-0">
        <div className="w-full max-w-256 flex items-center justify-between">
          <div className="w-full flex flex-row items-center justify-between">
            {lessonState.lessonData.lessonPlan && lessonProgressBar()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
