import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';

const Breakdown = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poem;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])
// h-180

    return (
        <div className="w-full h-full flex flex-row justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner title={displayProps ? displayProps.title : null} />
                <div className="bg-dark-blue w-full h-112 md:h-7/10 p-8 flex flex-col items-center text-3xl text-gray-200 rounded shadow-2 whitespace-pre-wrap overflow-scroll">
                    { displayProps ? displayProps.editInput : null}
                </div>
                <ReflectionQuestions />
            </div>
        </div>
    )
};

export default Breakdown;