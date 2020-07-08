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


    return (
        <div className="w-full h-180 flex flex-row justify-center items-center">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <Banner title={displayProps ? displayProps.title : null} />
                <div className="bg-dark-blue w-full h-112 p-8 flex flex-col justify-center items-center text-3xl text-gray-200 rounded shadow-2 whitespace-pre-wrap overflow-scroll mb-5">
                    { displayProps ? displayProps.editInput : null}
                </div>
                <ReflectionQuestions />
            </div>
        </div>
    )
};

export default Breakdown;