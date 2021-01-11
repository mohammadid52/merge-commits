import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import SampleSELQuestions from './SampleSELQuestions';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import Banner from './Banner';

interface props {
    fullscreen: boolean
}

const tempCheckPtSwitch = (type: string, props: props) => {
    switch (type) {
        case 'profile':
            return <SampleProfileQuestions />
        case 'sel':
            return <SampleSELQuestions fullscreen={props.fullscreen} />
        default:
            return
    }
}

const Checkpoint = (props: props) => {
    const { fullscreen } = props;
    const { state, theme, dispatch } = useContext(LessonControlContext)

    // useEffect(() => {
    //     dispatch({ type: 'ACTIVATE_CHECKPOINT', payload: state.pages[state.currentPage].type })
    // }, [])

    return (
        <div className={theme.section}>
            <Banner />
            { tempCheckPtSwitch('sel', props)}
        </div>
    )
}

export default Checkpoint;