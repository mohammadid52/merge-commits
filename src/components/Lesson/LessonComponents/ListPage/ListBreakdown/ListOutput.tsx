import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

/**
 * Module imports
 */
import { parseBlankLines } from '../../../../../utilities/strings';

interface ListOutputProps {
  list?: any;
  fullscreen?: boolean;
}

const ListOutput = (props: ListOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <>
      <div className={`w-full flex flex-col`}>
        {props.list && props.list !== [''] ? (
          props.list.map((item: string, i: number) => (
            <div
              key={`listoutput_${i}`}
              className={`my-4 leading-7 text-gray-200 align-middle ${theme.blockQuote}`}
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
