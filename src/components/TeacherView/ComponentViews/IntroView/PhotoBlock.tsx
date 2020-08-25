import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
    const { state, theme } = useContext(LessonContext);
    const imgArray = state.data.artist.images;

    

    return(
        <div className={`w-full h-full ${theme.block.bg} py-2 px-4 rounded-lg flex flex-col justify-center items-center`}>
            <div className="bg-no-repeat bg-center bg-cover w-full h-full bg-local shadow-2 rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})` }}>
            </div>
        </div>
    )
}

export default PhotoBlock;

