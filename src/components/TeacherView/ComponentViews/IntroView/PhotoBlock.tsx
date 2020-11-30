import React, { useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

const PhotoBlock = () => {
    const { state, theme } = useContext(LessonControlContext);
    const imgArray = state.data.lesson.artist.images;

    useEffect(()=>{
        console.log('teacher photoblock: ', imgArray)
    },[])

    return (
        <div className={`w-full h-full rounded-lg flex flex-col justify-center items-center`}>
            <div className='picture w-full h-72 bg-local rounded-lg' style={{ backgroundImage: `url(${imgArray[0]})` }}></div>
        </div>
    )
}

export default PhotoBlock;

