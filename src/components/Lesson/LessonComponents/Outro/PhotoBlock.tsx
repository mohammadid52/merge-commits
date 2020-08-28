import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
    const { state } = useContext(LessonContext);
    const imgArray = state.data.artist.images;
    return(
        <div className="w-full h-full bg-dark-blue rounded-lg shadow-2 flex flex-col justify-center items-center">
            <div className="picture h-full bg-local shadow-2 rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;
