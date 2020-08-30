import React, { useContext, useState } from 'react';
import ProgressBar from '../Lesson/Foot/ProgressBar/ProgressBar';
import LessonLoading from '../Lesson/Loading/LessonLoading';
import ClassRoster from './ClassRoster';
import Intro from '../Lesson/LessonComponents/Intro/Intro';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import IntroView from './ComponentViews/IntroView/IntroView';
import LyricsBreakdownView from './ComponentViews/LyricsPageView/LyricsBreakdown/LyricsBreakdownView';
import LyricsActivityView from './ComponentViews/LyricsPageView/LyricsModules/LyricsActivityView';
import OutroView from './ComponentViews/OutroView/OutroView';
import PoemBreakdownView from './ComponentViews/PoemPageView/PoemBreakdown/PoemBreakdownView';
import PoemActivityView from './ComponentViews/PoemPageView/PoemModules/PoemActivityView';
import StoryBreakdownView from './ComponentViews/StoryPageView/StoryBreakdown/StoryBreakdownView';
import StoryActivityView from './ComponentViews/StoryPageView/StoryModules/StoryActivityView';



import { LessonControlContext } from '../../contexts/LessonControlContext';
import { IconContext } from "react-icons";
import { FaExpand, FaCompress } from 'react-icons/fa';

type selectedState = number | null

const LessonControl = () => {
    const { state } = useContext(LessonControlContext);
    const [ selectedStudent, setSelectedStudent ] = useState<selectedState>(null);
    const [fullscreen, setFullscreen] = useState(false);

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

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
                {/*  */}
                <div className={`w-full h-9/10 flex bg-gray-200 shadow-elem-light p-4 rounded-lg`}>
                    <div className={`${fullscreen ? 'hidden' : 'display'} w-4/10 h-full px-4 flex flex-col items-center`}>
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
                    <div className={`${fullscreen ? 'w-full' : 'w-6/10'} h-full flex flex-col items-center`}>
                        <div className={`${fullscreen ? 'h-full' : 'h-8/10'} relative w-full bg-dark shadow-elem-light rounded-lg mb-4 p-4`}>
                            {/*  */}
                            <LyricsActivityView
                                student={selectedStudent}
                                fullscreen={fullscreen}
                                />
                            {/*  */}
                            <div className="absolute cursor-pointer w-auto text-xl m-2 z-50" style={{top: 0, right: 0}} onClick={handleFullscreen}>
                                <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem' }}>
                                    {fullscreen ? < FaCompress /> :< FaExpand />}
                                </IconContext.Provider>
                            </div>

                        </div>

                        <div className={`${fullscreen ? 'hidden' : 'display'} flex justify-center items-center`}>
                            <LessonControlBar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonControl;