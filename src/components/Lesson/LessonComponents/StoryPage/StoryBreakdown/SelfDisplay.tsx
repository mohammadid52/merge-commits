import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';


const SelfDisplay = () => {
    const { state, theme, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    const [fullscreen, setFullscreen] = useState(false);
    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={displayProps.title} 
                display='SELF' fullscreen={fullscreen}/>
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div className={`${theme.gradient.cardBase} ${displayProps.additional ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-y-auto overflow-x-hidden h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl font-light text-gray-200 rounded-lg shadow-2`}>
                    { displayProps.story }
                </div>
                <Modules 
                    additional={displayProps.additional} 
                    displayMode = 'SELF'/>
            </div>
            <ReflectionQuestions />
        </div>
    )
}

export default SelfDisplay;