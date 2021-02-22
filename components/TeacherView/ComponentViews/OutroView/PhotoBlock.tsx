import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const PhotoBlock = (props: props) => {
    const {  fullscreen } = props;
    const { state } = useContext(LessonControlContext);
    const imgArray = state.data.lesson.artist.images;
    return(
        <div className="w-full h-full bg-dark-blue rounded-lg shadow-2 flex flex-col justify-center items-center">
            {fullscreen ? <div className="picture h-full bg-local shadow-2 rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})`, backgroundSize: '14rem' }}></div> 
            : <div className="picture h-full bg-local shadow-2 rounded-lg" style={{ backgroundImage: `url(${imgArray[0]})`, backgroundSize: '10rem' }}></div>}
            
            
        </div>
    )
}

export default PhotoBlock;
