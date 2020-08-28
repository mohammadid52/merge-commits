import React, { useContext, useState } from 'react';
import ProgressBar from '../Lesson/Foot/ProgressBar/ProgressBar';
import LessonLoading from '../Lesson/Loading/LessonLoading';
import ClassRoster from './ClassRoster';
import Intro from '../Lesson/LessonComponents/Intro/Intro';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import IntroView from './ComponentViews/IntroView/IntroView';
import { LessonControlContext } from '../../contexts/LessonControlContext';

type selectedState = number | null

const LessonControl = () => {
    const { state } = useContext(LessonControlContext);
    const [ selectedStudent, setSelectedStudent ] = useState<selectedState>(null)

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    return (
        <div className={`w-full h-full bg-gray-400 p-8`}>
            <div className={`w-full h-full flex flex-col`}>
                <div className={`w-full h-1/10 bg-gray-200 mb-2 shadow-elem-light rounded-lg px-4 flex flex-row items-center`}>
                    <h1 className={`w-2/10 text-3xl text-center font-extrabold font-open my-2`}>
                        Where I'm From
                    </h1>
                </div>
                <div className={`w-full h-9/10 flex bg-gray-200 shadow-elem-light p-4 rounded-lg`}>
                    <div className={`w-4/10 h-full px-4 flex flex-col items-center`}>
                        <div className={`h-full w-full mb-2`}>
                            <div className={`w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between text-xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Class Roster 
                                </h2>
                                <h2 className={`w-auto`}>
                                    P.Tech Class A
                                </h2>
                            </div>
                            <div className={`h-4/10 my-4`}>
                                <ClassRoster setSelectedStudent={setSelectedStudent}/>
                            </div>
                            <div className={`w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between text-xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Teacher Notes 
                                </h2>
                            </div>
                            <textarea id="text" className="bg-gray-300 w-full h-4/10 p-8 my-4 text-sm md:text-2xl text-gray-800 rounded-lg shadow-inner-dark" 
                            // value={input}
                            />
                        </div>
                    </div>
                    <div className={`w-6/10 h-full flex flex-col items-center`}>
                        <div className={`w-full h-8/10 bg-dark shadow-elem-light rounded-lg mb-4 p-4`}>
                            {/*  */}
                            <IntroView student={selectedStudent}/>
                        </div>
                        <LessonControlBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonControl;