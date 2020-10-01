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
    const [ dataProps, setDataProps ] = useState<{ title?: string, story?: string, [key: string]: any} | null>(null)

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'warmup/breakdown' : false;

    useEffect(() => {
        if (displayStudentData) {
            if ( state.studentViewing.studentInfo.warmupData ) {
                return setDataProps(state.studentViewing.studentInfo.warmupData)
            }
        } return setDataProps(null)
    }, [state.studentViewing]);



    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner dataProps={dataProps}
                fullscreen={fullscreen}
                />
            <div className="w-full h-7.2/10 flex flex-col justify-between">
                <div className={`bg-gradient-to-tl from-dark-blue to-med-dark-blue ${dataProps && dataProps.additional ? 'md:h-7/10' : 'h-full'} ${fullscreen ? 'text-md md:text-2xl px-4 md:px-12 py-4 md:py-8' : 'text-ls px-2 md:px-6 py-2 md:py-4'} mb-4 md:mb-0 overflow-y-auto overflow-x-hidden h-full items-center text-gray-200 rounded-lg`}>
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