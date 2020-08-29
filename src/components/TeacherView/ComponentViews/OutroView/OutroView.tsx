import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import TrophyBlock from './TrophyBlock';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import Links from './Links';

interface props {
    student: number | null,
    fullscreen: boolean
}

const OutroView = (props: props) => {
    const { student, fullscreen } = props;
    const { dispatch } = useContext(LessonContext);

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'outro'})
        dispatch({type: 'FINISH'})
    }, [])

    return (
        <div className="w-full md:h-full flex flex-col justify-between items-center">
            <Banner fullscreen={fullscreen}/>

            <div className="w-full md:h-8.8/10 flex flex-col md:flex-row justify-between items-center">
                <div className="w-5/10 h-full mt-4 md:mt-0 md:ml-2">
                    <MoreArtist fullscreen={fullscreen}/>
                </div>

                <div className="w-4.8/10 h-full flex flex-col justify-between">
                    <div className="flex justify-between h-5/10">
                        <TrophyBlock fullscreen={fullscreen}/>
                        <Links fullscreen={fullscreen}/>
                    </div>
                    <Feedback fullscreen={fullscreen}/>
                </div>
            </div>

        </div>
    )
}

export default OutroView