import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';


const SelfDisplay = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poem;
    const [fullscreen, setFullscreen] = useState(false);
    
    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])

    return (
        <div className="w-full h-full flex flex-row justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner title={displayProps ? displayProps.title : null} 
                display="SELF" fullscreen={fullscreen} />
                <div className="bg-dark-blue w-full h-112 md:h-7/10 font-light p-8 flex flex-col items-center text-2xl text-gray-200 rounded-lg whitespace-pre-wrap overflow-y-auto overflow-x-hidden">
                    { displayProps ? displayProps.editInput : null}
                </div>
                <ReflectionQuestions />
            </div>
        </div>
    )
};

export default SelfDisplay;