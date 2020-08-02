import React, { useContext } from 'react';
import ProgressBar from '../Lesson/Foot/ProgressBar/ProgressBar';
import LessonLoading from '../Lesson/Loading/LessonLoading';
import { LessonContext } from '../../contexts/LessonContext';
import ClassRoster from './ClassRoster';
import Intro from '../Lesson/LessonComponents/Intro/Intro';

const LessonControl = () => {
    const { state, theme } = useContext(LessonContext);

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    return (
        <div className={`w-full h-full bg-gray-400 flex p-8`}>
            <div className={`w-4/10 h-full px-4 flex flex-col items-center`}>
                <h1 className={`text-3xl text-center`}>
                    Lesson Name
                </h1>
                <div>
                    <p>
                        
                    </p>

                </div>
            </div>
            <div className={`w-6/10 h-full flex flex-col items-center`}>
                <div className={`w-full h-full bg-dark shadow-inner-dark rounded-lg mb-4`}>
                    
                </div>
                <ProgressBar />
                <ClassRoster />
            </div>
        </div>
    )
}

export default LessonControl;