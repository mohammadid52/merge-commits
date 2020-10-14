import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface StoryOutputProps {
  story?: string;
}

const StoryOutput = (props: StoryOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <>
    <div className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>
      Your Story:
    </div>
      <div className='w-full h-48 flex flex-col'>
        {
          props.story !== '' 
          ? <div>{props.story}</div>
          : <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a story </div>
        }
      </div>
    </>
  );
};

export default StoryOutput;
