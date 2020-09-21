import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

export interface CPQuestionProps {
  question: {
    id: string;
    label: string;
    options: Array<{ label: string; icon: string; color: string; text: string }>;
    question: string;
    type: string;
  };
  handleInputChange?: (e: any) => void;
  keyProp: any;
  value?: string;
}

interface SelectOneRowState {
  name: string;
  value: string;
}

const SelectOneQuestions = (selPrps: CPQuestionProps) => {
  const { state, dispatch } = useContext(LessonContext);

  return (
    <>
      <div key={selPrps.keyProp} className={'w-full flex flex-col mb-2'}>
        <p className='mb-2 text-md'>{selPrps.question.question}</p>
        <div className={`flex justify-around`}>
          {selPrps.question.options.map(
            (
              option: { label: string; icon: string; color: string; text: string },
              key2: number
            ) => (
              <div key={key2} className={`flex justify-center items-center text-xs`}>
                <input
                  id={selPrps.question.id}
                  className='w-4 mx-4 cursor-pointer'
                  type='radio'
                  name={selPrps.question.label}
                  value={option.label}
                  onChange={selPrps.handleInputChange}
                  checked={state.questionData[parseInt(selPrps.question.id)] === option.label}
                />
                <label htmlFor={`${option.text}`}>{option.text}</label>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default SelectOneQuestions;
