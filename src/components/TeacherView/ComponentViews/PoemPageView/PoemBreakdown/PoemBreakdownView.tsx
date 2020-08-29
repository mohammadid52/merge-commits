import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';

interface props {
    student: number | null,
    fullscreen: boolean
}

const PoemBreakdownView = (props: props) => {
    const { student, fullscreen } = props;
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poem;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])

    return (
        <div className="w-full h-full flex flex-row justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner title={displayProps ? displayProps.title : null} 
                display="SELF" fullscreen={fullscreen}/>
                <div className={`${fullscreen ? 'text-2xl p-8' : 'text-lg p-4'} bg-dark-blue w-full h-112 md:h-7/10 flex flex-col items-center text-gray-200 rounded-lg shadow-2 whitespace-pre-wrap overflow-scroll`}>
                    { displayProps ? displayProps.editInput : null}
                </div>
                <ReflectionQuestions fullscreen={fullscreen}/>
            </div>
        </div>
    )
};

export default PoemBreakdownView;