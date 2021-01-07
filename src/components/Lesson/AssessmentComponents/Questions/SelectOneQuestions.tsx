import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import { QuestionInterface } from '../CheckpointQuestions';
import { QuestionProps } from '../Question';

interface SelectOneRowState {
  id: string;
  value: string;
}

const SelectOneQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, questionIndex, question, handleInputChange, questionKey, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [input, setInput] = useState<SelectOneRowState>({ id: '', value: '' });

  const questionId = question.question.id;

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleRadioSelect = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.target as HTMLElement;
    // const val = e.target.getAttribute('data-value');

    setInput({ id: questionId, value: id});
    handleInputChange(questionId, id);
  };
  return (
    <>
      <div key={questionKey} className={'flex flex-col mb-3'} id={`question_${questionId}`}>
        <p className={theme.elem.text}>
          <b>{questionIndex + 1}. </b>
          {question.question.question}
        </p>
        <div className={`flex justify-center`}>
          {question.question.options.map(
            (
              option: {
                label: string;
                icon: string;
                color: string;
                text: string;
              },
              questionOptionIndex: number
            ) => {
              return (
                <>
                  <span
                    id={option.label}
                    key={`question_${questionId}_${questionOptionIndex}`}
                    style={{width: '18px', height: '18px'}}
                    className={`flex-shrink-0 mx-4 rounded-full cursor-pointer border 
                    ${(input.value === option.label) 
                      ? 'bg-sea-green border-white' 
                      : 'bg-white border-black '}`}
                    data-value={option.label}
                    onClick={handleRadioSelect}
                  />
                  <span>{option.text}</span>
                </>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default SelectOneQuestions;
