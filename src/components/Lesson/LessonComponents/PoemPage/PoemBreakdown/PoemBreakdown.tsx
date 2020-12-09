import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from '../../ReflectionQuestions';
import SelfDisplay from './SelfDisplay';
import CoopDisplay from './CoopDisplay';



const Breakdown = () => {
    const { state, dispatch } = useContext(LessonContext);

    const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
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

export default Breakdown;