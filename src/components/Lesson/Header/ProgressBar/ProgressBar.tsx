import React, {useContext, useEffect, useState} from 'react';
import StageIcon from './StageIcon';
import {LessonContext} from '../../../../contexts/LessonContext';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../../interfaces/UniversalLessonInterfaces';

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
  const LESSON_PROGRESS = lessonState.lessonProgress;

  // useEffect(() => {
  //   /**
  //    *
  //    *
  //    * STOPPING POINTS
  //    * any circle should be clickable up until 1 before
  //    * the next closed component, or breakdown which is not active
  //    *
  //    */
  //   const stoppingPoints = PAGES
  //     ? PAGES.reduce((acc: [], page: UniversalLessonPage, i: number) => {
  //         const isDisabled = !page.enabled;
  //         const isClosed = !page.open;

  //         //  Disabled or closed = don't go
  //         if ((i !== 0 && isDisabled) || (i !== 0 && isClosed)) {
  //           return [...acc, i];
  //         } else {
  //           return acc;
  //         }
  //       }, [])
  //     : [];

  //   const earliestStoppingPoint = Math.min(...stoppingPoints);
  //   setClickable(earliestStoppingPoint);
  // }, [PAGES]);

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
              clickable={PAGES.length > 0 && PAGES[key].open}
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
