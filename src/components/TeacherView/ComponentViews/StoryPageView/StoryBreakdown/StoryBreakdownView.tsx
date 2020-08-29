import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';

interface props {
    student: number | null,
    fullscreen: boolean
}

const SelfDisplay = (props: props) => {
    const { student, fullscreen } = props;
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])


    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={displayProps.title}
                fullscreen={fullscreen}
                />
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div className={`bg-dark-blue ${displayProps.additional ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-scroll h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl text-gray-200 rounded-lg shadow-2`}>
                    { displayProps.story }
                </div>
                <Modules 
                    additional={displayProps.additional} 
                    fullscreen={fullscreen}/>
            </div>
            <ReflectionQuestions fullscreen={fullscreen}/>
        </div>
    )
}

export default SelfDisplay;