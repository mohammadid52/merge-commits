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
        <div className="hidden w-full md:flex flex-col flex-grow items-center justify-center content-center px-4 z-0">
            <div className="w-full flex flex-row items-center justify-between">
                { 
                    state.pages.map((page: { stage: string; type: string; open: boolean, disabled: boolean; }, key: React.ReactText) => (
                        <>
                            <StageIcon iconID={key} key={key} stage={page.stage} type={page.type} active={state.pages[key].active}
                            open={page.open}
                            disabled={page.disabled}
                            />
                        </>
                    ))
                }
            </div>
            <div className="w-full flex flex-row px-4 transform -translate-y-8">
                {
                    state.pages.map((page: { stage: string; type: string; breakdown: boolean; disabled: boolean; }, key: number) => (
                        key > 0 && !page.disabled ?
                        <div key={key} className="h-4 flex-grow-0 bg-gray-200 z-10 flex items-center justify-center ">
                            <div className={`h-2 w-full ${state.pages[key].active ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                        </div>
                        :
                        null
                    ))
                }
            </div>
        </div>
    )
}

export default ProgressBar;