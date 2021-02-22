import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

import { keywordParser, keywordCapitilizer } from '../../../../../utilities/strings';

const Modules = (props: any) => {
  const { theme, state } = useContext(LessonContext);
  const { additional, displayMode } = props;

  const length = state.data.lesson.warmUp.inputs.additionalInputs.length;

  if (!additional) {
    return null;
  }

  // console.log(additional);

  return (
    <>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        <h3>About The Story:</h3>
      </div>
      <div className={`flex justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
        {additional.map((item: any, key: number) => {
          let wordArray = keywordParser(item.input);
          return (
            <div key={key} className={`font-open font-light h-auto rounded-lg py-2`}>
              <h3 className={`font-medium`}>{keywordCapitilizer(item.name)}:</h3>
              <div className="w-full overflow-y-auto overflow-x-hidden">
                {item.input
                  ? wordArray.map((word: string, key: number) => (
                      <p key={key} className={``}>
                        {word}
                      </p>
                    ))
                  : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Modules;
