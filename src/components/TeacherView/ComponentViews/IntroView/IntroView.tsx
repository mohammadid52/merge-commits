import React from 'react';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import InstructionsBlock from './InstructionsBlock';
import DoFirst from './DoFirst';

interface props {
    student: number | null
}

const IntroView = (props: props) => {
    const { student } = props
    return (
    <div className="w-full h-full flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-6/10 h-full flex flex-col justify-between items-center">
            <Banner />
            <div className="w-full h-4.3/10 flex">
                <QuoteBlock />
            </div>
            <div className="w-full h-4.3/10">
                <Block />
            </div>
        </div>
        <div className="md:w-3.9/10 h-full flex flex-col justify-between items-center">
            <DoFirst student={student} />
        </div>
    </div>
    )
}

export default IntroView;
