import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import ListOutput from './ListOutput';


const SelfDisplay = () => {
    const { state, theme, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;
    const tempDisplayProps = state.data.lesson.warmUp.inputs.additionalInputs
    console.log(state, 'props')

    useEffect(() => {
        dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' })
    }, [])

    const [fullscreen, setFullscreen] = useState(false);
    return (
        <div className={theme.section}>
            <ReflectionQuestions questions={state.data.lesson.warmUp.breakdown.reflectionQuestions}  />
            <Banner title={typeof displayProps !== 'undefined' ? displayProps.title : 'Your List Title :)'} display='SELF' fullscreen={fullscreen} />
            <ListOutput list={typeof displayProps !== 'undefined' ? displayProps.story : 'Your List :)'} />            
            {<Modules additional={typeof displayProps !== 'undefined' ? displayProps.additional : 'Your Poem Title :)'} displayMode='SELF' />           }
        </div>
    )
}

export default SelfDisplay;