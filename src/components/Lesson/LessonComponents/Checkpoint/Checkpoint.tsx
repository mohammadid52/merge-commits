import React, { useContext, useEffect, useState }  from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import CheckpointQuestions from './CheckpointQuestions';
import CheckpointQuestionsTest from './CheckpointQuestionsTest';


const Checkpoint = () => {
    const { state, dispatch, theme } = useContext(LessonContext)
    const [ title, setTitle ] = useState('')

    const handleSetTitle = (title: string) => {
        setTitle(title)
    }

    const tempCheckPtSwitch = (type: string) => {
        switch(type) {
            case 'profile': 
                return <SampleProfileQuestions  />
            case 'survey':
                return <CheckpointQuestionsTest handleSetTitle={handleSetTitle} />
            default:
                return
        }
    }

    useEffect(() => {
        if ( !state.pages[state.currentPage].active ) {
            dispatch({ type: 'ACTIVATE_LESSON', payload: state.pages[state.currentPage].stage })
        }
    }, [state.currentPage])

    return (
        <div className={`h-full w-full flex justify-center items-center`}>
            <div className="w-8.5/10 md:h-8/10 flex flex-col justify-between items-center ">
                <div className="h-1.3/10 w-full flex flex-row justify-center items-center"> 
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                        <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                            <FaCheckSquare />
                        </div>
                    </IconContext.Provider>
                    <div className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
                        { title }
                    </div>
                </div>
                <div className={`h-8.5/10 w-full scrolling-touch overflow-x-scroll overflow-y-scroll md:overflow-auto bg-dark-blue shadow-elem-dark rounded-lg p-4 md:py-4 md:px-6`}>
                    { tempCheckPtSwitch(state.pages[state.currentPage].type) }
                </div>
            </div>
        </div>
    )
}

export default Checkpoint;