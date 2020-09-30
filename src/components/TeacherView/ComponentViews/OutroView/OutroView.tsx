import React, { useContext, useEffect } from 'react';
// import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import TrophyBlock from './TrophyBlock';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import Links from './Links';
import SaveQuit from './SaveQuit';
import { studentObject } from '../../../../state/LessonControlState';
// import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const OutroView = (props: props) => {
    const { fullscreen } = props;
    // const { dispatch } = useContext(LessonControlContext);

    return (
        <div className="w-full md:h-full flex flex-col justify-between items-center">
            <Banner fullscreen={fullscreen}/>

            <div className="w-full md:h-full flex flex-col justify-around items-center">
                <div className="w-5/10 h-8/10 flex flex-col justify-between items-center">
                    <Feedback fullscreen={fullscreen}/>
                    <MoreArtist fullscreen={fullscreen}/>
                    <SaveQuit fullscreen={fullscreen}/>
                </div>
            </div>

        </div>
    )
}

export default OutroView