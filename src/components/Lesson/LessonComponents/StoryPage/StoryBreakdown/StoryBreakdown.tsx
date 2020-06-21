import React, { useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';


const StoryBreakdown = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.displayProps.story;

    // useEffect(() => {
    //     dispatch({type: 'ACTIVATE_LESSON', payload: 'warm-up/breakdown'})
    // }, [])


    return (
        <div className="w-full flex flex-col justify-center items-center">
            {/* <Banner title={displayProps.title} artist={state.data.student.username}/>
            <div className="w-full flex flex-row mb-5">
                <div className={`flex-grow bg-dark-blue ${displayProps.additional ? 'w-8/10' : 'w-full'} h-105 px-12 py-8 flex flex-col justify-center items-center text-3xl text-gray-200 rounded shadow-2`}>
                    { displayProps.story }
                </div>
                <Modules additional={displayProps.additional}/>
            </div>
            <ReflectionQuestions /> */}
        </div>
    )
}

export default StoryBreakdown;