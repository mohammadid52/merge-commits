import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import TrophyBlock from './TrophyBlock';

const Outro = () => {
    const { dispatch } = useContext(LessonContext);

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'outro'})
        dispatch({type: 'FINISH'})
    }, [])

    return (
        <div className="w-full md:h-160 flex flex-col items-center content-center">
            <Banner />
            <div className="w-full md:h-88 flex flex-col md:flex-row justify-center items-center mt-3">
                <div className="w-full h-full md:mr-2">
                    <QuoteBlock />
                    <TrophyBlock />
                </div>
                <div className="w-full h-full mt-4 md:mt-0 md:ml-2">
                    <PhotoBlock />
                </div>
            </div>
        </div>
    )
}

export default Outro