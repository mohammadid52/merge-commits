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
  const handleRadioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target as HTMLInputElement;
    setInput({ id: questionId, value: id });
    handleInputChange(questionId, id);
  };
  return (
    <>
      <div key={questionKey} className={'flex flex-col mb-3'}>
        <p className={theme.elem.text}>
          <b>{questionIndex + 1}. </b>
          {
            question
            .question
            .question
          }
        </p>
        <div className={`flex justify-center`}>
          {
            question
              .question
              .options
              .map(
            (option:
               {
                 label: string;
                 icon: string;
                 color: string;
                 text: string
               }, questionOptionIndex: number) => {
              return (
                <div key={`question_${questionId}_${questionOptionIndex}`} className={`${theme.elem.text} w-auto`}>
                  <label className="w-auto cursor-pointer flex flex-row">
                    <input
                      id={`${questionOptionIndex + 1}`}
                      className="w-12 my-auto mx-4 cursor-pointer"
                      type="radio"
                      name={question.label}
                      value={option.label}
                      onChange={handleRadioSelect}
                      checked={input.value === option.label}
                    />
                    <span>{option.text}</span>
                  </label>
                </div>
              );
            }
          )
          }
        </div>
      </div>
    </>
  );
};

export default SelectOneQuestions;
