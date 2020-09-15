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
    const { theme } = useContext(LessonContext);

    useEffect(() => {
        dispatch({ type: 'ACTIVATE_CHECKPOINT', payload: state.pages[state.currentPage].type })
    }, [])

    return (
        <div className={`w-full h-8/10 flex flex-col justify-between items-center`}>
            <div className="w-2/3 h-1.3/10 relative flex flex-row justify-center items-center mb-4">
                <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                    <div className="bg-dark-red absolute left-0 h-16 w-16 flex flex-col justify-center items-center z-20 rounded-lg">
                        <FaCheckSquare />
                    </div>
                </IconContext.Provider>
                <div className={`border-b border-white border-opacity-50 title w-full flex flex-row justify-center items-center text-5xl font-medium text-center font-open px-4 py-2 ${theme.block.text} z-10`}>
                    Checkpoint
                </div>
            </div>
            <div className={`w-2/3 ${theme.gradient.cardBase} xl rounded-lg p-4`}>
                { tempCheckPtSwitch(state.pages[state.currentPage].type) }
            </div>
        </div>
    )
}

export default Checkpoint;