import React, { useState, useEffect, useContext } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import PoemOutput from './PoemOutput';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { getPageLabel } from '../../../../getPageLabel';
import Banner from '../../../../Lesson/LessonComponents/Banner';

interface props {
    fullscreen: boolean
}

const PoemBreakdownView = (props: props) => {
    const { fullscreen } = props;
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const [dataProps, setDataProps] = useState<{ title: string, editInput: string } | null>(
        null
    )

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'activity/breakdown' : state.studentViewing.studentInfo.lessonProgress === 'activity/breakdown' : false;

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
            <Banner isTeacher={true} title={dataProps !== null ? dataProps.title : 'No title'} iconName={`FaPenFancy`}/>
            <PoemOutput poem={dataProps !== null ? dataProps.editInput : 'Your Poem :)'} />
        </div>
    )
};

export default PoemBreakdownView;