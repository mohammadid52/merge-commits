import React, { useContext, useEffect, useState } from 'react';
import StageIcon from './StageIcon';
import { LessonContext } from '../../../../contexts/LessonContext';

interface Page {
  active: boolean;
  stage: string;
  type: string;
  open: boolean;
  disabled: boolean;
}

const ProgressBar = (props: {barType: string}) => {
  const barType = props.barType;
  const { state, theme } = useContext(LessonContext);
  const [clickable, setClickable] = useState<number>();


  useEffect(() => {
    /**
     *
     *
     * STOPPING POINTS
     * any circle should be clickable up until 1 before
     * the next closed component, or breakdown which is not active
     *
     */
    if (barType === 'lesson') {
      const stoppingPoints = state.pages.reduce((acc: [], page: Page, i: number) => {
        const pageBefore = state.pages[i - 1];
        const isBreakdown = page.type === 'breakdown';
        const isDisabled = page.disabled;
        const isClosed = !page.open;

        //  Disabled or closed = don't go
        if ((i !== 0 && isDisabled) || (i !== 0 && isClosed)) {
          return [...acc, i];
        }

        //  If breakdown exercise not completed, don't go because crash
        if (isBreakdown && !pageBefore.active) {
          return [...acc, i];
        }

        return acc;
      }, []);

      const earliestStoppingPoint = Math.min(...stoppingPoints);
      setClickable(earliestStoppingPoint);
    }
  }, [state.pages]);


  /**
   *
   * filter multiple stages
   * map over multiple stages
   * use this map as stage name e.g. Breakdown 1, Breakdown 2, Breakdown 3...
   *
   * THIS CODE NEEDS TO BE REWRITTEN, SUPER UNCLEAR AT THE MOMENT
   *
   * Duplicated in:
   *
   * - ProgressBar.tsx
   * - LessonControlBar.tsx
   *
   */

  const mapStages = state.pages.map(
    (page: { stage: string; type: string; open: boolean; disabled: boolean }, stageNr: number) => ({
      ...page,
      stageNr: stageNr,
    })
  );

  const checkIfMultipleStages = (type: string) => {
    return (
      state.pages.filter(
        (page: { stage: string; type: string; open: boolean; disabled: boolean }) => page.type === type
      ).length > 1
    );
  };

  const mapMultipleStages = (type: string) => {
    const out = mapStages
      .filter(
        (page: { stage: string; type: string; open: boolean; disabled: boolean; stageNr: number }) => page.type === type
      )
      .map((page: { stage: string; type: string; open: boolean; disabled: boolean; stageNr: number }, i: number) => ({
        ...page,
        multipleCounter: i + 1,
      }));

    return out;
  };

  const getSpecificStage = (type: string, stageNr: number) => {
    const out = mapMultipleStages(type).filter(
      (page: {
        stage: string;
        type: string;
        open: boolean;
        disabled: boolean;
        stageNr: number;
        multipleCounter: number;
      }) => page.stageNr === stageNr
    );

    return out[0];
  };


  const lessonProgressBar = () => {
    return (
      //  ICON
      state.pages.map((page: { stage: string; type: string; open: boolean; disabled: boolean }, key: number) => (
        <div
          key={`${key}_bar`}
          className={`${key < state.pages.length - 1 ? 'w-full' : 'w-auto'} flex justify-center items-center`}>
          <StageIcon
            iconID={key}
            key={key}
            stage={page.stage}
            type={page.type}
            active={state.pages[key].active}
            open={page.open}
            disabled={page.disabled}
            counter={checkIfMultipleStages(page.type) ? getSpecificStage(page.type, key).multipleCounter : null}
            // clickable={key < clickable}
            clickable={true}
          />

          {/* PROGRESS BAR */}
          {key < state.pages.length - 1 && (
            <div
              key={`${key}_bar`}
              className='relative h-2 w-full bg-dark-gray z-10 flex items-center justify-center transform scale-x-125 '>
              <div className={`h-2 w-full ${key < state.lessonProgress ? 'bg-blueberry' : 'bg-dark-gray'}`} />
            </div>
          )}
        </div>
      ))
    );
  };


  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   * state.pages = array of available pages
   * state.pages[i].type = name of page type/story/breakdown
   */

  return (
    <>
      <div className="hidden max-w-256 md:flex flex-col flex-grow items-center justify-center content-center z-0">
        <div className="w-full max-w-256 flex items-center justify-between">
          <div className='w-full flex flex-row items-center justify-between'>
            {
              barType === 'lesson' ?
                lessonProgressBar() :
                null
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
