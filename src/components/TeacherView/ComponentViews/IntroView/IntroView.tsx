import React, {useState} from 'react';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import InstructionsBlock from './InstructionsBlock';
import DoFirst from './DoFirst';

interface props {
    student: number | null,
    fullscreen: boolean
}

const IntroView = (props: props) => {
    const { student, fullscreen } = props;


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
            <DoFirst student={student} fullscreen={fullscreen}/>
        </div>
    </div>
    )
}

export default IntroView;
