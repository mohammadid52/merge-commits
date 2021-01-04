import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
    const { state } = useContext(LessonContext);
    const imgArray = state.data.lesson.artist.images;
    return(
        <div className="w-full h-full bg-dark-blue rounded-lg flex flex-col justify-center items-center">
            <div className="picture h-full bg-local rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;
