import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import SelfDisplay from './SelfDisplay';
import CoopDisplay from './CoopDisplay';


const StoryBreakdown = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;
    const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);

    console.log(state.currentPage)

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

if (displayMode === 'SELF') {
    return (
        <SelfDisplay />
    )} if (displayMode === 'COOP') {
        return (
            <CoopDisplay />
        )
    }
}

export default StoryBreakdown;