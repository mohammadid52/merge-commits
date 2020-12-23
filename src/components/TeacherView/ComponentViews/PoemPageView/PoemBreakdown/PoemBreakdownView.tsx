import React, { useState, useEffect, useContext } from 'react';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';
import PoemOutput from './PoemOutput';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const PoemBreakdownView = (props: props) => {
    const { fullscreen } = props;
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const [dataProps, setDataProps] = useState<{ title: string, editInput: string } | null>(
        null
    )

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'activity/breakdown' : state.studentViewing.studentInfo.lessonProgress === 'activity/breakdown' : false;

    useEffect(() => {
        if (displayStudentData && state.studentViewing.studentInfo.activityData) {
            setDataProps(() => {
                return {
                    title: state.studentViewing.studentInfo.activityData.title ? state.studentViewing.studentInfo.activityData.title : '',
                    editInput: state.studentViewing.studentInfo.activityData.editInput ? state.studentViewing.studentInfo.activityData.editInput : '',
                }
            })
        }

        if (!displayStudentData) {
            setDataProps(null)
        }

    }, [state.studentViewing])

    return (
        <div className={theme.section}>
            <ReflectionQuestions fullscreen={fullscreen} />
            <Banner title={dataProps !== null ? dataProps.title : 'No title'} display="SELF" fullscreen={fullscreen} />
            <PoemOutput poem={dataProps !== null ? dataProps.editInput : 'Your Poem :)'} />
        </div>
    )
};

export default PoemBreakdownView;