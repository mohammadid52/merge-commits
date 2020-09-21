import React, { useContext, useEffect, useState }  from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import CheckpointQuestions from './CheckpointQuestions';

const Checkpoint = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ title, setTitle ] = useState('')

    const handleSetTitle = (title: string) => {
        setTitle(title)
    }

    const tempCheckPtSwitch = (type: string) => {
        switch(type) {
            case 'profile': 
                return <SampleProfileQuestions  />
            case 'survey':
                return <CheckpointQuestions handleSetTitle={handleSetTitle} />
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
        <div className={`w-full md:h-full flex flex-col justify-center items-center`}>
            <div className="w-9.5/10 flex flex-row justify-center items-center mb-4">
                <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                    <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                        <FaCheckSquare />
                    </div>
                </IconContext.Provider>
                <div className="bg-dark-blue w-full h-full flex flex-row justify-center items-center text-2xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 px-4 py-2 z-10">
                    { title }
                </div>
            </div>
            <div className={`w-9.5/10 scrolling-touch overflow-x-scroll overflow-y-scroll md:overflow-auto h-5/10 md:h-3/4 bg-dark-blue shadow-elem-dark rounded-lg p-4 md:p-8`}>
                { tempCheckPtSwitch(state.pages[state.currentPage].type) }
            </div>
        </div>
    )
}

export default Checkpoint;