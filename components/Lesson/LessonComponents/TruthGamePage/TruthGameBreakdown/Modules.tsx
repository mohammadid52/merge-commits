import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

const keywordCapitilizer = (str: string) => {
  let capitalizedStr = str.replace(/^\w/, (char) => char.toUpperCase());
  return capitalizedStr;
};

const keywordParser = (str: string) => {
  if (typeof str !== 'string') {
    return null;
  }
  let tempWord = '';
  let initialArray = Array.from(str);
  let finalArray = [];
  initialArray.forEach((letter) => {
    if (letter !== ',') {
      tempWord = tempWord + letter;
    } else {
      finalArray.push(tempWord);
      tempWord = '';
    }
  });

  finalArray.push(tempWord);

  return finalArray;
};

const Modules = (props: any) => {
  const { theme, state } = useContext(LessonContext);
  const { additional, displayMode } = props;

  const length = state.data.lesson.warmUp.inputs.additionalInputs.length;

  if (!additional) {
    return null;
  }

  console.log(state, 'state');

  return (
    <div
      className={` flex ${
        displayMode === 'SELF'
          ? 'flex-col md:w-2/10 h-full'
          : displayMode === 'COOP'
          ? 'flex-row w-full h-2/10'
          : 'flex-row w-full h-2/10'
      } justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
      {additional.map((item: any, key: number) => {
        let wordArray = keywordParser(item.input);
        return (
          <div
            key={key}
            className={`
          ${
            length === 1 && displayMode === 'SELF'
              ? 'h-full'
              : length === 2 && displayMode === 'SELF'
              ? 'h-4.8/10'
              : length === 3 && displayMode === 'SELF'
              ? 'h-3.2/10'
              : length === 1 && displayMode === 'COOP'
              ? 'md:h-full md:w-full'
              : length === 2 && displayMode === 'COOP'
              ? 'md:h-full md:w-4.8/10'
              : length === 3 && displayMode === 'COOP'
              ? 'md:h-full md:w-3.2/10'
              : 'h-auto'
          } 
            ${theme.gradient.cardBase} font-open font-light h-16 rounded-lg px-4 py-2 ${
              key === additional.length - 1 ? '' : ''
            }`}>
            <h3>{keywordCapitilizer(item.name)}:</h3>
            <div className="w-full px-2 overflow-y-auto overflow-x-hidden">
              {item.input
                ? wordArray.map((word: string, key: number) => (
                    <p
                      key={key}
                      className={`${
                        displayMode === 'SELF'
                          ? 'text-base md:text-xl'
                          : displayMode === 'COOP'
                          ? 'text-base font-normal'
                          : // : displayMode === 'COOP' && fullscreen ?'text-base font-normal'
                            'text-base font-normal'
                      } `}>
                      {word}
                    </p>
                  ))
                : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Modules;
