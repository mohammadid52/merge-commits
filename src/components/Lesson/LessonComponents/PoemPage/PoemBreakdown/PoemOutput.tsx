import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineForm } from 'react-icons/ai';
import { LessonContext } from '../../../../../contexts/LessonContext';

/**
 * Module imports
 */
import {parseBlankLines} from '../../../../../utilities/strings';

interface PoemOutputProps {
  poem?: string;
}

const PoemOutput = (props: PoemOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <>
      <div className={`w-full flex flex-col ${theme.blockQuote}`}>
        {
          props.poem !== ''
          ? <div className={`${theme.elem.text} my-4 leading-7 align-middle text-left`} dangerouslySetInnerHTML={{__html: parseBlankLines(props.poem)}}></div>
          : <div className={`${theme.elem.text} my-4 leading-7 align-middle text-center`}>You didn't write a poem :)</div>
        }
      </div>
    </>
  );
};

export default PoemOutput;
