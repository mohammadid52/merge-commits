import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * Module imports
 */
import { parseBlankLines } from '../../../../../utilities/strings';

interface StoryOutputProps {
  story?: string[];
}

const StoryOutput = (props: StoryOutputProps) => {
  const { theme } = useContext(LessonControlContext);

  return (
    <>
      <div className={`w-full flex flex-col ${theme.blockQuote}`}>
        {props.story !== [''] ? (
          <div
            className={`text-gray-200 mb-2 align-middle leading-7`}
            dangerouslySetInnerHTML={{ __html: parseBlankLines(props.story[0]) }}></div>
        ) : (
          <div className={`${theme.elem.text} align-middle text-center`}>You didn't write a story </div>
        )}
      </div>
    </>
  );
};

export default StoryOutput;
