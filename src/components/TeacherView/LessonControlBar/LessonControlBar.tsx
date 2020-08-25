import React, { useContext } from 'react';
import StageIcon from './StageIcon';
import LessonControl from '../LessonControl';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

const LessonControlBar = () => {
    const { state } = useContext(LessonControlContext);

    return (
        <div className="hidden relative w-full h-1/10 md:flex flex-col items-center justify-center content-center px-4 z-0">
            <div className="w-full flex flex-row items-center justify-between">
                { 
                    state.pages.map((page: { stage: string; type: string; breakdown: boolean; open: boolean}, key: React.ReactText) => (
                        <StageIcon key={key} open={page.open} stage={page.stage} type={page.type} active={state.pages[key].active} breakdown={page.breakdown ? page.breakdown : null}/>
                    ))
                }
            </div>
        </div>
    )
}

export default LessonControlBar;