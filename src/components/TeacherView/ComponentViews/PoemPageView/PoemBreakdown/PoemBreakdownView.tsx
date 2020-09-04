import React, { useState, useEffect, useContext } from 'react';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const PoemBreakdownView = (props: props) => {
    const { fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const [ dataProps, setDataProps ] = useState({
        title: '',
        editInput: ''
    })

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'activity/breakdown' : false;

    useEffect(() => {
        if ( displayStudentData && state.studentViewing.studentInfo.activityData ) {
            setDataProps(() => {
                return {
                    title: state.studentViewing.studentInfo.activityData.title ? state.studentViewing.studentInfo.activityData.title : '',
                    editInput: state.studentViewing.studentInfo.activityData.editInput ? state.studentViewing.studentInfo.activityData.editInput : '',
                }
            })
        }

    }, [])

    return (
        <div className="w-full h-full flex flex-row justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner title={ dataProps.title } 
                display="SELF" fullscreen={fullscreen}/>
                <div className={`${fullscreen ? 'text-2xl p-8' : 'text-lg p-4'} bg-dark-blue w-full h-112 md:h-7/10 flex flex-col items-center text-gray-200 rounded-lg shadow-2 whitespace-pre-wrap overflow-scroll`}>
                    { dataProps.editInput }
                </div>
                <ReflectionQuestions fullscreen={fullscreen}/>
            </div>
        </div>
    )
};

export default PoemBreakdownView;