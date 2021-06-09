import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * Module imports
 */
import { parseBlankLines } from '../../../../../utilities/strings';

interface ListOutputProps {
  list?: string[];
  fullscreen?: boolean;
}

const ListOutput = (props: ListOutputProps) => {
  const { theme } = useContext(LessonControlContext);

  return (
    <>
      <div className={`w-full flex flex-col`}>
        {props.list && props.list.length > 0 ? (
          props.list.map((item: string, i: number) => (
            <div
              key={`listoutput_${i}`}
              className={`text-gray-200 my-4 leading-7 align-middle ${theme.blockQuote}`}
              dangerouslySetInnerHTML={{ __html: parseBlankLines(item) }}></div>
          ))
        ) : (
          <div className={`${theme.elem.text} ${theme.blockQuote} my-4 leading-7 align-middle text-center`}>
            You didn't write a list :({' '}
          </div>
        )}
      </div>
    </>
  );
};

export default ListOutput;
