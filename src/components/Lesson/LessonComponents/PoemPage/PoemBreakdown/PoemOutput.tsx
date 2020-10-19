import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface PoemOutputProps {
  poem?: string;
}

const PoemOutput = (props: PoemOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <>
    <div className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>
      Your Poem:
    </div>
      <div className='w-full h-48 flex flex-col'>
        {
          typeof props.poem !== 'undefined'
          ? <div className={`${theme.elem.text} align-middle text-center`}>{props.poem}</div>
          : <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a poem :)</div>
        }
      </div>
    </>
  );
};

export default PoemOutput;
