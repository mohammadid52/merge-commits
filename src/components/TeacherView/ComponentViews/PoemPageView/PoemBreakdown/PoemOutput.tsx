import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * Module imports
 */
import {parseBlankLines} from '../../../../../utilities/strings';

interface PoemOutputProps {
  poem?: string;
}

const PoemOutput = (props: PoemOutputProps) => {
  const { theme } = useContext(LessonControlContext);

  return (
    <>
    <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
      Your Poem:
    </div>
      <div className='w-full h-48 flex flex-col'>
        {
          props.poem !== ''
          ? <div className={`${theme.elem.text} align-middle text-center`} dangerouslySetInnerHTML={{__html: parseBlankLines(props.poem)}}></div>
          : <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a poem :)</div>
        }
      </div>
    </>
  );
};

export default PoemOutput;
