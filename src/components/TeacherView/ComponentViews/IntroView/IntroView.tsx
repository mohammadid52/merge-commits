import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import InstructionsBlock from './InstructionsBlock';
import DoFirst from './DoFirst';

interface props {
    fullscreen: boolean
}

const IntroView = (props: props) => {
    const { state, dispatch } = useContext(LessonControlContext);
    const [ doFirstData, setDoFirstData ] = useState<{ [key: string]: any }>()
    const { fullscreen } = props;

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'intro' : state.studentViewing.studentInfo.lessonProgress === 'intro' : false;


    return (
    <div className="w-full h-full flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-6/10 h-full flex flex-col justify-between items-center">
            <Banner 
                fullscreen={fullscreen}/>
            <div className="w-full h-4.3/10 flex">
                <QuoteBlock 
                    fullscreen={fullscreen}/>
            </div>
            <div className="w-full h-4.3/10">
                <Block
                    fullscreen={fullscreen} />
            </div>
        </div>
        <div className="md:w-3.9/10 h-full flex flex-col justify-between items-center">
            <DoFirst data={ doFirstData ? doFirstData : null } fullscreen={fullscreen}/>
        </div>
    </div>
    )
}

export default IntroView;
