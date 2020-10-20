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
  const { theme } = useContext(LessonContext);
  const { additional, displayMode } = props;

  if (!additional) {
    return null;
  }

  // console.log(additional);

  return (
    <>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        <h3>Keywords:</h3>
      </div>
      <div className={`flex justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
        {additional.map((item: any, key: number) => {
          let wordArray = keywordParser(item.input);
          return (
            <div
              key={key}
              className={`font-open font-light h-16 rounded-lg py-2 ${
                key === additional.length - 1 ? '' : ''
              }`}>
              <h3>{keywordCapitilizer(item.name)}:</h3>
              <div className='w-full px-2 overflow-y-auto overflow-x-hidden'>
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
