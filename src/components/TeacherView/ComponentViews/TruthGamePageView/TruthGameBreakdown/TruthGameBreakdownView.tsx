import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';

interface props {
    fullscreen: boolean
}

const TruthGameBreakdown = (props: props) => {
    const { fullscreen } = props;
    const { state, dispatch, theme } = useContext(LessonControlContext);
    const [ dataProps, setDataProps ] = useState<{ truthGameArray: any, [key: string]: any} | null>(null)
    const inputs = state.data.lesson.warmUp.inputs;
    const { title } = state.data.lesson.warmUp.title;
    console.log(state.data.lesson.warmUp)

    // const displayProps = state.componentState.truthGame;
    // const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);


    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])


    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'warmup/breakdown' : state.studentViewing.studentInfo.lessonProgress === 'warmup/breakdown' : false;

    useEffect(() => {
        if (displayStudentData) {
            if ( state.studentViewing.studentInfo.warmupData ) {
                return setDataProps(state.studentViewing.studentInfo.warmupData)
            }
        } return setDataProps(null)
    }, [state.studentViewing]);

    // useEffect(() => {
    //     if ( state.pages[state.currentPage].displayMode !== displayMode ) {
    //         setDisplayMode(state.pages[state.currentPage].displayMode)
    //     }
    // }, [state.pages])

return (
    <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={title}
                fullscreen={fullscreen}
                />
            <div className="w-full h-7/10 flex flex-col md:flex-row justify-between">
                <div className={`${theme.gradient.cardBase} ${inputs.additionalInputs.length > 0 ? 'md:w-7.85/10' : 'w-full'} mb-4 md:mb-0 overflow-y-auto overflow-x-hidden h-full px-4 md:px-12 py-4 md:py-8 items-center text-md md:text-3xl font-light text-gray-200 rounded-lg shadow-2`}>
                    {dataProps ? dataProps.truthGameArray.map((item: {id: string, label: string, isLie: boolean, text: string}, key: number) => {
                        return (
                            <div className={`p-4`}>
                                
                                <div className={`text-2xl`}>
                                    {`${item.label}:`} 
                                </div>
                                <span className={`${item.isLie ? 'text-lg' : 'hidden'}`}> (this is your lie 🤥)</span>
                                <div className={`text-xl`}>
                                    {item.text}
                                </div>
                            </div>
                        )
                    }) : null }
                    
                    {/* { displayProps.truthGame } */}
                </div>
                { inputs.additionalInputs.length > 0 ?
                <Modules 
                    dataProps={dataProps} 
                    fullscreen={fullscreen}/>
                : null }
            </div>
            <ReflectionQuestions fullscreen={fullscreen}/>
        </div>
    )
}

export default TruthGameBreakdown;