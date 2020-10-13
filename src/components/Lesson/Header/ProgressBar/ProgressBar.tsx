import React, { useContext } from 'react';
import StageIcon from './StageIcon';
import { LessonContext } from '../../../../contexts/LessonContext';

const ProgressBar = () => {
  const { state } = useContext(LessonContext);

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   * state.pages = array of available pages
   * state.pages[i].type = name of page type/story/breakdown
   */

  return (
    <>
      <div className='hidden w-full md:flex flex-col flex-grow items-center justify-center content-center px-4 z-0'>
        <div className='flex items-center justify-between'>
          <div className='w-full flex flex-row items-center justify-between'>
            {/* ICON */}
            {state.pages.map(
              (
                page: { stage: string; type: string; open: boolean; disabled: boolean },
                key: number
              ) => (
                <div
                  className={`${
                    key < state.pages.length - 1 ? 'w-full' : 'w-auto'
                  } flex justify-center items-center`}>
                  <StageIcon
                    iconID={key}
                    key={key}
                    stage={page.stage}
                    type={page.type}
                    active={state.pages[key].active}
                    open={page.open}
                    disabled={page.disabled}
                  />

                  {/* PROGRESS BAR */}
                  {key < state.pages.length - 1 && (
                    <div
                      key={key + 'bar'}
                      className='relative h-2 w-full bg-dark-gray z-10 flex items-center justify-center '>
                      <div
                        className={`h-2 w-full ${
                          state.pages[key + 1].active ? 'bg-blueberry' : 'bg-dark-gray'
                        }`}></div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* <div className="w-full flex flex-row px-4 transform -translate-y-8">
                    {
                        state.pages.map((page: { stage: string; type: string; breakdown: boolean; disabled: boolean; }, key: number) => (
                            key > 0 && !page.disabled ?
                            <div key={key} className="h-4 flex-grow-0 bg-dark-gray z-10 flex items-center justify-center ">
                                <div className={`h-2 w-full ${state.pages[key].active ? 'bg-green-600' : 'bg-dark-gray'}`}></div>
                            </div>
                            :
                            null
                        ))
                    }
                </div>  */}
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
