import React, { useState, useEffect, useContext } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import { studentObject } from '../../../../../state/LessonControlState'
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const SelfDisplay = (props: props) => {
    const { fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const [ dataProps, setDataProps ] = useState<{ title?: string, story?: string, [key: string]: any}>()

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'warmup/breakdown' : false;

    useEffect(() => {
        if (displayStudentData) {
            console.log(state.studentViewing.studentInfo);
            if ( state.studentViewing.studentInfo.warmupData ) {
                return setDataProps(state.studentViewing.studentInfo.warmupData)
            } return setDataProps(null)
        }
    }, [state.studentViewing]);



    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner dataProps={dataProps}
                fullscreen={fullscreen}
                />
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div className={`bg-dark-blue ${dataProps && dataProps.additional ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-scroll h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl text-gray-200 rounded-lg shadow-2`}>
                    { dataProps && dataProps.story ? dataProps.story : null }
                </div> 
                <Modules 
                    dataProps={dataProps} 
                    fullscreen={fullscreen}/>
            </div>
            <ReflectionQuestions fullscreen={fullscreen}/>
        </div>
    )
}

export default SelfDisplay;