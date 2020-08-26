import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';



const CoopDisplay = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poem;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="h-8.3/10 flex justify-between items-center">

            {/* self display */}
            <div className="w-4.8/10 h-full flex flex-col justify-between items-center">
                <Banner title={displayProps ? displayProps.title : null} 
                    display="COOP"/>

                <div className="w-full h-8.8/10 flex flex-col justify-between items-center">
                    <div className="bg-dark-blue w-full h-full p-6 flex flex-col items-center text-xl text-gray-200 rounded-lg shadow-2 whitespace-pre-wrap overflow-scroll">
                        <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
                        { displayProps ? displayProps.editInput : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* teacher display */}
            <div className="w-4.85/10 h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4">
                <div className="w-full h-full flex flex-col justify-between items-center">
                    <Banner title={displayProps ? displayProps.title : null} 
                        display="COOP" />

                    <div className="w-full h-8.8/10 flex flex-col justify-between items-center">
                        <div className="bg-dark-blue w-full h-full p-6 flex flex-col items-center text-xl text-gray-200 rounded-lg shadow-2 whitespace-pre-wrap overflow-scroll">
                            <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
                            { displayProps ? displayProps.editInput : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>
            <ReflectionQuestions />
        </div>
    )
};

export default CoopDisplay;