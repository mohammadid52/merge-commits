import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * Module imports
 */
import {parseBlankLines} from '../../../../../utilities/strings';

interface ListOutputProps {
  list?: 'test';
  fullscreen?: boolean;
}

const ListOutput = (props: ListOutputProps) => {
  const { theme } = useContext(LessonControlContext);

  return (
    <>
      <div className='w-full flex flex-col'>
        {
          props.list !== '' 
          ? <div className={`text-gray-200 mb-2 align-middle leading-7`} dangerouslySetInnerHTML={{__html: parseBlankLines(props.list)}}></div>
          : <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a list :( </div>
        }
      </div>
    </>
  );
};

export default ListOutput;