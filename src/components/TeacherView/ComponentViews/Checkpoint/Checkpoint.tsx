import React, { useContext, useEffect }  from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaCheckSquare } from 'react-icons/fa'
import SampleProfileQuestions from './SampleProfileQuestion';
import SampleSELQuestions from './SampleSELQuestions';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const tempCheckPtSwitch = (type: string, props: props) => {
    switch(type) {
        case 'profile': 
            return <SampleProfileQuestions />
        case 'sel':
            return <SampleSELQuestions fullscreen={props.fullscreen}/>
        default:
            return
    }
}

const Checkpoint = (props: props) => {
    const {fullscreen} = props;
    const { state, dispatch } = useContext(LessonControlContext)

    // useEffect(() => {
    //     dispatch({ type: 'ACTIVATE_CHECKPOINT', payload: state.pages[state.currentPage].type })
    // }, [])

    return (
        <div className={`w-full h-full flex flex-col justify-center items-center`}>
            <div className="w-2/3 flex flex-row justify-center items-center mb-4">
                <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                    <div className="red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                        <FaCheckSquare />
                    </div>
                </IconContext.Provider>
                <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-4xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 px-4 py-2 z-10">
                    Checkpoint
                </div>
            </div>
            <div className={`${fullscreen ? 'p-8' : 'p-4'} w-2/3 h-3/4 bg-dark-blue shadow-elem-dark rounded-lg`}>
                { tempCheckPtSwitch('sel', props) }
            </div>
        </div>
    )
}

export default Checkpoint;