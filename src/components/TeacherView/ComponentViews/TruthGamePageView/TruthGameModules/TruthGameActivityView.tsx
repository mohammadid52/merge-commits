import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import TruthGameForm from './TruthGameFormView';

export interface TruthInput {
    id: string,
    label: string,
    isLie: boolean,
    text: string
}

export type TruthInputState = Array<TruthInput>

export interface TruthGameState {
    truthGameArray: Array<TruthInput>,
    [key: string]: any
}


interface props {
    fullscreen: boolean
}

const TruthGame = (props : props) => {
    const { fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    // const [ cookies, setCookie ] = useCookies([`lesson-${state.classroomID}`]);
    const inputs = state.data.lesson.warmUp.inputs;
    const video = state.data.lesson.warmUp.instructions.link
    const [ openPopup, setOpenPopup ] = useState(false)
    const [ dataProps, setDataProps ] = useState<{ truthGameArray: Array<TruthInput>, [key: string]: any}>()
    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'warmup' : state.studentViewing.studentInfo.lessonProgress === 'warmup' : false;

    useEffect(() => {
        if (displayStudentData) {
            if ( state.studentViewing.studentInfo.warmupData ) {
                return setDataProps(state.studentViewing.studentInfo.warmupData)
            } return setDataProps(null)
        }
    }, [state.studentViewing]);



    return (
       <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner fullscreen={fullscreen} />
                <div className="w-full h-8.8/10 flex flex-col items-center md:flex-row md:justify-between">
                    <div className="md:w-4/10 h-full flex flex-col justify-between items-center">
                        <InstructionsBlock fullscreen={fullscreen}/>
                        { inputs.additionalInputs.length > 0 ?
                            <Modules 
                                dataProps={dataProps}
                                inputs={inputs.additionalInputs}
                                fullscreen={fullscreen}
                            />
                            :
                            null
                        }
                    </div>
                    <div className="md:w-5.9/10 h-full flex flex-col items-center">
                        <TruthGameForm dataProps={dataProps} fullscreen={fullscreen} />
                    </div>
                </div>
            </div>
       </>
    )
}

export default TruthGame;