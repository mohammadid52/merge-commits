import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';


const CoopDisplay = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])


        return (
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="w-full h-8.3/10 flex justify-between items-center">

                    {/* self display */}
                    <div className="w-4.85/10 h-full flex flex-col justify-between items-center">
                        <Banner title={displayProps.title}
                            display='COOP' />

                        <div className="w-full h-8.8/10 flex flex-col md:flex-row justify-between">
                            <div className={`bg-dark-blue ${displayProps.additional ? 'md:w-7.9/10' : 'w-full'} md:mb-0 overflow-scroll h-full p-4 md:p-6 items-center text-md md:text-xl text-gray-200 rounded-lg shadow-2`}>
                                <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
                                    { displayProps.story }
                                </div>
                            </div>
                            <Modules 
                                additional={displayProps.additional} 
                                displayMode = "SELFhalf" />
                        </div>
                    </div>

                    {/* teacher display */}
                    <div className="w-4.85/10 h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4">
                        <div className="w-full h-full flex flex-col justify-between items-center">
                            <Banner title={displayProps.title} 
                                display='COOP'/>

                            <div className="w-full h-8.8/10 flex md:flex-col justify-between">
                                <div className={`bg-dark-blue ${displayProps.additional ? 'md:h-7.85/10' : 'h-full'} md:mb-0 overflow-scroll w-full p-4 md:p-6 items-center text-md md:text-xl text-gray-200 rounded-lg shadow-2`}>
                                    <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
                                        { displayProps.story }
                                    </div>
                                </div>
                                <Modules 
                                    additional={displayProps.additional}
                                    displayMode = "COOP" />
                            </div>
                        </div>
                    </div>

                </div>
                <ReflectionQuestions />
            </div>
        )
    }


export default CoopDisplay;