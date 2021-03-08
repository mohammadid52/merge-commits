import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const PhotoBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const imgArray = state.data?.lesson?.artist?.images;

  return (
    <div className={`w-full h-full rounded-lg flex flex-col justify-center items-center`}>
      <div className='picture w-full h-72 bg-local rounded-lg'
           style={{ backgroundImage: `url(${imgArray ? imgArray[0] : null})` }} />
    </div>
  );
};

export default PhotoBlock;
