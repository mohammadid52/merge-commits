import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';

const tempData = [
    {
      id: 'deepest-fear',
      label: 'Deepest fear',
      text: 'My deepest fear is losing someone I love',
      isLie: true
    },
    {
      id: 'most-anxious',
      label: 'Most anxious',
      text: 'I am most anxious about school'
    },
    {
      id: 'happiest-moment',
      label: 'Happiest moment',
      text: 'My happiest moment was when I got a new iPhone'
    }
  ]


const SelfDisplay = () => {
    const { state, theme, dispatch } = useContext(LessonContext);
    console.log(state, 'state')
    const displayProps = state.componentState.truthGame;
    const inputs = state.data.lesson.warmUp.inputs;

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    const [fullscreen, setFullscreen] = useState(false);
    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={state.data.lesson.warmUp.title} 
                display='SELF' fullscreen={fullscreen}/>
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div className={`${theme.gradient.cardBase} ${inputs.additionalInputs.length > 0 ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-y-auto overflow-x-hidden h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl font-light text-gray-200 rounded-lg shadow-2`}>
                    {tempData.map((item: {id: string, label: string, isLie: boolean, text: string}, key: number) => {
                        return (
                            <div className={`p-4`}>
                                
                                <div className={``}>
                                    {`${item.label}:`} 
                                </div>
                                <span className={`${item.isLie ? 'text-lg' : 'hidden'}`}> (this is your lie 🤥)</span>
                                <div className={`text-xl`}>
                                    {item.text}
                                </div>
                            </div>
                        )
                    })}
                    
                    {/* { displayProps.truthGame } */}
                </div>
                { inputs.additionalInputs.length > 0 ?
                <Modules 
                    additional={displayProps.additional} 
                    displayMode = 'SELF'/>
                : null }
            </div>
            <ReflectionQuestions />
        </div>
    )
}

export default SelfDisplay;