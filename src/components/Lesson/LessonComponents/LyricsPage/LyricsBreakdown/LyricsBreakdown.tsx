import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from '../../ReflectionQuestions';
import Banner from './Banner';
import { LessonContext } from '../../../../../contexts/LessonContext';
import SelfDisplay from './SelfDisplay';
import CoopDisplay from './CoopDisplay';

const LyricsBreakdown = () => {
    const { dispatch, state } = useContext(LessonContext)
    const [ modules, setModules ] = useState<Array<any>>()
    const displayProps = state.componentState.lyrics.selected
    const { artist, title } = state.data.lesson.coreLesson.content
    const moduleTypes = state.data.lesson.coreLesson.tools

    const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);

    useEffect(() => {
        if ( state.pages[state.currentPage].displayMode !== displayMode ) {
            setDisplayMode(state.pages[state.currentPage].displayMode)
        }
    }, [state.pages])

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'corelesson/breakdown'})
    }, [])

    // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

    if (displayMode === 'SELF') {
        return (
            <SelfDisplay />
        )} if (displayMode === 'COOP') {
            return (
                <CoopDisplay />
            )
        }
    
}

export default LyricsBreakdown;