import React, {useContext} from 'react';
import {LessonContext} from '../../../../../contexts/LessonContext';

import {keywordCapitilizer, keywordParser} from '../../../../../utilities/strings';
import {LessonControlContext} from '../../../../../contexts/LessonControlContext';
import {PollBreakdownProps} from './PollBreakdown';

const Modules = (props: PollBreakdownProps) => {
  /**
   * Teacher switch
   */
  const {isTeacher, dataProps} = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme} = switchContext;

  const length = state.data.lesson.warmUp.inputs.additionalInputs.length;

  if (dataProps && !dataProps.additional) {
    return null;
  }

  return (
    <div
      className={`flex justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`}>
      {dataProps ? (
        dataProps.additional.map((item: any, key: number) => {
          let wordArray = keywordParser(item.input);
          return (
            <div key={key} className={` font-light h-auto rounded-lg py-2`}>
              <h3>{keywordCapitilizer(item.name)}:</h3>
              <div className="w-full overflow-y-auto overflow-x-hidden">
                {item.input
                  ? wordArray.map((word: string, key: number) => (
                      <p key={`poll_module_${key}`}>{word}</p>
                    ))
                  : null}
              </div>
            </div>
          );
        })
      ) : (
        <div className={` font-light h-auto rounded-lg py-2`}>
          <div className="w-full overflow-y-auto overflow-x-hidden">
            No poll answers...
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
