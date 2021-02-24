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
  const { checkpointID, visible, isTeacher, questionIndex, question, handleInputChange, questionKey, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [input, setInput] = useState<SelectOneRowState>({ id: '', value: '' });

  const questionId = question.question.id;

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleRadioSelect = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.target as HTMLElement;
    setInput({ id: questionId, value: id });
    handleInputChange(questionId, id, checkpointID);
  };
  return (
    <>
      {visible && (
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
                  <React.Fragment key={`question_${questionId}_${questionOptionIndex}`}>
                    <span
                      id={option.label}
                      style={{ width: '18px', height: '18px' }}
                      className={`flex-shrink-0 mx-4 rounded-full cursor-pointer border 
                ${input.value === option.label ? 'bg-sea-green border-white' : 'bg-white border-black '}`}
                      data-value={option.label}
                      onClick={(e) => (!isTeacher ? handleRadioSelect(e) : null)}
                    />
                    <span>{option.text}</span>
                  </React.Fragment>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectOneQuestions;
