import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
    const { state } = useContext(LessonContext);
    const imgArray = state.data.artist.images;
    return(
        <div className="w-full h-88 bg-dark-blue py-2 px-4 rounded-sm shadow-2 flex flex-col justify-center items-center">
            <div className="w-full h-80 bg-local shadow-2 rounded-sm" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;
