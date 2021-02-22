import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import { keywordParser, keywordCapitilizer } from '../../../../../utilities/strings';

interface props {
  fullscreen: boolean;
  dataProps?: {
    title?: string;
    story?: string[];
    additional?: [
      {
        name: string;
        input: string;
      }
    ];
  };
}

const Modules = (props: props) => {
  const { fullscreen, dataProps } = props;
  const { theme, state } = useContext(LessonControlContext);

  const length = state.data.lesson.warmUp.inputs.additionalInputs.length;

  if (!dataProps || !dataProps.additional) {
    return null;
  }

  return (
    <div className={`flex justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
      {dataProps && dataProps.additional
        ? dataProps.additional.map((item: any, key: number) => {
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
          })
        : null}
    </div>
  );
};

export default Modules;
