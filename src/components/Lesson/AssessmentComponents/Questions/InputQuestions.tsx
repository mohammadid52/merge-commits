import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { QuestionProps } from '../Question';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface TextInputState {
  id: string;
  value: string;
}

const InputQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { checkpointID, visible, isTeacher, questionIndex, question, handleInputChange, questionKey, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [contents, setContents] = useState<TextInputState>({ id: '', value: '' });

  const questionId = question.question.id;

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target as HTMLInputElement;
    setContents({
      id: questionId,
      value: value,
    });
    handleInputChange(questionId, value, checkpointID);
  };

  return (
    visible &&
      (
        question && (
          <div key={`question_${questionId}`} className={`${theme.elem.text} ${theme.underline} w-auto my-4`}>
            <label htmlFor={question.question.label}>
              <p className={`${theme.elem.text} mb-4`}>
                <b>{questionIndex + 1}. </b>
                {question.question.question}
              </p>
            </label>
            <input
              id={questionId}
              className={`${theme.elem.textInput} w-full rounded-xl`}
            type="text"
            name={question.question.label}
            value={contents.value}
            onChange={(e)=> (!isTeacher) ? handleTextInputChange(e): null}
          />
        </div>
      )
    )
  );
};

export default InputQuestions;
