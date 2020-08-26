import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import TrophyBlock from './TrophyBlock';
import Links from './Links';
import Feedback from './Feedback';

const Outro = () => {
    const { dispatch } = useContext(LessonContext);

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'outro'})
        dispatch({type: 'FINISH'})
    }, [])

    return (
        <div className="w-full md:h-full flex flex-col justify-between items-center">
            <Banner />

            <div className="w-full md:h-8.8/10 flex flex-col md:flex-row justify-between items-center">

                <div className="w-4.9/10 h-full flex flex-col justify-between">
                    <Feedback />
                    {/* <QuoteBlock /> */}
                    <TrophyBlock />
                    {/* <PhotoBlock /> */}
                </div>
                <div className="w-5/10 h-full mt-4 md:mt-0 md:ml-2">
                    <Links />
                </div>

            </div>

        </div>
    )
}

export default Outro