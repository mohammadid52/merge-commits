import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';


const SelfDisplay = () => {
    const { state, theme, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.poll;
    const inputs = state.data.lesson.warmUp.inputs;

    console.log(displayProps, 'displayProps')

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    const [fullscreen, setFullscreen] = useState(false);
    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={state.data.lesson.warmUp.title} 
                display='SELF' fullscreen={fullscreen}/>
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div style={{'whiteSpace' : 'pre-line'}} className={`${theme.gradient.cardBase} ${displayProps.additional ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-y-auto overflow-x-hidden h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl font-light text-gray-200 rounded-lg shadow-2`}>
                    {displayProps ? displayProps.pollOptions.map((item: {id: string, question: string, answer: any}, key: number) => {
                        return ( <div key={key} className={`py-4`}>
                                <div className={`text-xl mb-4`}>
                                    {`${item.question}:`} 
                                </div>
                                <div className={`text-2xl text-center`}>
                                    {item.answer}
                               
                                </div>
                            </div>
                        )
                    }) : null }
                </div>
                <Modules 
                    additional={displayProps.additional} 
                    displayMode = 'SELF'/>
            </div>
            <ReflectionQuestions />
        </div>
    )
}

export default SelfDisplay;