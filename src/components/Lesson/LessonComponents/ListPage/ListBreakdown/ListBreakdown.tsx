import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
// import ReflectionQuestions from '../../ReflectionQuestions';
// import Modules from './Modules';
// import Banner from './Banner';
import SelfDisplay from './SelfDisplay';
import CoopDisplay from './CoopDisplay';


const StoryBreakdown = () => {
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState?.story;
    const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);


    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    useEffect(() => {
        if ( state.pages[state.currentPage].displayMode !== displayMode ) {
            setDisplayMode(state.pages[state.currentPage].displayMode)
        }
    }, [state.pages])

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