import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

const PhotoBlock = () => {
    const { state, theme } = useContext(LessonControlContext);
    const imgArray = state.data.lesson.artist.images;

    

    return(
        <div className={`w-full h-full ${theme.block.bg} rounded-lg flex flex-col justify-center items-center`}>
            <div className="bg-no-repeat bg-center bg-cover w-full h-full bg-local shadow-2 rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;

