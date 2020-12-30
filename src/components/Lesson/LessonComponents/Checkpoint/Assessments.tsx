import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import AssessmentQuestions from './AssessmentQuestions';


const Checkpoint = () => {
    const { state, dispatch, theme } = useContext(LessonContext)
    const [title, setTitle] = useState('')

    const handleSetTitle = (title: string) => {
        setTitle(title)
    }

    const tempCheckPtSwitch = (type: string) => {
        switch (type) {
            case 'profile':
                return <SampleProfileQuestions />
            case 'survey':
                return <AssessmentQuestions handleSetTitle={handleSetTitle} />
            default:
                return
        }
    }

    useEffect(() => {
        if (!state.pages[state.currentPage].active) {
            dispatch({ type: 'ACTIVATE_LESSON', payload: state.pages[state.currentPage].stage })
        }
    }, [state.currentPage])

    return (
        <div className="relative h-full w-full text-gray-200">
            <div className={`${theme.elem.text}`}>
                <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem' }}>
                    <FaCheckSquare />
                </IconContext.Provider>
                {title}
            </div>
            <div className="flex flex-col h-full w-full justify-around items-center">
                {tempCheckPtSwitch(state.pages[state.currentPage].type)}
            </div>
        </div>
    )
}

export default Checkpoint;