import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';
import { IconContext } from "react-icons";
import { FaExpand, FaCompress } from 'react-icons/fa';



const CoopDisplay = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poem;
    const [fullscreen, setFullscreen] = useState(false);

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="h-8.3/10 flex justify-between items-center">

            {/* self display */}
            <div className={`${fullscreen ? 'hidden' : 'w-4.8/10'}  h-full flex flex-col justify-between items-center`}>
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
            <div className={`relative ${fullscreen ? 'w-full' : 'w-4.85/10 '} h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4`}>
                <div className="absolute cursor-pointer w-auto text-xl m-2" style={{bottom: 0, right: 0}} onClick={handleFullscreen}>
                    <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem' }}>
                        {fullscreen ? < FaCompress /> :< FaExpand />}
                    </IconContext.Provider>
                </div>
                <div className="w-full h-full flex flex-col justify-between items-center">
                    <Banner title={displayProps ? displayProps.title : null} 
                        display="COOP" />

                    <div className="w-full h-8.8/10 flex flex-col justify-between items-center">
                        <div className={`${fullscreen ? 'text-2xl' : 'text-xl'} bg-dark-blue w-full h-full p-6 flex flex-col items-center text-gray-200 rounded-lg shadow-2 whitespace-pre-wrap overflow-scroll`}>
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