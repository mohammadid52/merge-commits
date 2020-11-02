import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import InstructionsBlock from './InstructionsBlock';
import Keyword from './Keyword';
import Connect from './Connect';
import DoFirst from './DoFirst';

interface props {
    fullscreen: boolean
}

const IntroView = (props: props) => {
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const [doFirstData, setDoFirstData] = useState<{ [key: string]: any }>()
    const { fullscreen } = props;

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'intro' : false;


    return (
        <div className={theme.section}>
            <Banner fullscreen={fullscreen} />
            <div
                className='h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl'
                style={{ backgroundImage: `url(https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/marlon_reading.jpg)` }}>
                <QuoteBlock fullscreen={fullscreen} />
            </div>
                <Keyword fullscreen={fullscreen}/>
            <div className='flex flex-col justify-between items-center'>
                <DoFirst data={doFirstData ? doFirstData : null} fullscreen={fullscreen} />
            </div>
            <Connect fullscreen={fullscreen} />
        </div>
    )
}

export default IntroView;
