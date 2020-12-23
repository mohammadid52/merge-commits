import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

/**
 * Module imports
 */
import { parseBlankLines } from '../../../../../utilities/strings';

interface StoryOutputProps {
  story?: string[];
}

const StoryOutput = (props: StoryOutputProps) => {
  const { theme } = useContext(LessonContext);

  return (
    <>
      <div className={`w-full flex flex-col ${theme.blockQuote}`}>
        {props.story !== [''] ? (
          <div
            className={`text-gray-200 my-4 align-middle leading-7`}
            dangerouslySetInnerHTML={{ __html: parseBlankLines(props.story[0]) }}></div>
        ) : (
          <div className={`text-gray-200 my-4 align-middle leading-7`}>You didn't write a story </div>
        )}
      </div>
    </>
  );
};

export default StoryOutput;
