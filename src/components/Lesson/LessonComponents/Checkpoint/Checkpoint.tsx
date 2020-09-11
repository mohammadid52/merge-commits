import React, { useContext, useEffect }  from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import SampleSELQuestions from './SampleSELQuestions';

const tempCheckPtSwitch = (type: string) => {
    switch(type) {
        case 'profile': 
            return <SampleProfileQuestions />
        case 'sel':
            return <SampleSELQuestions />
        default:
            return
    }
}

const Checkpoint = () => {
    const { state, dispatch } = useContext(LessonContext)

    useEffect(() => {
        dispatch({ type: 'ACTIVATE_CHECKPOINT', payload: state.pages[state.currentPage].type })
    }, [])

    return (
        <div className={`w-2/3 h-8/10 flex flex-col justify-between items-center`}>
            <div className="w-full h-1.3/10 flex flex-row justify-center items-center mb-4">
                <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                    <div className="h-full bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                        <FaCheckSquare />
                    </div>
                </IconContext.Provider>
                <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-4xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 px-4 py-2 z-10">
                    Checkpoint
                </div>
            </div>
            <div className={`w-full h-8.5/10 bg-dark-blue shadow-elem-dark rounded-lg p-8`}>
                { tempCheckPtSwitch(state.pages[state.currentPage].type) }
            </div>
        </div>
    )
}

export default Checkpoint;