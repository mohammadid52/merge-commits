import React, { useContext } from 'react';
import StageIcon from './StageIcon';
import { LessonContext } from '../../../../contexts/LessonContext';

const ProgressBar = () => {
    const { state } = useContext(LessonContext);

    return (
        <div className="w-full flex-grow flex flex-col items-center justify-center content-center px-4 z-0">
            <div className="w-full flex flex-row items-center justify-between">
                { 
                    state.pages.map((page: { stage: string; type: string; breakdown: boolean; }, key: React.ReactText) => (
                        <StageIcon key={key} stage={page.stage} type={page.type} active={state.pages[key].active} breakdown={page.breakdown ? page.breakdown : null}/>
                    ))
                }
            </div>
            <div className="w-full flex flex-row px-4 transform -translate-y-8">
                {
                    state.pages.map((_page: any, key: number) => (
                        key > 0 ?
                        <div key={key} className="h-4 flex-grow bg-gray-200 z-10 flex items-center justify-center ">
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