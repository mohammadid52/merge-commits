import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
    const { state, theme } = useContext(LessonContext);
    const imgArray = state.data.artist.images;

    

    return(
        <div className={`w-full h-80 ${theme.block.bg} py-2 px-4 mt-2 rounded-sm ${theme.block.shadow} flex flex-col justify-center items-center`}>
            <div className="w-full h-72 bg-local shadow-2 rounded-sm" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;

