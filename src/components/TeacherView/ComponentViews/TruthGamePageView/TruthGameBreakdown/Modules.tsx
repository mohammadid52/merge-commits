import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

type InputProp = [{ name: string; example: string; prompt: string }];

export interface TruthInput {
  id: string;
  label: string;
  isLie: boolean;
  text: string;
}

interface ModulesProps {
  // inputs: InputProp;
  fullscreen: boolean;
  dataProps?: {
    truthGameArray: Array<TruthInput>;
    additional?: [
      {
        name: string;
        input: string;
      }
    ];
  };
}

interface FormInputsState {
  [key: string]: string;
}

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

const Modules = (props: ModulesProps) => {
  const { fullscreen, dataProps } = props;
  const { theme, state } = useContext(LessonControlContext);

  if (!dataProps || !dataProps.additional) {
    return null;
  }

  const length = state.data.lesson.warmUp.inputs.additionalInputs.length;

  return (
    <div className={`flex md:w-full h-2.8/10 justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
      {dataProps && dataProps.additional
        ? dataProps.additional.map((item: any, key: number) => {
            let wordArray = keywordParser(item.input);
            return (
              <div
                key={key}
                className={`${
                  length === 1 ? 'w-full' : length === 2 ? 'w-4.8/10' : length === 3 ? 'md:w-3.2/10' : ''
                } h-full ${theme.gradient.cardBase} font-open font-light shadow-2 rounded-lg px-4 py-2 ${
                  key === dataProps.additional.length - 1 ? '' : ''
                }`}>
                <h3>{keywordCapitilizer(item.name)}:</h3>
                <div className="w-full px-2 overflow-scroll h-8/10">
                  {item.input
                    ? wordArray.map((word: string, key: number) => (
                        <p key={key} className={`${fullscreen ? 'text-sm md:text-base' : 'text-xs'} font-normal`}>
                          {word}
                        </p>
                      ))
                    : null}
                </div>
              </div>
            );
          })
        : null}
      {/* <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>Culture:</h3>
                <p className="text-2xl">{displayProps.culture}</p>
            </div>
            <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>My Storyteller:</h3>
                <p className="text-2xl">{displayProps.storyteller}</p>
            </div>
            <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>Morals:</h3>
                <div className="h-24 flex flex-col overflow-scroll">
                    {keywordParser(displayProps.lessons).map((term, key) => (
                        <p className="text-2xl" key={key}>
                            {term}
                        </p>
                    ))
                    }
                </div>
            </div> */}
    </div>
  );
};

export default Modules;
