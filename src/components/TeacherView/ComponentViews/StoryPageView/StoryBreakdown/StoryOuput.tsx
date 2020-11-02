import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface StoryOutputProps {
  story?: string;
}

const StoryOutput = (props: StoryOutputProps) => {
  const { theme } = useContext(LessonControlContext);

  return (
    <>
    <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
      Your Story:
    </div>
      <div className='w-full h-48 flex flex-col'>
        {
          props.story !== '' 
          ? <div className={`${theme.elem.text} align-middle text-center`}>{props.story}</div>
          : <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a story </div>
        }
      </div>
    </>
  );
};

export default StoryOutput;
