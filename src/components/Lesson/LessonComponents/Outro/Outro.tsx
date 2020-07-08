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
    }, [])

    return (
        <div className="w-full h-160 flex flex-col items-center content-center">
            <Banner />
            <div className="w-full h-88 flex justify-center items-center mt-3">
                <div className="w-full h-full mr-2">
                    <QuoteBlock />
                    <TrophyBlock />
                </div>
                <div className="w-full h-full ml-2">
                    <PhotoBlock />
                </div>
            </div>
        </div>
    )
}

export default Outro