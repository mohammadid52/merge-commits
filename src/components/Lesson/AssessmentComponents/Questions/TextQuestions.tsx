import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { QuestionProps } from '../Question';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface TextInputState {
  id: string;
  value: string;
}

const TextQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { visible, isTeacher, questionIndex, question, handleInputChange, questionKey, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [contents, setContents] = useState<TextInputState>({ id: '', value: '' });

  const questionId = question.question.id;

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, id } = e.target as HTMLTextAreaElement;
    setContents({
      id: questionId,
      value: value,
    });
    handleInputChange(questionId, value);
  };

  return (
    visible && (
      <div key={`question_${questionId}`} className={`${theme.elem.text} w-auto`}>
        <label className={theme.elem.text} htmlFor={question.question.label}>
          <p className={theme.elem.text}>
            <b>{questionIndex + 1}. </b>
            {question.question.question}
          </p>
        </label>
        <textarea
          id={questionId}
          className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
          value={contents.value}
          onChange={(e) => (!isTeacher) ? handleTextInputChange(e) : null}
        />
      </div>
    )
  );
};

export default TextQuestions;
